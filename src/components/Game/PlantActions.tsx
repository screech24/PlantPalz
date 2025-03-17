import React, { useState } from 'react';
import styled from 'styled-components';
import { Plant } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { getPlantResponse } from '../../utils/plantResponses';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface PlantActionsProps {
  plant: Plant | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const ResponseContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const PlantActions: React.FC<PlantActionsProps> = ({ plant }) => {
  const [response, setResponse] = useState<string | null>(null);
  const { waterPlant, fertilizePlant, adjustSunlight, prunePlant, talkToPlant } = useGameStore();
  
  if (!plant) {
    return (
      <Card>
        <p>Select a plant to perform actions.</p>
      </Card>
    );
  }
  
  const handleWater = () => {
    waterPlant(plant.id, 30);
    const response = getPlantResponse(plant, 'watering');
    setResponse(response);
  };
  
  const handleFertilize = () => {
    fertilizePlant(plant.id, 20);
    const response = getPlantResponse(plant, 'fertilizing');
    setResponse(response);
  };
  
  const handleMoreSun = () => {
    adjustSunlight(plant.id, plant.sunExposure + 20);
    const response = getPlantResponse(plant, 'sunlight');
    setResponse(response);
  };
  
  const handleLessSun = () => {
    adjustSunlight(plant.id, plant.sunExposure - 20);
    const response = getPlantResponse(plant, 'sunlight');
    setResponse(response);
  };
  
  const handlePrune = () => {
    prunePlant(plant.id);
    const response = getPlantResponse(plant, 'pruning');
    setResponse(response);
  };
  
  const handleTalk = () => {
    talkToPlant(plant.id);
    const response = getPlantResponse(plant, 'talking');
    setResponse(response);
  };
  
  return (
    <Container>
      <Card title="Care Actions">
        <ActionGrid>
          <Button onClick={handleWater} variant="water">
            Water
          </Button>
          <Button onClick={handleFertilize} variant="success">
            Fertilize
          </Button>
          <Button onClick={handleMoreSun} variant="secondary">
            More Sun
          </Button>
          <Button onClick={handleLessSun} variant="secondary">
            Less Sun
          </Button>
        </ActionGrid>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Button onClick={handlePrune} variant="primary" fullWidth>
            Prune
          </Button>
          <Button onClick={handleTalk} variant="primary" fullWidth>
            Talk
          </Button>
        </div>
        
        {response && <ResponseContainer>{response}</ResponseContainer>}
      </Card>
    </Container>
  );
};

export default PlantActions; 