"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useGame } from './GameContext';
import { INITIAL_LEVEL, LevelData, Platform, GlitchObstacle } from './Level';

export default function GameScene() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { gameState, addCoins, hasDLC, togglePause } = useGame();
  
	// Local game state
	const [level] = useState<LevelData>(INITIAL_LEVEL);
  
	// Player state ref to avoid closure staleness in loop
	const playerRef = useRef({
		x: INITIAL_LEVEL.spawnPoint.x,
		y: INITIAL_LEVEL.spawnPoint.y,
		w: 32,
		h: 32,
		vx: 0,
		vy: 0,
		isGrounded: false,
		facingRight: true,
		jumpsLeft: 0
	});

	const keysRef = useRef<{ [key: string]: boolean }>({});

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			keysRef.current[e.code] = true;
			if (e.code === 'Escape') togglePause();
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			keysRef.current[e.code] = false;
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [togglePause]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationFrameId: number;

		const update = () => {
			if (gameState.isPaused) {
				animationFrameId = requestAnimationFrame(update);
				return;
			}

			const player = playerRef.current;
			const keys = keysRef.current;

			// --- Physics Constants ---
			const GRAVITY = 0.6;
			const FRICTION = 0.8;
			const SPEED = 5;

			// --- Movement Logic ---
			if (keys['ArrowRight'] || keys['KeyD']) {
				player.vx += 1;
				player.facingRight = true;
			}
      
			if (keys['ArrowLeft'] || keys['KeyA']) {
				if (hasDLC('left_movement')) {
					player.vx -= 1;
					player.facingRight = false;
				}
			}

			// Apply Physics
			player.vx *= FRICTION;
			player.vy += GRAVITY;

			// Cap speed
			if (player.vx > SPEED) player.vx = SPEED;
			if (player.vx < -SPEED) player.vx = -SPEED;

			// Apply Velocity
			player.x += player.vx;
      
			// Horizontal Collision
			checkCollisions(player, level.platforms, 'x');
			checkGlitchCollisions(player, level.glitchObstacles, 'x');

			player.y += player.vy;
      
			// Vertical Collision
			player.isGrounded = false;
			checkCollisions(player, level.platforms, 'y');
			checkGlitchCollisions(player, level.glitchObstacles, 'y');

			// Screen Boundaries
			if (player.x < 0) player.x = 0;
			if (player.x > level.width - player.w) player.x = level.width - player.w;
			if (player.y > level.height + 100) {
				// Fall off world -> Respawn
				player.x = level.spawnPoint.x;
				player.y = level.spawnPoint.y;
				player.vy = 0;
			}

			// --- Coin Collection ---
			level.coins.forEach(coin => {
				if (!coin.collected && 
						player.x < coin.x + 20 &&
						player.x + player.w > coin.x &&
						player.y < coin.y + 20 &&
						player.y + player.h > coin.y) {
					coin.collected = true;
					addCoins(1);
				}
			});

			// --- Rendering ---
			draw(ctx, player, level);

			animationFrameId = requestAnimationFrame(update);
		};

		const handleJump = (e: KeyboardEvent) => {
			if (gameState.isPaused) return;
			if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
				const player = playerRef.current;
        
				if (player.isGrounded) {
					if (hasDLC('jump')) {
						player.vy = -12;
						player.isGrounded = false;
						player.jumpsLeft = hasDLC('double_jump') ? 1 : 0;
					}
				} else if (player.jumpsLeft > 0) {
					 player.vy = -12;
					 player.jumpsLeft--;
				}
			}
		};
		window.addEventListener('keydown', handleJump);

		animationFrameId = requestAnimationFrame(update);

		return () => {
			cancelAnimationFrame(animationFrameId);
			window.removeEventListener('keydown', handleJump);
		};
	}, [gameState.isPaused, gameState.unlockedDLCs, level]);

	const checkCollisions = (p: any, platforms: Platform[], axis: 'x' | 'y') => {
		for (const plat of platforms) {
			if (p.x < plat.x + plat.w &&
					p.x + p.w > plat.x &&
					p.y < plat.y + plat.h &&
					p.y + p.h > plat.y) {
        
				if (axis === 'x') {
					if (p.vx > 0) p.x = plat.x - p.w;
					else if (p.vx < 0) p.x = plat.x + plat.w;
					p.vx = 0;
				} else {
					if (p.vy > 0) {
						p.y = plat.y - p.h;
						p.isGrounded = true;
					} else if (p.vy < 0) {
						p.y = plat.y + plat.h;
					}
					p.vy = 0;
				}
			}
		}
	};

	const checkGlitchCollisions = (p: any, glitches: GlitchObstacle[], axis: 'x' | 'y') => {
		for (const g of glitches) {
			if (hasDLC(g.dlcRequired as any)) continue;

			if (p.x < g.x + g.w &&
					p.x + p.w > g.x &&
					p.y < g.y + g.h &&
					p.y + p.h > g.y) {
        
				if (axis === 'x') {
					if (p.vx > 0) p.x = g.x - p.w;
					else if (p.vx < 0) p.x = g.x + g.w;
					p.vx = 0;
				} else {
					if (p.vy > 0) {
						p.y = g.y - p.h;
						p.isGrounded = true;
					} else if (p.vy < 0) {
						p.y = g.y + g.h;
					}
					p.vy = 0;
				}
			}
		}
	};

	const draw = (ctx: CanvasRenderingContext2D, player: any, lvl: LevelData) => {
		// Clear screen
		ctx.fillStyle = hasDLC('color_palette') ? '#87CEEB' : '#f0f0f0';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// Camera follow
		ctx.save();
		const camX = -player.x + ctx.canvas.width / 2 - player.w / 2;
		const clampedCamX = Math.min(0, Math.max(camX, -(lvl.width - ctx.canvas.width)));
		ctx.translate(clampedCamX, 0);

		// Draw Platforms
		ctx.fillStyle = hasDLC('color_palette') ? '#654321' : '#333';
		lvl.platforms.forEach(p => {
			ctx.fillRect(p.x, p.y, p.w, p.h);
			if (hasDLC('color_palette') && p.type !== 'wall') {
				ctx.fillStyle = '#228B22';
				ctx.fillRect(p.x, p.y, p.w, 5);
				ctx.fillStyle = '#654321';
			}
		});

		// Draw Glitches
		lvl.glitchObstacles.forEach(g => {
			if (!hasDLC(g.dlcRequired as any)) {
				ctx.fillStyle = `rgba(${Math.random()*255},0,${Math.random()*255},0.8)`;
				ctx.fillRect(g.x + Math.random()*5 - 2.5, g.y + Math.random()*5 - 2.5, g.w, g.h);
			}
		});

		// Draw Coins
		ctx.fillStyle = '#FFD700';
		lvl.coins.forEach(c => {
			if (!c.collected) {
				ctx.beginPath();
				ctx.arc(c.x + 10, c.y + 10, 8, 0, Math.PI * 2);
				ctx.fill();
			}
		});

		// Draw Shop Zone
		ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
		ctx.fillRect(lvl.shopZone.x, lvl.shopZone.y, lvl.shopZone.w, lvl.shopZone.h);
		ctx.fillStyle = '#000';
		ctx.font = '16px Arial';
		ctx.fillText("SHOP", lvl.shopZone.x + 25, lvl.shopZone.y - 10);

		// Draw Player
		if (hasDLC('animation')) {
			ctx.fillStyle = 'red';
			ctx.fillRect(player.x, player.y, player.w, player.h);
			ctx.fillStyle = 'white';
			if (player.facingRight) {
				ctx.fillRect(player.x + 20, player.y + 5, 8, 8);
			} else {
				ctx.fillRect(player.x + 4, player.y + 5, 8, 8);
			}
		} else {
			ctx.fillStyle = '#555';
			ctx.fillRect(player.x, player.y, player.w, player.h);
		}

		// Draw NPCs
		lvl.npcs.forEach(npc => {
			ctx.fillStyle = 'blue';
			ctx.fillRect(npc.x, npc.y, 32, 32);
			const dist = Math.abs(player.x - npc.x);
			if (dist < 100) {
				ctx.fillStyle = '#000';
				ctx.font = '14px Arial';
				const text = hasDLC('dialogue') ? npc.message : "???";
				ctx.fillText(text, npc.x - 20, npc.y - 20);
			}
		});

		ctx.restore();
	};

	return (
		<canvas 
			ref={canvasRef} 
			width={800} 
			height={600} 
			style={{ border: '4px solid #333', background: '#fff' }}
		/>
	);
}
