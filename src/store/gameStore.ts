import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Plant, PlantType, PlantPersonality, CareAction, GameState } from '../types';

interface GameStore extends GameState {
  // Plant actions
  addPlant: (name: string, type: PlantType) => void;
  removePlant: (id: string) => void;
  setActivePlant: (id: string | null) => void;
  renamePlant: (id: string, name: string) => void;
  getPlantById: (id: string) => Plant | null;
  
  // Care actions
  waterPlant: (id: string, amount: number) => void;
  fertilizePlant: (id: string, amount: number) => void;
  adjustSunlight: (id: string, level: number) => void;
  prunePlant: (id: string) => void;
  
  // Time simulation
  updateGameState: () => void;
  setTimeScale: (scale: number) => void;
  
  // Utility
  resetGame: () => void;
}

const getRandomPersonality = (): PlantPersonality => {
  const personalities: PlantPersonality[] = ['sassy', 'shy', 'cheerful'];
  return personalities[Math.floor(Math.random() * personalities.length)];
};

const createNewPlant = (name: string, type: PlantType): Plant => {
  return {
    id: uuidv4(),
    name,
    type,
    growthStage: 0.1, // Start at 10% growth
    health: 100,
    happiness: 100,
    waterLevel: 50,
    fertilizerLevel: 50,
    sunExposure: 50,
    personality: getRandomPersonality(),
    traits: [],
    careHistory: [],
    lastInteraction: Date.now(),
    createdAt: Date.now(),
  };
};

// Helper functions for plant growth and health calculations
const calculateWaterFactor = (waterLevel: number, plantType: PlantType): number => {
  // Different plant types have different water needs
  const optimalWaterLevel = {
    succulent: 30,
    cactus: 20,
    fern: 70,
    flowering: 60,
  };
  
  const optimal = optimalWaterLevel[plantType];
  const distance = Math.abs(waterLevel - optimal);
  
  // Return a value between 0 and 1, where 1 is optimal
  return Math.max(0, 1 - distance / 100);
};

const calculateSunFactor = (sunExposure: number, plantType: PlantType): number => {
  // Different plant types have different sunlight needs
  const optimalSunLevel = {
    succulent: 70,
    cactus: 80,
    fern: 40,
    flowering: 60,
  };
  
  const optimal = optimalSunLevel[plantType];
  const distance = Math.abs(sunExposure - optimal);
  
  // Return a value between 0 and 1, where 1 is optimal
  return Math.max(0, 1 - distance / 100);
};

const calculateFertilizerFactor = (fertilizerLevel: number, plantType: PlantType): number => {
  // Different plant types have different fertilizer needs
  const optimalFertilizerLevel = {
    succulent: 30,
    cactus: 20,
    fern: 60,
    flowering: 70,
  };
  
  const optimal = optimalFertilizerLevel[plantType];
  const distance = Math.abs(fertilizerLevel - optimal);
  
  // Return a value between 0 and 1, where 1 is optimal
  return Math.max(0, 1 - distance / 100);
};

const calculateHealthChange = (plant: Plant, timePassed: number): number => {
  const waterFactor = calculateWaterFactor(plant.waterLevel, plant.type);
  const sunFactor = calculateSunFactor(plant.sunExposure, plant.type);
  const fertilizerFactor = calculateFertilizerFactor(plant.fertilizerLevel, plant.type);
  
  // Average of all factors, scaled by time
  const overallFactor = (waterFactor + sunFactor + fertilizerFactor) / 3;
  
  // Health decreases if factors are poor, increases if they're good
  return (overallFactor - 0.5) * 10 * (timePassed / (1000 * 60 * 60)); // Scale by hours
};

const calculateHappinessChange = (plant: Plant, timePassed: number): number => {
  // Happiness decreases over time if not interacted with
  const hoursSinceInteraction = (Date.now() - plant.lastInteraction) / (1000 * 60 * 60);
  const interactionDecay = Math.min(5, hoursSinceInteraction * 0.5);
  
  // Health affects happiness
  const healthFactor = plant.health / 100;
  
  return (healthFactor - 0.5) * 5 * (timePassed / (1000 * 60 * 60)) - interactionDecay;
};

const updatePlantGrowth = (plant: Plant, timePassed: number): Plant => {
  const waterFactor = calculateWaterFactor(plant.waterLevel, plant.type);
  const sunFactor = calculateSunFactor(plant.sunExposure, plant.type);
  const fertilizerFactor = calculateFertilizerFactor(plant.fertilizerLevel, plant.type);
  
  // Calculate growth rate based on care factors
  const growthRate = (waterFactor + sunFactor + fertilizerFactor) / 3;
  
  // Natural decay of resources over time (in hours)
  const hoursPassed = timePassed / (1000 * 60 * 60);
  
  // Update plant properties
  const updatedPlant = { ...plant };
  
  // Growth increases based on factors and time
  updatedPlant.growthStage = Math.min(1, plant.growthStage + growthRate * 0.01 * hoursPassed);
  
  // Resources naturally decrease over time
  updatedPlant.waterLevel = Math.max(0, plant.waterLevel - 2 * hoursPassed);
  updatedPlant.fertilizerLevel = Math.max(0, plant.fertilizerLevel - 1 * hoursPassed);
  
  // Health and happiness change based on care
  updatedPlant.health = Math.max(0, Math.min(100, plant.health + calculateHealthChange(plant, timePassed)));
  updatedPlant.happiness = Math.max(0, Math.min(100, plant.happiness + calculateHappinessChange(plant, timePassed)));
  
  return updatedPlant;
};

