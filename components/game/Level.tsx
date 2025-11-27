export interface Platform {
	x: number;
	y: number;
	w: number;
	h: number;
	type: 'ground' | 'platform' | 'wall';
}

export interface Coin {
	id: number;
	x: number;
	y: number;
	collected: boolean;
}

export interface GlitchObstacle {
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
	dlcRequired: string; // DLC needed to remove obstacle
}

export interface NPC {
	id: number;
	x: number;
	y: number;
	message: string;
}

export interface LevelData {
	width: number;
	height: number;
	spawnPoint: { x: number, y: number };
	platforms: Platform[];
	coins: Coin[];
	shopZone: { x: number, y: number, w: number, h: number };
	glitchObstacles: GlitchObstacle[];
	npcs: NPC[];
}

export const INITIAL_LEVEL: LevelData = {
	width: 2000,
	height: 600,
	spawnPoint: { x: 100, y: 400 },
	platforms: [
		// Ground
		{ x: 0, y: 500, w: 2000, h: 100, type: 'ground' },
		// Walls
		{ x: -50, y: 0, w: 50, h: 600, type: 'wall' },
		{ x: 2000, y: 0, w: 50, h: 600, type: 'wall' },
		// Platforms
		{ x: 300, y: 400, w: 100, h: 20, type: 'platform' },
		{ x: 500, y: 300, w: 100, h: 20, type: 'platform' },
		{ x: 700, y: 200, w: 100, h: 20, type: 'platform' },
		{ x: 900, y: 350, w: 100, h: 20, type: 'platform' },
	],
	coins: [
		{ id: 1, x: 200, y: 450, collected: false },
		{ id: 2, x: 250, y: 450, collected: false },
		{ id: 3, x: 300, y: 450, collected: false },
		{ id: 4, x: 350, y: 350, collected: false }, // On platform 1
		{ id: 5, x: 550, y: 250, collected: false }, // On platform 2
		{ id: 6, x: 750, y: 150, collected: false }, // On platform 3
		{ id: 7, x: 400, y: 450, collected: false },
		{ id: 8, x: 450, y: 450, collected: false },
		{ id: 9, x: 600, y: 450, collected: false },
		{ id: 10, x: 650, y: 450, collected: false },
		{ id: 11, x: 1000, y: 450, collected: false },
		{ id: 12, x: 1050, y: 450, collected: false },
		{ id: 13, x: 1100, y: 450, collected: false },
	],
	shopZone: { x: 50, y: 400, w: 100, h: 100 },
	glitchObstacles: [
		{ id: 'glitch_1', x: 800, y: 400, w: 50, h: 100, dlcRequired: 'remove_glitch_1' }
	],
	npcs: [
		{ id: 1, x: 150, y: 450, message: "Please help! The princess is in another castle... or something." }
	]
};
