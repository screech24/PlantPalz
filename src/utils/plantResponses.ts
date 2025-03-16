import { Plant, CareAction, ResponseType, PlantPersonality } from '../types';

// Response library for different plant states and personalities
const responses: Record<CareAction, Record<ResponseType, string[]>> = {
  watering: {
    overwatered: [
      "Hey, I'm not a fish! Stop drowning me!",
      "Glub glub... too much water!",
      "I'm swimming here! Ease up on the H2O!"
    ],
    underwatered: [
      "So... thirsty...",
      "Water, please! I'm turning into a raisin over here!",
      "Is this a desert? Because I feel like I'm in one!"
    ],
    perfect: [
      "Ahhh, just right! Thank you!",
      "Perfect amount of water. You're getting good at this!",
      "Hydration station! Thanks, friend!"
    ]
  },
  fertilizing: {
    overwatered: [
      "Whoa! That's too much food! I'm going to get plant-diabetes!",
      "Easy on the nutrients! I'm stuffed!",
      "Too much fertilizer! My roots are burning!"
    ],
    underwatered: [
      "I'm hungry! Could use some nutrients here.",
      "Feed me, Seymour! (But with fertilizer, please)",
      "My soil feels empty. A little fertilizer would be nice."
    ],
    perfect: [
      "Mmm, delicious nutrients! Thank you!",
      "Perfect amount of fertilizer. I feel stronger already!",
      "Yum! That's the good stuff!"
    ]
  },
  sunlight: {
    overwatered: [
      "Too bright! I'm getting a sunburn over here!",
      "Ow, my leaves! Dial down the sun, please!",
      "I need sunglasses! It's too intense!"
    ],
    underwatered: [
      "It's so dark... I can barely photosynthesize...",
      "More light, please! I'm fading away here.",
      "Could use some sunshine in my life. Literally."
    ],
    perfect: [
      "Perfect amount of light! I'm photosynthesizing like a champ!",
      "This sunshine feels amazing on my leaves!",
      "Ah, just the right amount of light. I feel energized!"
    ]
  },
  pruning: {
    overwatered: [
      "Ouch! Not so rough with the pruning!",
      "Hey! I needed those leaves!",
      "Careful with those scissors! You're taking too much!"
    ],
    underwatered: [
      "I could use a little trim...",
      "Some of my leaves are looking shabby. A pruning would be nice.",
      "A little pruning would help me grow better."
    ],
    perfect: [
      "Ahh, that feels better! Thanks for the trim!",
      "Perfect pruning! I feel lighter and healthier!",
      "Thanks for the haircut! I feel fabulous!"
    ]
  }
};

// Personality modifiers for responses
const personalityModifiers: Record<PlantPersonality, (message: string) => string> = {
  sassy: (message) => message.replace(/\.$/, '!') + ' 💅',
  shy: (message) => message.replace(/!+/g, '.') + ' 🥺',
  cheerful: (message) => message + ' 😄'
};

// Determine response type based on plant state and action
export const getResponseType = (plant: Plant, action: CareAction): ResponseType => {
  switch (action) {
    case 'watering':
      if (plant.waterLevel > 80) return 'overwatered';
      if (plant.waterLevel < 20) return 'underwatered';
      return 'perfect';
    
    case 'fertilizing':
      if (plant.fertilizerLevel > 80) return 'overwatered';
      if (plant.fertilizerLevel < 20) return 'underwatered';
      return 'perfect';
    
    case 'sunlight':
      // Different optimal ranges based on plant type
      const optimalSunRanges = {
        succulent: { min: 60, max: 90 },
        cactus: { min: 70, max: 95 },
        fern: { min: 30, max: 60 },
        flowering: { min: 50, max: 80 }
      };
      
      const range = optimalSunRanges[plant.type];
      if (plant.sunExposure > range.max) return 'overwatered';
      if (plant.sunExposure < range.min) return 'underwatered';
      return 'perfect';
    
    case 'pruning':
      // Pruning response based on growth stage
      if (plant.growthStage < 0.3) return 'overwatered'; // Too early to prune
      if (plant.growthStage > 0.8) return 'underwatered'; // Needs pruning
      return 'perfect';
    
    default:
      return 'perfect';
  }
};

// Get a response based on plant state, action, and personality
export const getPlantResponse = (plant: Plant, action: CareAction): string => {
  const responseType = getResponseType(plant, action);
  const availableResponses = responses[action][responseType];
  
  // Get a random response
  const baseResponse = availableResponses[Math.floor(Math.random() * availableResponses.length)];
  
  // Apply personality modifier
  return personalityModifiers[plant.personality](baseResponse);
};

// Get a general mood response based on plant health and happiness
export const getMoodResponse = (plant: Plant): string => {
  if (plant.health < 30 && plant.happiness < 30) {
    return personalityModifiers[plant.personality]("I'm not feeling so good...");
  }
  
  if (plant.health > 80 && plant.happiness > 80) {
    return personalityModifiers[plant.personality]("I'm thriving! Life is good!");
  }
  
  if (plant.health < 50) {
    return personalityModifiers[plant.personality]("I could use some better care...");
  }
  
  if (plant.happiness < 50) {
    return personalityModifiers[plant.personality]("I'm a bit lonely. Let's hang out more!");
  }
  
  return personalityModifiers[plant.personality]("I'm doing okay today.");
}; 