// Create the store
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      plants: [],
      activePlantId: null,
      timeScale: 1,
      lastUpdate: Date.now(),
      achievements: [],
      inventory: {
        pots: ['basic_pot'],
        fertilizers: ['basic_fertilizer'],
        decorations: [],
      },
      
      // Plant actions
      addPlant: (name, type) => {
        const newPlant = createNewPlant(name, type);
        set((state) => ({
          plants: [...state.plants, newPlant],
          activePlantId: newPlant.id,
        }));
      },
      
      removePlant: (id) => {
        set((state) => ({
          plants: state.plants.filter((plant) => plant.id !== id),
          activePlantId: state.activePlantId === id ? null : state.activePlantId,
        }));
      },
      
      setActivePlant: (id) => {
        set({ activePlantId: id });
      },
      
      renamePlant: (id, name) => {
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === id ? { ...plant, name } : plant
          ),
        }));
      },
      
      getPlantById: (id) => {
        const state = get();
        return state.plants.find(plant => plant.id === id) || null;
      },
      
      // Care actions
      waterPlant: (id, amount) => {
        set((state) => ({
          plants: state.plants.map((plant) => {
            if (plant.id === id) {
              const newWaterLevel = Math.max(0, Math.min(100, plant.waterLevel + amount));
              return {
                ...plant,
                waterLevel: newWaterLevel,
                lastInteraction: Date.now(),
                careHistory: [
                  ...plant.careHistory,
                  {
                    action: 'watering' as CareAction,
                    timestamp: Date.now(),
                    value: amount,
                  },
                ],
              };
            }
            return plant;
          }),
        }));
      },
      
      fertilizePlant: (id, amount) => {
        set((state) => ({
          plants: state.plants.map((plant) => {
            if (plant.id === id) {
              const newFertilizerLevel = Math.max(0, Math.min(100, plant.fertilizerLevel + amount));
              return {
                ...plant,
                fertilizerLevel: newFertilizerLevel,
                lastInteraction: Date.now(),
                careHistory: [
                  ...plant.careHistory,
                  {
                    action: 'fertilizing' as CareAction,
                    timestamp: Date.now(),
                    value: amount,
                  },
                ],
              };
            }
            return plant;
          }),
        }));
      },
      
      adjustSunlight: (id, level) => {
        set((state) => ({
          plants: state.plants.map((plant) => {
            if (plant.id === id) {
              return {
                ...plant,
                sunExposure: Math.max(0, Math.min(100, level)),
                lastInteraction: Date.now(),
                careHistory: [
                  ...plant.careHistory,
                  {
                    action: 'sunlight' as CareAction,
                    timestamp: Date.now(),
                    value: level,
                  },
                ],
              };
            }
            return plant;
          }),
        }));
      },
      
      prunePlant: (id) => {
        set((state) => ({
          plants: state.plants.map((plant) => {
            if (plant.id === id) {
              // Pruning slightly increases happiness and health
              return {
                ...plant,
                happiness: Math.min(100, plant.happiness + 5),
                health: Math.min(100, plant.health + 3),
                lastInteraction: Date.now(),
                careHistory: [
                  ...plant.careHistory,
                  {
                    action: 'pruning' as CareAction,
                    timestamp: Date.now(),
                    value: 1,
                  },
                ],
              };
            }
            return plant;
          }),
        }));
      },
      
      // Time simulation
      updateGameState: () => {
        const currentTime = Date.now();
        const { lastUpdate, timeScale, plants } = get();
        const timePassed = (currentTime - lastUpdate) * timeScale;
        
        if (timePassed < 1000) return; // Don't update if less than 1 second has passed
        
        set({
          lastUpdate: currentTime,
          plants: plants.map((plant) => updatePlantGrowth(plant, timePassed)),
        });
      },
      
      setTimeScale: (scale) => {
        set({ timeScale: scale });
      },
      
      // Utility
      resetGame: () => {
        set({
          plants: [],
          activePlantId: null,
          timeScale: 1,
          lastUpdate: Date.now(),
          achievements: [],
          inventory: {
            pots: ['basic_pot'],
            fertilizers: ['basic_fertilizer'],
            decorations: [],
          },
        });
      },
    }),
    {
      name: 'plant-palz-storage',
    }
  )
); 