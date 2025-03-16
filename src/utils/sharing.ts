import { Plant } from '../types';

// Serialize plant data for sharing
export const serializePlant = (plant: Plant): string => {
  // Create a simplified version of the plant for sharing
  const sharablePlant = {
    id: plant.id,
    name: plant.name,
    type: plant.type,
    growthStage: plant.growthStage,
    health: plant.health,
    happiness: plant.happiness,
    personality: plant.personality,
    traits: plant.traits,
    createdAt: plant.createdAt
  };
  
  // Convert to JSON and encode as base64
  return btoa(JSON.stringify(sharablePlant));
};

// Deserialize plant data from a shared string
export const deserializePlant = (encodedData: string): Partial<Plant> => {
  try {
    // Decode base64 and parse JSON
    const plantData = JSON.parse(atob(encodedData));
    return plantData;
  } catch (error) {
    console.error('Error deserializing plant data:', error);
    return {};
  }
};

/**
 * Generate a shareable URL for a plant
 */
export const getShareUrl = (plant: Plant): string => {
  // Create a base URL with the current origin
  const baseUrl = window.location.origin;
  
  // Create a URL with plant ID as a parameter
  const url = new URL(`${baseUrl}/share`);
  url.searchParams.append('id', plant.id);
  
  return url.toString();
};

/**
 * Copy the share link to clipboard
 */
export const copyShareLink = async (plant: Plant): Promise<boolean> => {
  try {
    const shareUrl = getShareUrl(plant);
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy link:', error);
    return false;
  }
};

/**
 * Share to social media platforms
 */
export const shareToSocialMedia = async (
  plant: Plant, 
  platform: 'twitter' | 'facebook'
): Promise<boolean> => {
  try {
    const shareUrl = getShareUrl(plant);
    const text = `Check out my plant ${plant.name} in Plant Palz! It's a ${plant.type} at growth stage ${plant.growthStage}.`;
    
    let url = '';
    
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
    return true;
  } catch (error) {
    console.error(`Failed to share to ${platform}:`, error);
    return false;
  }
};

/**
 * Capture a screenshot of the current plant view
 */
export const captureScreenshot = async (): Promise<string | null> => {
  try {
    // This is a simplified version - in a real app, you would use a library like html2canvas
    // or a backend service to generate proper screenshots
    
    // For now, we'll simulate a screenshot by finding the plant view element
    const plantViewElement = document.querySelector('#plant-view-container');
    
    if (!plantViewElement) {
      console.error('Plant view element not found');
      return null;
    }
    
    // In a real implementation, you would use html2canvas like this:
    // const canvas = await html2canvas(plantViewElement);
    // return canvas.toDataURL('image/png');
    
    // For this demo, we'll return a placeholder image URL
    // In a real app, replace this with actual screenshot functionality
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFdwI2QJIhFQAAAABJRU5ErkJggg==';
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    return null;
  }
};

/**
 * Handle incoming shared plant links
 */
export const handleSharedPlantLink = (): string | null => {
  try {
    const url = new URL(window.location.href);
    const plantId = url.searchParams.get('id');
    return plantId;
  } catch (error) {
    console.error('Failed to parse shared link:', error);
    return null;
  }
}; 