export type PlantType = 'succulent' | 'cactus' | 'fern' | 'flowering';

export type PlantPersonality = 'sassy' | 'shy' | 'cheerful';

export type CareAction = 'watering' | 'fertilizing' | 'sunlight' | 'pruning';

export type ResponseType = 'overwatered' | 'underwatered' | 'perfect';

export type PlantTrait = {
  id: string;
  name: string;
  description: string;
  effect: 'positive' | 'negative' | 'neutral';
  visualEffect?: string;
};

export type CareHistory = {
  action: CareAction;
  timestamp: number;
  value: number;
};

export type Plant = {
  id: string;
  name: string;
  type: PlantType;
  growthStage: number; // 0-1 (0% to 100%)
  health: number; // 0-100
  happiness: number; // 0-100
  waterLevel: number; // 0-100
  fertilizerLevel: number; // 0-100
  sunExposure: number; // 0-100
  personality: PlantPersonality;
  traits: PlantTrait[];
  careHistory: CareHistory[];
  lastInteraction: number;
  createdAt: number;
};

export type GameState = {
  plants: Plant[];
  activePlantId: string | null;
  timeScale: number;
  lastUpdate: number;
  achievements: string[];
  inventory: {
    pots: string[];
    fertilizers: string[];
    decorations: string[];
  };
}; 