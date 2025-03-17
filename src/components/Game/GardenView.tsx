import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { useGardenScene } from '../../hooks/useGardenScene';
import { getMoodResponse } from '../../utils/plantResponses';
import Button from '../UI/Button';
import PlantControls from './PlantControls';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 5;
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  padding: 20px;
  border-radius: 8px;
  background-color: ${({ theme }) => `rgba(${theme.isDark ? '30, 30, 30, 0.8' : '255, 255, 255, 0.8'})`};
  backdrop-filter: blur(5px);
  z-index: 5;
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  max-width: 300px;
  padding: 12px 16px;
  background-color: ${({ theme }) => `rgba(${theme.isDark ? '30, 30, 30, 0.85' : '255, 255, 255, 0.85'})`};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  z-index: 10;
  animation: fadeIn 0.3s ease-in-out;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 20px;
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: ${({ theme }) => `rgba(${theme.isDark ? '30, 30, 30, 0.85' : '255, 255, 255, 0.85'})`} transparent transparent;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Sun icon for day time
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

// Moon icon for night time
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

export const GardenView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { plants, activePlantId, setActivePlantId } = useGameStore();
  const canvasRef = useGardenScene(plants, activePlantId, setActivePlantId);
  const [moodMessage, setMoodMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (activePlantId) {
      const activePlant = plants.find(p => p.id === activePlantId);
      if (activePlant) {
        setMoodMessage(getMoodResponse(activePlant));
      } else {
        setMoodMessage(null);
      }
    } else {
      setMoodMessage(null);
    }
  }, [activePlantId, plants]);

  return (
    <Container>
      <CanvasContainer ref={canvasRef} />
      
      {moodMessage && activePlantId && (
        <SpeechBubble>
          {moodMessage}
        </SpeechBubble>
      )}
      
      <ControlsOverlay>
        {activePlantId && <PlantControls plantId={activePlantId} />}
      </ControlsOverlay>
      
      {plants.length === 0 && (
        <EmptyState>
          <h3>Your garden is empty!</h3>
          <p>Add some plants to get started.</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default GardenView; 