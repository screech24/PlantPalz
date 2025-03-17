import { v4 as uuidv4 } from 'uuid';
import { PlantAchievement, AchievementCategory, Plant, CareAction } from '../types';

// Define initial achievements
export const initialAchievements: PlantAchievement[] = [
  // Care achievements
  {
    id: uuidv4(),
    title: 'Green Thumb',
    description: 'Water a plant for the first time',
    category: 'care',
    icon: '💧',
    unlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Plant Whisperer',
    description: 'Talk to a plant 5 times',
    category: 'care',
    icon: '💬',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: uuidv4(),
    title: 'Master Gardener',
    description: 'Perform 50 care actions',
    category: 'care',
    icon: '🌱',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  
  // Growth achievements
  {
    id: uuidv4(),
    title: 'Growth Spurt',
    description: 'Grow a plant to 50%',
    category: 'growth',
    icon: '📏',
    unlocked: false,
  },
  {
    id: uuidv4(),
    title: 'Fully Grown',
    description: 'Grow a plant to 100%',
    category: 'growth',
    icon: '🌳',
    unlocked: false,
  },
  
  // Collection achievements
  {
    id: uuidv4(),
    title: 'Plant Collector',
    description: 'Have 3 different plant types in your garden',
    category: 'collection',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  
  // Happiness achievements
  {
    id: uuidv4(),
    title: 'Happy Plants',
    description: 'Keep a plant above 80% happiness for 3 days',
    category: 'happiness',
    icon: '😄',
    unlocked: false,
  },
  
  // Special achievements
  {
    id: uuidv4(),
    title: 'Night Owl',
    description: 'Care for your plants at midnight',
    category: 'special',
    icon: '🦉',
    unlocked: false,
  },
];

// Check for achievements that should be unlocked
export const checkAchievements = (
  plants: Plant[],
  currentAchievements: PlantAchievement[]
): PlantAchievement[] => {
  const updatedAchievements = [...currentAchievements];
  
  // Helper to find achievement by title
  const findAchievement = (title: string) => 
    updatedAchievements.find(a => a.title === title);
  
  // Check Green Thumb achievement
  const greenThumb = findAchievement('Green Thumb');
  if (greenThumb && !greenThumb.unlocked) {
    const hasWatered = plants.some(plant => 
      plant.careHistory.some(care => care.action === 'watering')
    );
    
    if (hasWatered) {
      greenThumb.unlocked = true;
      greenThumb.unlockedAt = Date.now();
    }
  }
  
  // Check Plant Whisperer achievement
  const plantWhisperer = findAchievement('Plant Whisperer');
  if (plantWhisperer && !plantWhisperer.unlocked) {
    const talkCount = plants.reduce((count, plant) => 
      count + plant.careHistory.filter(care => care.action === 'talking').length, 0
    );
    
    plantWhisperer.progress = Math.min(talkCount, plantWhisperer.maxProgress || 5);
    
    if (talkCount >= (plantWhisperer.maxProgress || 5)) {
      plantWhisperer.unlocked = true;
      plantWhisperer.unlockedAt = Date.now();
    }
  }
  
  // Check Master Gardener achievement
  const masterGardener = findAchievement('Master Gardener');
  if (masterGardener && !masterGardener.unlocked) {
    const careCount = plants.reduce((count, plant) => 
      count + plant.careHistory.length, 0
    );
    
    masterGardener.progress = Math.min(careCount, masterGardener.maxProgress || 50);
    
    if (careCount >= (masterGardener.maxProgress || 50)) {
      masterGardener.unlocked = true;
      masterGardener.unlockedAt = Date.now();
    }
  }
  
  // Check Growth Spurt achievement
  const growthSpurt = findAchievement('Growth Spurt');
  if (growthSpurt && !growthSpurt.unlocked) {
    const hasHalfGrownPlant = plants.some(plant => plant.growthStage >= 0.5);
    
    if (hasHalfGrownPlant) {
      growthSpurt.unlocked = true;
      growthSpurt.unlockedAt = Date.now();
    }
  }
  
  // Check Fully Grown achievement
  const fullyGrown = findAchievement('Fully Grown');
  if (fullyGrown && !fullyGrown.unlocked) {
    const hasFullyGrownPlant = plants.some(plant => plant.growthStage >= 1);
    
    if (hasFullyGrownPlant) {
      fullyGrown.unlocked = true;
      fullyGrown.unlockedAt = Date.now();
    }
  }
  
  // Check Plant Collector achievement
  const plantCollector = findAchievement('Plant Collector');
  if (plantCollector && !plantCollector.unlocked) {
    const uniquePlantTypes = new Set(plants.map(plant => plant.type)).size;
    
    plantCollector.progress = Math.min(uniquePlantTypes, plantCollector.maxProgress || 3);
    
    if (uniquePlantTypes >= (plantCollector.maxProgress || 3)) {
      plantCollector.unlocked = true;
      plantCollector.unlockedAt = Date.now();
    }
  }
  
  // Check Night Owl achievement
  const nightOwl = findAchievement('Night Owl');
  if (nightOwl && !nightOwl.unlocked) {
    const now = new Date();
    const isNightTime = now.getHours() >= 22 || now.getHours() <= 4;
    
    if (isNightTime) {
      const recentCare = plants.some(plant => {
        const lastCare = plant.careHistory[plant.careHistory.length - 1];
        return lastCare && (Date.now() - lastCare.timestamp < 5 * 60 * 1000); // Within last 5 minutes
      });
      
      if (recentCare) {
        nightOwl.unlocked = true;
        nightOwl.unlockedAt = Date.now();
      }
    }
  }
  
  return updatedAchievements;
}; 