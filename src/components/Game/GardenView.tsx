import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { useGardenScene } from '../../hooks/useGardenScene';
import { getMoodResponse } from '../../utils/plantResponses';
import { PlantControls } from './PlantControls';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  background-color: ${({ theme }) => theme.colors.background};
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 5;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    display: flex;
    justify-content: center;
  }
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

const SelectPlantMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  padding: 12px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => `rgba(${theme.isDark ? '30, 30, 30, 0.7' : '255, 255, 255, 0.7'})`};
  backdrop-filter: blur(3px);
  z-index: 5;
  pointer-events: none;
`;

export const GardenView: React.FC = () => {
  const { plants, activePlantId, setActivePlant } = useGameStore();
  const canvasRef = useGardenScene(plants, activePlantId, setActivePlant);
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
        {activePlantId ? (
          <PlantControls plantId={activePlantId} />
        ) : plants.length > 0 ? (
          <SelectPlantMessage>
            Click on a plant to select it
          </SelectPlantMessage>
        ) : null}
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