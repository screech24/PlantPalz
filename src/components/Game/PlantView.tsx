import React, { useRef } from 'react';
import styled from 'styled-components';
import { useThreeScene } from '../../hooks/useThreeScene';
import { Plant } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { getMoodResponse } from '../../utils/plantResponses';

interface PlantViewProps {
  plantId: string | null;
}

const Container = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    height: 500px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
`;

const SpeechBubble = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 20px;
  padding: 12px 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 80%;
  z-index: 20;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 10px 10px 0;
    border-style: solid;
    border-color: white transparent transparent;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 12px;
  
  h3 {
    margin-bottom: 8px;
    color: #666;
  }
  
  p {
    color: #888;
    text-align: center;
    max-width: 80%;
  }
`;

export const PlantView: React.FC<PlantViewProps> = ({ plantId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plants = useGameStore((state) => state.plants);
  const plant = plants.find((p) => p.id === plantId) || null;
  
  const { isLoading, takeScreenshot } = useThreeScene({
    containerRef,
    plant,
  });
  
  // Get a mood response from the plant
  const moodResponse = plant ? getMoodResponse(plant) : '';
  
  // If no plant is selected, show empty state
  if (!plant) {
    return (
      <Container>
        <EmptyState>
          <h3>No Plant Selected</h3>
          <p>Select a plant from your garden or create a new one to get started.</p>
        </EmptyState>
      </Container>
    );
  }
  
  return (
    <Container ref={containerRef}>
      {isLoading && (
        <LoadingOverlay>
          <p>Loading plant...</p>
        </LoadingOverlay>
      )}
      
      {!isLoading && moodResponse && (
        <SpeechBubble>{moodResponse}</SpeechBubble>
      )}
    </Container>
  );
};

export default PlantView; 