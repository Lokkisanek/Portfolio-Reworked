'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { X, Hand } from 'lucide-react';

// MediaPipe types
interface Landmark {
    x: number;
    y: number;
    z: number;
}

interface HandsResults {
    multiHandLandmarks?: Landmark[][];
    multiHandedness?: { label: string; score: number }[];
}

interface HandGestureControlProps {
    isActive: boolean;
    onClose: () => void;
}

// Landmark indices
const INDEX_FINGER_TIP = 8;
const THUMB_TIP = 4;

// Smoothing factor for cursor movement (0-1, lower = smoother)
const CURSOR_SMOOTHING = 0.15;
// Pinch detection settings
const PINCH_THRESHOLD = 0.065;
const PINCH_RELEASE_THRESHOLD = 0.085;
// Debounce frames for pinch state changes
const PINCH_DEBOUNCE_FRAMES = 1;
// Scroll sensitivity
const SCROLL_SENSITIVITY = 2;
const SCROLL_DEADZONE = 3;
// Frame throttling - process every N ms (lower = smoother but more CPU)
const DETECTION_INTERVAL_MS = 33; // ~30 FPS for detection

export default function HandGestureControl({ isActive, onClose }: HandGestureControlProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const handsRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const lastDetectionTime = useRef(0);
    const isProcessingRef = useRef(false);
    const landmarksBufferRef = useRef<Landmark[] | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const [isTracking, setIsTracking] = useState(false);
    const [isPinching, setIsPinching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Smooth cursor position using motion values with optimized spring settings
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);
    const smoothCursorX = useSpring(cursorX, { stiffness: 120, damping: 18, mass: 0.2 });
    const smoothCursorY = useSpring(cursorY, { stiffness: 120, damping: 18, mass: 0.2 });

    // Refs for tracking state without re-renders
    const lastCursorPos = useRef({ x: 0, y: 0 });
    const lastPinchY = useRef<number | null>(null);
    const pinchFrameCount = useRef(0);
    const isPinchingRef = useRef(false);
    const scrollAccumulator = useRef(0);

    // Calculate distance between two landmarks
    const getDistance = (p1: Landmark, p2: Landmark): number => {
        return Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + 
            Math.pow(p1.y - p2.y, 2) + 
            Math.pow(p1.z - p2.z, 2)
        );
    };

    // Smooth value transition
    const lerp = (start: number, end: number, factor: number): number => {
        return start + (end - start) * factor;
    };

    // Draw hand landmarks on canvas
    const drawLandmarks = useCallback((
        ctx: CanvasRenderingContext2D,
        landmarks: Landmark[],
        width: number,
        height: number,
        isPinch: boolean
    ) => {
        // Hand connections for skeleton
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8], // Index
            [0, 9], [9, 10], [10, 11], [11, 12], // Middle
            [0, 13], [13, 14], [14, 15], [15, 16], // Ring
            [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
            [5, 9], [9, 13], [13, 17] // Palm
        ];

        const baseColor = isPinch ? '#ff6b9d' : '#00ff88';
        const glowColor = isPinch ? 'rgba(255, 107, 157, 0.4)' : 'rgba(0, 255, 136, 0.4)';

        // Add glow effect
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 8;

        // Draw connections (skeleton)
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        connections.forEach(([start, end]) => {
            const p1 = landmarks[start];
            const p2 = landmarks[end];
            ctx.beginPath();
            ctx.moveTo(p1.x * width, p1.y * height);
            ctx.lineTo(p2.x * width, p2.y * height);
            ctx.stroke();
        });

        // Reset shadow for points
        ctx.shadowBlur = 0;

        // Draw landmarks (points)
        landmarks.forEach((landmark, index) => {
            const x = landmark.x * width;
            const y = landmark.y * height;
            
            // Highlight thumb and index finger tips
            if (index === THUMB_TIP || index === INDEX_FINGER_TIP) {
                ctx.fillStyle = isPinch ? '#ff3366' : '#ffaa00';
                ctx.shadowColor = isPinch ? 'rgba(255, 51, 102, 0.6)' : 'rgba(255, 170, 0, 0.6)';
                ctx.shadowBlur = 12;
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                ctx.fillStyle = baseColor;
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        });

        // Draw line between thumb and index when close to pinching
        const thumbTip = landmarks[THUMB_TIP];
        const indexTip = landmarks[INDEX_FINGER_TIP];
        const distance = getDistance(thumbTip, indexTip);
        
        if (distance < 0.15) {
            ctx.strokeStyle = isPinch ? '#ff3366' : '#ffaa00';
            ctx.lineWidth = isPinch ? 3 : 2;
            ctx.setLineDash(isPinch ? [] : [4, 4]);
            ctx.beginPath();
            ctx.moveTo(thumbTip.x * width, thumbTip.y * height);
            ctx.lineTo(indexTip.x * width, indexTip.y * height);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }, []);

    // Track if tracking state changed to avoid unnecessary re-renders
    const isTrackingRef = useRef(false);

    // Process hand detection results - optimized to minimize state updates
    const onResults = useCallback((results: HandsResults) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        
        if (!canvas || !ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Only update tracking state if it changed
            if (!isTrackingRef.current) {
                isTrackingRef.current = true;
                setIsTracking(true);
            }
            const landmarks = results.multiHandLandmarks[0];

            // Get index finger tip position for cursor
            const indexTip = landmarks[INDEX_FINGER_TIP];
            const thumbTip = landmarks[THUMB_TIP];

            // Map to screen coordinates (inverted x for mirror effect)
            const rawX = (1 - indexTip.x) * window.innerWidth;
            const rawY = indexTip.y * window.innerHeight;

            // Smooth cursor movement
            const smoothedX = lerp(lastCursorPos.current.x, rawX, 1 - CURSOR_SMOOTHING);
            const smoothedY = lerp(lastCursorPos.current.y, rawY, 1 - CURSOR_SMOOTHING);
            
            lastCursorPos.current = { x: smoothedX, y: smoothedY };
            cursorX.set(smoothedX);
            cursorY.set(smoothedY);

            // Check for pinch gesture with hysteresis
            const pinchDistance = getDistance(indexTip, thumbTip);
            const wasPinching = isPinchingRef.current;
            
            // Use different thresholds for entering vs exiting pinch state (hysteresis)
            const threshold = wasPinching ? PINCH_RELEASE_THRESHOLD : PINCH_THRESHOLD;
            const shouldPinch = pinchDistance < threshold;

            // Debounce pinch state changes
            if (shouldPinch !== wasPinching) {
                pinchFrameCount.current++;
                if (pinchFrameCount.current >= PINCH_DEBOUNCE_FRAMES) {
                    isPinchingRef.current = shouldPinch;
                    setIsPinching(shouldPinch);
                    pinchFrameCount.current = 0;

                    if (shouldPinch) {
                        // Pinch started
                        lastPinchY.current = smoothedY;
                        scrollAccumulator.current = 0;
                        
                        // Trigger click at cursor position
                        simulateClick(smoothedX, smoothedY);
                    } else {
                        // Pinch released
                        lastPinchY.current = null;
                        scrollAccumulator.current = 0;
                    }
                }
            } else {
                pinchFrameCount.current = 0;
            }

            // Handle scrolling while pinching
            if (isPinchingRef.current && lastPinchY.current !== null) {
                const deltaY = lastPinchY.current - smoothedY;
                scrollAccumulator.current += deltaY;
                
                if (Math.abs(scrollAccumulator.current) > SCROLL_DEADZONE) {
                    const scrollAmount = scrollAccumulator.current * SCROLL_SENSITIVITY;
                    window.scrollBy({ top: scrollAmount, behavior: 'auto' });
                    scrollAccumulator.current = 0;
                    lastPinchY.current = smoothedY;
                }
            }

            // Draw hand skeleton
            drawLandmarks(ctx, landmarks, canvas.width, canvas.height, isPinchingRef.current);
        } else {
            // Only update tracking state if it changed
            if (isTrackingRef.current) {
                isTrackingRef.current = false;
                setIsTracking(false);
            }
        }
    }, [drawLandmarks, cursorX, cursorY]);

    // Simulate click at position with full event sequence
    const simulateClick = useCallback((x: number, y: number) => {
        const element = document.elementFromPoint(x, y);
        if (!element) return;

        // Find the actual clickable element (might be parent)
        const clickableElement = element.closest('a, button, [role="button"], [onclick], input, select, textarea') || element;
        
        const eventOptions = {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            screenX: x,
            screenY: y,
            button: 0,
            buttons: 1,
        };

        // Dispatch full mouse event sequence for proper click handling
        const mouseDown = new MouseEvent('mousedown', eventOptions);
        const mouseUp = new MouseEvent('mouseup', eventOptions);
        const click = new MouseEvent('click', eventOptions);
        
        // Also dispatch pointer events for modern handlers
        const pointerDown = new PointerEvent('pointerdown', {
            ...eventOptions,
            pointerId: 1,
            pointerType: 'touch',
            isPrimary: true,
        });
        const pointerUp = new PointerEvent('pointerup', {
            ...eventOptions,
            pointerId: 1,
            pointerType: 'touch',
            isPrimary: true,
        });

        // Dispatch events in proper sequence
        clickableElement.dispatchEvent(pointerDown);
        clickableElement.dispatchEvent(mouseDown);
        
        // Small delay between down and up for realism
        requestAnimationFrame(() => {
            clickableElement.dispatchEvent(pointerUp);
            clickableElement.dispatchEvent(mouseUp);
            clickableElement.dispatchEvent(click);
            
            // Focus and native click as fallback
            if (clickableElement instanceof HTMLElement) {
                clickableElement.focus();
                // For links and buttons, also trigger native click
                if (clickableElement.tagName === 'A' || clickableElement.tagName === 'BUTTON') {
                    clickableElement.click();
                }
            }
        });
    }, []);

    // Initialize MediaPipe Hands
    useEffect(() => {
        if (!isActive) return;

        let isMounted = true;

        const initializeHands = async () => {
            try {
                // Dynamically import MediaPipe
                const { Hands } = await import('@mediapipe/hands');
                const { Camera } = await import('@mediapipe/camera_utils');

                if (!isMounted || !videoRef.current) return;

                // Create Hands instance
                const hands = new Hands({
                    locateFile: (file: string) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                    }
                });

                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 0, // Use lighter model for better performance
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.4
                });

                hands.onResults(onResults);
                handsRef.current = hands;

                // Start camera with lower resolution for better performance
                const camera = new Camera(videoRef.current, {
                    onFrame: async () => {
                        // Throttle detection to reduce CPU load
                        const now = performance.now();
                        if (now - lastDetectionTime.current < DETECTION_INTERVAL_MS) {
                            return;
                        }
                        if (isProcessingRef.current) {
                            return; // Skip if still processing previous frame
                        }
                        
                        if (handsRef.current && videoRef.current) {
                            isProcessingRef.current = true;
                            lastDetectionTime.current = now;
                            try {
                                await handsRef.current.send({ image: videoRef.current });
                            } finally {
                                isProcessingRef.current = false;
                            }
                        }
                    },
                    width: 256,
                    height: 192,
                    facingMode: 'user'
                });

                cameraRef.current = camera;
                await camera.start();

            } catch (err) {
                console.error('Failed to initialize hand tracking:', err);
                setError('Failed to access camera or initialize hand tracking');
            }
        };

        initializeHands();

        return () => {
            isMounted = false;
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
            if (handsRef.current) {
                handsRef.current.close();
            }
        };
    }, [isActive, onResults]);

    if (!isActive) return null;

    return (
        <>
            {/* Custom Hand Cursor - Using spring-animated values for smooth movement */}
            <motion.div
                className="fixed pointer-events-none z-[9999]"
                style={{
                    x: smoothCursorX,
                    y: smoothCursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div 
                    className={`relative flex items-center justify-center`}
                    animate={{
                        scale: isPinching ? 0.7 : 1,
                    }}
                    transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }}
                >
                    {/* Outer ring */}
                    <motion.div
                        className={`w-10 h-10 rounded-full border-2 absolute ${
                            isPinching 
                                ? 'border-pink-400' 
                                : 'border-green-400'
                        }`}
                        animate={{
                            opacity: isTracking ? 0.8 : 0.3,
                            scale: isPinching ? 0.85 : 1,
                        }}
                        transition={{ duration: 0.15 }}
                    />
                    {/* Inner dot */}
                    <motion.div 
                        className={`w-3 h-3 rounded-full ${
                            isPinching ? 'bg-pink-400' : 'bg-green-400'
                        }`}
                        animate={{
                            opacity: isTracking ? 1 : 0.4,
                            scale: isPinching ? 1.2 : 1,
                        }}
                        transition={{ duration: 0.1 }}
                    />
                    {/* Click ripple effect */}
                    {isPinching && (
                        <motion.div
                            className="absolute w-10 h-10 rounded-full border-2 border-pink-400"
                            initial={{ scale: 0.5, opacity: 0.8 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                    )}
                </motion.div>
            </motion.div>

            {/* Camera Feed Overlay - Top Right */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                className="fixed top-4 right-4 z-[9998] rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm"
            >
                <div className="relative bg-black/40">
                    {/* Video feed */}
                    <video
                        ref={videoRef}
                        className="w-56 h-42 object-cover transform scale-x-[-1]"
                        style={{ width: '224px', height: '168px' }}
                        autoPlay
                        playsInline
                        muted
                    />
                    
                    {/* Canvas overlay for hand skeleton */}
                    <canvas
                        ref={canvasRef}
                        width={320}
                        height={240}
                        className="absolute inset-0 transform scale-x-[-1]"
                        style={{ width: '224px', height: '168px' }}
                    />

                    {/* Status indicator */}
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                        <motion.div 
                            className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}
                            animate={{ 
                                scale: isTracking ? [1, 1.2, 1] : 1,
                                opacity: isTracking ? 1 : 0.7
                            }}
                            transition={{ 
                                repeat: isTracking ? Infinity : 0, 
                                duration: 1.5 
                            }}
                        />
                        <span className="text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded">
                            {isTracking ? 'Tracking' : 'No hand'}
                        </span>
                    </div>

                    {/* Pinch indicator */}
                    <AnimatePresence>
                        {isPinching && (
                            <motion.div 
                                className="absolute top-2 right-2"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <span className="text-[10px] text-white bg-pink-500/90 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    Pinch
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-all duration-200 hover:scale-110"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Instructions */}
                    <div className="absolute bottom-2 left-2 text-[9px] text-white/80 bg-black/60 px-1.5 py-1 rounded max-w-[120px] leading-tight">
                        👆 Move • 🤏 Click/Scroll
                    </div>
                </div>

                {/* Error display */}
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="absolute inset-0 bg-black/90 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="text-red-400 text-xs text-center">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}

// Modal component for activation
export function HandGestureModal({ 
    isOpen, 
    onConfirm, 
    onCancel 
}: { 
    isOpen: boolean; 
    onConfirm: () => void; 
    onCancel: () => void; 
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]"
                        onClick={onCancel}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-full max-w-md px-4"
                    >
                        <div className="bg-slate-900/95 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur">
                            <div className="flex flex-col items-center text-center">
                                <motion.div 
                                    className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center mb-4 border border-white/10"
                                    animate={{ 
                                        boxShadow: [
                                            '0 0 20px rgba(34, 197, 94, 0.2)',
                                            '0 0 40px rgba(34, 197, 94, 0.3)',
                                            '0 0 20px rgba(34, 197, 94, 0.2)'
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <Hand className="w-8 h-8 text-green-400" />
                                </motion.div>
                                
                                <h2 className="text-xl font-semibold text-white mb-2">
                                    Hand Gesture Control
                                </h2>
                                
                                <p className="text-gray-400 mb-6">
                                    Do you want to control the web with your hand? This will request access to your camera.
                                </p>

                                <div className="space-y-3 text-left w-full mb-6 bg-white/5 rounded-xl p-4">
                                    <p className="text-sm text-gray-300">
                                        <span className="text-green-400">👆</span> Move your index finger to control the cursor
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        <span className="text-pink-400">🤏</span> Pinch (thumb + index) to click
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        <span className="text-blue-400">📜</span> Hold pinch and move up/down to scroll
                                    </p>
                                </div>

                                <div className="flex gap-3 w-full">
                                    <motion.button
                                        onClick={onCancel}
                                        className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        No, thanks
                                    </motion.button>
                                    <motion.button
                                        onClick={onConfirm}
                                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium hover:from-green-500 hover:to-blue-500 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Yes, enable
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Hook for managing hand gesture state
export function useHandGesture() {
    const [showModal, setShowModal] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    
    const handleConfirm = () => {
        setShowModal(false);
        setIsActive(true);
    };
    
    const handleClose = () => {
        setIsActive(false);
    };

    return {
        showModal,
        isActive,
        openModal,
        closeModal,
        handleConfirm,
        handleClose,
    };
}
