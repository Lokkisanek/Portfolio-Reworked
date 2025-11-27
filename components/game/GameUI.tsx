"use client";

import React, { useState } from 'react';
import { useGame, AVAILABLE_DLCS } from './GameContext';

export default function GameUI() {
	const { gameState, buyDLC, hasDLC, togglePause } = useGame();
	const [isShopOpen, setIsShopOpen] = useState(false);

	return (
		<div style={{
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			pointerEvents: 'none',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			padding: '20px'
		}}>
			<div style={{ display: 'flex', gap: '20px', pointerEvents: 'auto' }}>
				<div style={{ background: 'rgba(0,0,0,0.7)', color: 'gold', padding: '10px', borderRadius: '8px', fontWeight: 'bold' }}>
					Coins: {gameState.coins}
				</div>
        
				{hasDLC('health_bar') && (
					<div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', borderRadius: '8px' }}>
						Health: {gameState.health}/{gameState.maxHealth}
					</div>
				)}

				<button 
					onClick={() => setIsShopOpen(!isShopOpen)}
					style={{
						background: '#4CAF50',
						color: 'white',
						border: 'none',
						padding: '10px 20px',
						borderRadius: '8px',
						cursor: 'pointer',
						fontWeight: 'bold'
					}}
				>
					{isShopOpen ? 'Close Shop' : 'Open Shop'}
				</button>
			</div>

			{gameState.isPaused && hasDLC('pause_menu') && (
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background: 'rgba(0,0,0,0.5)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					pointerEvents: 'auto'
				}}>
					<div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
						<h2>PAUSED</h2>
						<button onClick={togglePause} className="btn">Resume</button>
					</div>
				</div>
			)}

			{isShopOpen && (
				<div style={{
					position: 'absolute',
					top: '80px',
					left: '50%',
					transform: 'translateX(-50%)',
					background: 'white',
					padding: '20px',
					borderRadius: '10px',
					boxShadow: '0 0 20px rgba(0,0,0,0.5)',
					maxHeight: '80%',
					overflowY: 'auto',
					pointerEvents: 'auto',
					width: '400px',
					color: 'black'
				}}>
					<h2 style={{ textAlign: 'center', marginBottom: '20px' }}>DLC Store</h2>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
						{AVAILABLE_DLCS.map(dlc => {
							const isOwned = hasDLC(dlc.id);
							const canAfford = gameState.coins >= dlc.cost;
              
							return (
								<div key={dlc.id} style={{
									border: '1px solid #ddd',
									padding: '10px',
									borderRadius: '5px',
									background: isOwned ? '#e8f5e9' : '#fff',
									opacity: isOwned ? 0.7 : 1
								}}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<strong>{dlc.name}</strong>
										<span style={{ color: '#f57c00', fontWeight: 'bold' }}>{dlc.cost} Coins</span>
									</div>
									<p style={{ fontSize: '0.9em', color: '#666', margin: '5px 0' }}>{dlc.description}</p>
									<button
										disabled={isOwned || !canAfford}
										onClick={() => buyDLC(dlc.id)}
										style={{
											width: '100%',
											padding: '8px',
											background: isOwned ? '#888' : canAfford ? '#2196F3' : '#ddd',
											color: 'white',
											border: 'none',
											borderRadius: '4px',
											cursor: isOwned || !canAfford ? 'default' : 'pointer'
										}}
									>
										{isOwned ? 'OWNED' : canAfford ? 'BUY' : 'NOT ENOUGH COINS'}
									</button>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
