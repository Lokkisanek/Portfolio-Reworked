"use client";

import React from 'react';
import Link from 'next/link';
import { GameProvider } from '@/components/game/GameContext';
import GameScene from '@/components/game/GameScene';
import GameUI from '@/components/game/GameUI';

export default function GamePage() {
	return (
		<GameProvider>
			<main style={{ 
				minHeight: '100vh', 
				display: 'flex', 
				flexDirection: 'column', 
				alignItems: 'center', 
				justifyContent: 'center',
				background: '#222',
				position: 'relative'
			}}>
				<h1 style={{ color: 'white', marginBottom: '20px', fontFamily: 'monospace' }}>BROKEN GAME: THE DLC QUEST</h1>
				<div style={{ position: 'relative', width: '800px', height: '600px' }}>
					<GameScene />
					<GameUI />
				</div>
        
				<div style={{ marginTop: '20px', color: '#888', textAlign: 'center' }}>
					<p>Controls: Arrows / WASD to move. Space to Jump (if bought).</p>
					<p>Goal: Collect coins to fix the game.</p>
					<Link href="/" style={{ color: '#fff', textDecoration: 'underline', marginTop: '10px', display: 'inline-block' }}>
						Back to Portfolio
					</Link>
				</div>
			</main>
		</GameProvider>
	);
}
