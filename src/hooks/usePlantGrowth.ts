import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

// Custom hook to handle plant growth simulation
export const usePlantGrowth = () => {
  const updateGameState = useGameStore((state) => state.updateGameState);
  const timeScale = useGameStore((state) => state.timeScale);
  const animationFrameRef = useRef<number | null>(null);
  
  // Function to update the game state on each animation frame
  const updateFrame = () => {
    updateGameState();
    animationFrameRef.current = requestAnimationFrame(updateFrame);
  };
  
  // Start and stop the animation loop based on component lifecycle
  useEffect(() => {
    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updateFrame);
    
    // Clean up on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateGameState]);
  
  // Update when time scale changes
  useEffect(() => {
    // No need to do anything special here, the time scale is used in updateGameState
  }, [timeScale]);
  
  return {
    timeScale,
  };
}; 