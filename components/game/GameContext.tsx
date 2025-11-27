"use client";

import React, { createContext, useContext, useState } from 'react';

export type DLCId = 
	| 'left_movement'
	| 'jump'
	| 'animation'
	| 'health_bar'
	| 'pause_menu'
	| 'double_jump'
	| 'color_palette'
	| 'background_elements'
	| 'dialogue'
	| 'remove_glitch_1'
	| 'audio';

export interface DLC {
	id: DLCId;
	name: string;
	description: string;
	cost: number;
}

export const AVAILABLE_DLCS: DLC[] = [
	{ id: 'left_movement', name: 'Movement Pack (Left)', description: 'Unlocks the ability to move left.', cost: 5 },
	{ id: 'jump', name: 'Jump Pack', description: 'Unlocks the ability to jump.', cost: 10 },
	{ id: 'animation', name: 'Animation Pack', description: 'Enables character animations.', cost: 15 },
	{ id: 'audio', name: 'Audio Pack', description: 'Enables sound effects and music.', cost: 15 },
	{ id: 'remove_glitch_1', name: 'Day 1 Patch', description: 'Removes a game-breaking glitch blocking the path.', cost: 15 },
	{ id: 'health_bar', name: 'Health Bar UI', description: 'Displays your current health.', cost: 20 },
	{ id: 'pause_menu', name: 'Pause Menu', description: 'Allows you to pause the game.', cost: 25 },
	{ id: 'color_palette', name: 'Graphics Pack: Colors', description: 'Adds colors to the world.', cost: 30 },
	{ id: 'dialogue', name: 'Dialogue Pack', description: 'Understand what NPCs are saying.', cost: 35 },
	{ id: 'background_elements', name: 'Environment Pack', description: 'Adds background details.', cost: 40 },
	{ id: 'double_jump', name: 'Double Jump', description: 'Jump again in mid-air.', cost: 50 },
];

interface GameState {
	coins: number;
	unlockedDLCs: DLCId[];
	health: number;
	maxHealth: number;
	isPaused: boolean;
}

interface GameContextType {
	gameState: GameState;
	addCoins: (amount: number) => void;
	buyDLC: (dlcId: DLCId) => boolean;
	damagePlayer: (amount: number) => void;
	healPlayer: (amount: number) => void;
	togglePause: () => void;
	hasDLC: (id: DLCId) => boolean;
	resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [gameState, setGameState] = useState<GameState>({
		coins: 0,
		unlockedDLCs: [],
		health: 100,
		maxHealth: 100,
		isPaused: false,
	});

	const addCoins = (amount: number) => {
		setGameState(prev => ({ ...prev, coins: prev.coins + amount }));
	};

	const buyDLC = (dlcId: DLCId) => {
		const dlc = AVAILABLE_DLCS.find(d => d.id === dlcId);
		if (!dlc) return false;
		if (gameState.unlockedDLCs.includes(dlcId)) return false;
		if (gameState.coins < dlc.cost) return false;

		setGameState(prev => ({
			...prev,
			coins: prev.coins - dlc.cost,
			unlockedDLCs: [...prev.unlockedDLCs, dlcId]
		}));
		return true;
	};

	const damagePlayer = (amount: number) => {
		setGameState(prev => {
			const newHealth = Math.max(0, prev.health - amount);
			return { ...prev, health: newHealth };
		});
	};

	const healPlayer = (amount: number) => {
		setGameState(prev => ({
			...prev,
			health: Math.min(prev.maxHealth, prev.health + amount)
		}));
	};

	const togglePause = () => {
		if (!gameState.unlockedDLCs.includes('pause_menu')) return;
		setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
	};

	const hasDLC = (id: DLCId) => gameState.unlockedDLCs.includes(id);

	const resetGame = () => {
		setGameState({
			coins: 0,
			unlockedDLCs: [],
			health: 100,
			maxHealth: 100,
			isPaused: false,
		});
	};

	return (
		<GameContext.Provider value={{ 
			gameState, 
			addCoins, 
			buyDLC, 
			damagePlayer, 
			healPlayer, 
			togglePause, 
			hasDLC,
			resetGame
		}}>
			{children}
		</GameContext.Provider>
	);
};

export const useGame = () => {
	const context = useContext(GameContext);
	if (context === undefined) {
		throw new Error('useGame must be used within a GameProvider');
	}
	return context;
};
