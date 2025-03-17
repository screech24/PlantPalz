import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { getPlantResponse } from '../../utils/plantResponses';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface PlantActionsProps {
  plantId: string | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
`;

const ResponseContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  p {
    margin: 0;
    font-style: italic;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const PlantActions: React.FC<PlantActionsProps> = ({ plantId }) => {
  const [response, setResponse] = useState<string | null>(null);
  const getPlantById = useGameStore((state) => state.getPlantById);
  const waterPlant = useGameStore((state) => state.waterPlant);
  const fertilizePlant = useGameStore((state) => state.fertilizePlant);
  const adjustSunlight = useGameStore((state) => state.adjustSunlight);
  const prunePlant = useGameStore((state) => state.prunePlant);
  const talkToPlant = useGameStore((state) => state.talkToPlant);
  
  const plant = plantId ? getPlantById(plantId) : null;
  
  if (!plant) {
    return (
      <Card>
        <p>Select a plant to perform actions.</p>
      </Card>
    );
  }
  
  const handleWater = () => {
    waterPlant(plant.id, 25);
    setResponse(getPlantResponse(plant, 'watering'));
  };
  
  const handleFertilize = () => {
    fertilizePlant(plant.id, 20);
    setResponse(getPlantResponse(plant, 'fertilizing'));
  };
  
  const handleMoreSun = () => {
    adjustSunlight(plant.id, 15);
    setResponse(getPlantResponse(plant, 'sunlight'));
  };
  
  const handleLessSun = () => {
    adjustSunlight(plant.id, -15);
    setResponse(getPlantResponse(plant, 'sunlight'));
  };
  
  const handlePrune = () => {
    prunePlant(plant.id);
    setResponse(getPlantResponse(plant, 'pruning'));
  };
  
  const handleTalk = () => {
    talkToPlant(plant.id);
    setResponse(getPlantResponse(plant, 'talking'));
  };
  
  return (
    <Container>
      <Card>
        <h3>Care Actions</h3>
        <ActionGrid>
          <Button 
            onClick={handleWater} 
            variant="water"
            disabled={plant.waterLevel >= 100}
          >
            Water
          </Button>
          
          <Button 
            onClick={handleFertilize} 
            variant="secondary"
            disabled={plant.fertilizerLevel >= 100}
          >
            Fertilize
          </Button>
          
          <Button 
            onClick={handleMoreSun} 
            variant="secondary"
            disabled={plant.sunExposure >= 100}
          >
            More Sun
          </Button>
          
          <Button 
            onClick={handleLessSun} 
            variant="secondary"
            disabled={plant.sunExposure <= 0}
          >
            Less Sun
          </Button>
          
          <Button 
            onClick={handlePrune} 
            variant="secondary"
            disabled={plant.growthStage < 0.5}
          >
            Prune
          </Button>
          
          <Button 
            onClick={handleTalk} 
            variant="primary"
          >
            Talk
          </Button>
        </ActionGrid>
        
        {response && (
          <ResponseContainer>
            <p>"{response}"</p>
          </ResponseContainer>
        )}
      </Card>
    </Container>
  );
};

export default PlantActions; 