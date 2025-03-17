import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Plant, PlantType, PlantPersonality, CareAction, GameState } from '../types';
import { PotType, PotColor } from '../models/potModels';
import { initialAchievements, checkAchievements } from '../utils/achievements';

interface GameStore extends GameState {
  // Plant actions
  addPlant: (name: string, type: PlantType) => void;
  removePlant: (id: string) => void;
  setActivePlant: (id: string | null) => void;
  renamePlant: (id: string, name: string) => void;
  getPlantById: (id: string) => Plant | null;
  updatePotType: (id: string, potType: PotType) => void;
  updatePotColor: (id: string, potColor: PotColor) => void;
  
  // Care actions
  waterPlant: (id: string, amount: number) => void;
  fertilizePlant: (id: string, amount: number) => void;
  adjustSunlight: (id: string, level: number) => void;
  prunePlant: (id: string) => void;
  talkToPlant: (id: string) => void;
  
  // Garden actions
  toggleCurtains: () => void;
  toggleGrowLight: () => void;
  
  // Time simulation
  updateGameState: () => void;
  setTimeScale: (scale: number) => void;
  
  // Utility
  resetGame: () => void;
}

const getRandomPersonality = (): PlantPersonality => {
  const personalities: PlantPersonality[] = [
    'sassy', 
    'shy', 
    'cheerful', 
    'grumpy', 
    'philosophical', 
    'dramatic'
  ];
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
    potType: 'basic', // Default pot type
    potColor: 'terracotta', // Default pot color
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
  const interactionDecay = Math.min(5, hoursSinceInteraction * 0.2); // Reduced from 0.5 to 0.2
  
  // Health affects happiness
  const healthFactor = plant.health / 100;
  
  // Calculate happiness change
  const happinessChange = (healthFactor - 0.5) * 5 * (timePassed / (1000 * 60 * 60)) - interactionDecay;
  
  // Ensure happiness doesn't fall below 10% due to decay
  if (plant.happiness <= 10 && happinessChange < 0) {
    return 0;
  }
  
  return happinessChange;
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
      achievements: initialAchievements,
      inventory: {
        pots: [],
        fertilizers: [],
        decorations: []
      },
      
      // Garden settings
      isDaytime: true,
      isCurtainsOpen: true,
      isGrowLightOn: false,
      
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
      
      updatePotType: (id, potType) => {
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === id ? { ...plant, potType } : plant
          ),
        }));
      },
      
      updatePotColor: (id, potColor) => {
        set((state) => ({
          plants: state.plants.map((plant) =>
            plant.id === id ? { ...plant, potColor } : plant
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
              
              // Calculate if water level is optimal for this plant type
              const optimalWaterLevel = {
                succulent: 30,
                cactus: 20,
                fern: 70,
                flowering: 60,
              }[plant.type];
              
              // Boost happiness if water level is close to optimal
              const isOptimal = Math.abs(newWaterLevel - optimalWaterLevel) < 15;
              const happinessBoost = isOptimal ? 5 : 0;
              
              return {
                ...plant,
                waterLevel: newWaterLevel,
                happiness: Math.min(100, plant.happiness + happinessBoost),
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
              
              // Calculate if fertilizer level is optimal for this plant type
              const optimalFertilizerLevel = {
                succulent: 30,
                cactus: 20,
                fern: 60,
                flowering: 70,
              }[plant.type];
              
              // Boost happiness if fertilizer level is close to optimal
              const isOptimal = Math.abs(newFertilizerLevel - optimalFertilizerLevel) < 15;
              const happinessBoost = isOptimal ? 5 : 0;
              
              return {
                ...plant,
                fertilizerLevel: newFertilizerLevel,
                happiness: Math.min(100, plant.happiness + happinessBoost),
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
              const newSunExposure = Math.max(0, Math.min(100, level));
              
              // Different optimal ranges based on plant type
              const optimalSunRanges = {
                succulent: { min: 60, max: 90 },
                cactus: { min: 70, max: 95 },
                fern: { min: 30, max: 60 },
                flowering: { min: 50, max: 80 }
              };
              
              const range = optimalSunRanges[plant.type];
              
              // Boost happiness if sunlight is in optimal range
              const isOptimal = newSunExposure >= range.min && newSunExposure <= range.max;
              const happinessBoost = isOptimal ? 5 : 0;
              
              return {
                ...plant,
                sunExposure: newSunExposure,
                happiness: Math.min(100, plant.happiness + happinessBoost),
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
      
      talkToPlant: (id) => {
        set((state) => ({
          plants: state.plants.map((plant) => {
            if (plant.id === id) {
              // Talking significantly increases happiness
              return {
                ...plant,
                happiness: Math.min(100, plant.happiness + 15),
                lastInteraction: Date.now(),
                careHistory: [
                  ...plant.careHistory,
                  {
                    action: 'talking' as CareAction,
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
      
      // Garden actions
      toggleCurtains: () => {
        set(state => {
          const isCurtainsOpen = !state.isCurtainsOpen;
          
          // Update sunlight for all plants based on curtain state
          const plants = state.plants.map(plant => {
            // During day, curtains affect sunlight
            if (state.isDaytime) {
              const sunExposure = isCurtainsOpen ? 
                Math.min(plant.sunExposure + 20, 100) : // Increase when open
                Math.max(plant.sunExposure - 20, 0);    // Decrease when closed
              
              return {
                ...plant,
                sunExposure
              };
            }
            
            return plant;
          });
          
          return {
            ...state,
            isCurtainsOpen,
            plants
          };
        });
      },
      
      toggleGrowLight: () => {
        set(state => {
          const isGrowLightOn = !state.isGrowLightOn;
          
          // Update sunlight for all plants based on grow light state
          const plants = state.plants.map(plant => {
            // At night, grow light affects sunlight
            if (!state.isDaytime) {
              const sunExposure = isGrowLightOn ? 
                Math.min(plant.sunExposure + 30, 100) : // Increase when on
                Math.max(plant.sunExposure - 30, 0);    // Decrease when off
              
              return {
                ...plant,
                sunExposure
              };
            }
            
            return plant;
          });
          
          return {
            ...state,
            isGrowLightOn,
            plants
          };
        });
      },
      
      // Time simulation
      updateGameState: () => {
        set(state => {
          const now = Date.now();
          const timePassed = (now - state.lastUpdate) * state.timeScale;
          
          // Update time of day (day/night cycle)
          // Day/night cycle every 10 minutes of game time
          const dayNightCycleDuration = 10 * 60 * 1000; // 10 minutes in ms
          const timeOfDay = (now % dayNightCycleDuration) / dayNightCycleDuration;
          const isDaytime = timeOfDay < 0.7; // 70% day, 30% night
          
          // If day/night state changed, update plants accordingly
          let plants = state.plants;
          if (isDaytime !== state.isDaytime) {
            plants = plants.map(plant => {
              // When transitioning to day, increase sunlight if curtains open
              // When transitioning to night, decrease sunlight unless grow light is on
              const sunExposure = isDaytime ? 
                (state.isCurtainsOpen ? Math.min(plant.sunExposure + 20, 100) : plant.sunExposure) :
                (state.isGrowLightOn ? plant.sunExposure : Math.max(plant.sunExposure - 20, 0));
              
              return {
                ...plant,
                sunExposure
              };
            });
          }
          
          // Update each plant
          plants = plants.map(plant => updatePlantGrowth({...plant}, timePassed));
          
          // Check for achievements
          const achievements = checkAchievements(plants, state.achievements);
          
          return {
            ...state,
            plants,
            lastUpdate: now,
            isDaytime,
            achievements
          };
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
          achievements: initialAchievements,
          inventory: {
            pots: [],
            fertilizers: [],
            decorations: []
          },
          isDaytime: true,
          isCurtainsOpen: true,
          isGrowLightOn: false,
        });
      },
    }),
    {
      name: 'plant-palz-storage',
      partialize: (state) => ({
        plants: state.plants,
        activePlantId: state.activePlantId,
        timeScale: state.timeScale,
        lastUpdate: state.lastUpdate,
        achievements: state.achievements,
        inventory: state.inventory,
        isDaytime: state.isDaytime,
        isCurtainsOpen: state.isCurtainsOpen,
        isGrowLightOn: state.isGrowLightOn
      }),
    }
  )
); 