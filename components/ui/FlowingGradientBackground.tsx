'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const fragmentShader = `
#define MAX_COLORS 8
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
varying vec2 vUv;

// Smooth noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  vec2 p = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
  p.x *= uResolution.x / uResolution.y;
  
  // Add mouse influence
  float mouseDist = length(p - uMouse);
  float mouseEffect = (1.0 - smoothstep(0.0, 2.0, mouseDist)) * uMouseInfluence;
  p += (p - uMouse) * mouseEffect * 0.1;
  
  // Create flowing waves with multiple layers (speed-adjusted)
  float t = uTime * uSpeed;
  float wave1 = snoise(vec2(p.x * 0.8 + t * 0.15, p.y * 0.8 - t * 0.1));
  float wave2 = snoise(vec2(p.x * 1.2 - t * 0.12, p.y * 1.2 + t * 0.08));
  float wave3 = snoise(vec2(p.x * 0.6 + t * 0.1, p.y * 0.6 - t * 0.15));
  
  // Combine waves for more organic flow
  float combined = (wave1 + wave2 * 0.7 + wave3 * 0.5) / 2.2;
  
  // Add slow drift
  float drift = sin(t * 0.05 + p.x * 0.5) * 0.3 + cos(t * 0.07 + p.y * 0.5) * 0.3;
  combined += drift;
  
  vec3 color;
  
  if (uColorCount > 0) {
    // Custom colors mode - interpolate between provided colors
    float ct = combined * 0.5 + 0.5 + uTime * uSpeed * 0.05;
    ct = fract(ct) * float(uColorCount);
    
    int idx0 = int(floor(ct));
    int idx1 = int(mod(floor(ct) + 1.0, float(uColorCount)));
    float blend = fract(ct);
    
    vec3 col0 = uColors[idx0];
    vec3 col1 = uColors[idx1];
    color = mix(col0, col1, blend);
  } else {
    // Default rainbow mode
    float hue = combined * 0.5 + 0.5 + uTime * uSpeed * 0.05;
    hue = fract(hue);
    
    // Convert HSV to RGB for vibrant colors
    float h = hue * 6.0;
    float x = 1.0 - abs(mod(h, 2.0) - 1.0);
    
    if (h < 1.0) color = vec3(1.0, x, 0.0);
    else if (h < 2.0) color = vec3(x, 1.0, 0.0);
    else if (h < 3.0) color = vec3(0.0, 1.0, x);
    else if (h < 4.0) color = vec3(0.0, x, 1.0);
    else if (h < 5.0) color = vec3(x, 0.0, 1.0);
    else color = vec3(1.0, 0.0, x);
  }
  
  // Add depth variation
  float brightness = 0.4 + abs(combined) * 0.6;
  color *= brightness;
  
  // Enhance saturation
  float saturation = 1.2;
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(gray), color, saturation);
  
  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

interface FlowingGradientBackgroundProps {
    colors?: string[];
    speed?: number;
    mouseInfluence?: number;
}

export default function FlowingGradientBackground({
    colors = [],
    speed = 1.0,
    mouseInfluence = 0
}: FlowingGradientBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const materialRef = useRef<THREE.ShaderMaterial | null>(null);
    const rafRef = useRef<number | null>(null);
    const mouseRef = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const geometry = new THREE.PlaneGeometry(2, 2);
        const colorVectors = Array.from({ length: 8 }, () => new THREE.Vector3(0, 0, 0));

        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uSpeed: { value: speed },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uMouseInfluence: { value: mouseInfluence },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uColorCount: { value: 0 },
                uColors: { value: colorVectors }
            }
        });
        materialRef.current = material;

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: 'high-performance'
        });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        const clock = new THREE.Clock();

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            material.uniforms.uResolution.value.set(width, height);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.set(x, y);
        };

        window.addEventListener('resize', handleResize);
        if (mouseInfluence > 0) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        const animate = () => {
            material.uniforms.uTime.value = clock.getElapsedTime();
            material.uniforms.uMouse.value.copy(mouseRef.current);
            renderer.render(scene, camera);
            rafRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentElement === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        const material = materialRef.current;
        if (!material) return;

        material.uniforms.uSpeed.value = speed;
        material.uniforms.uMouseInfluence.value = mouseInfluence;
    }, [speed, mouseInfluence]);

    useEffect(() => {
        const material = materialRef.current;
        if (!material) return;

        const hexToVec3 = (hex: string): THREE.Vector3 => {
            const h = hex.replace('#', '').trim();
            const r = parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16) / 255;
            const g = parseInt(h.length === 3 ? h[1] + h[1] : h.slice(2, 4), 16) / 255;
            const b = parseInt(h.length === 3 ? h[2] + h[2] : h.slice(4, 6), 16) / 255;
            return new THREE.Vector3(r, g, b);
        };

        const validColors = (colors || []).filter(Boolean).slice(0, 8);

        for (let i = 0; i < 8; i++) {
            if (i < validColors.length) {
                material.uniforms.uColors.value[i].copy(hexToVec3(validColors[i]));
            } else {
                material.uniforms.uColors.value[i].set(0, 0, 0);
            }
        }

        material.uniforms.uColorCount.value = validColors.length;
    }, [colors]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-full h-full -z-10"
            style={{ background: '#000' }}
        />
    );
}
