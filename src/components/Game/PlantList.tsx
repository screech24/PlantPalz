import React from 'react';
import styled from 'styled-components';
import { Plant } from '../../types';
import { useGameStore } from '../../store/gameStore';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface PlantListProps {
  onNewPlant: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PlantGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const PlantCard = styled(Card)<{ isActive: boolean }>`
  border: ${({ isActive }) => isActive ? '2px solid #4CAF50' : 'none'};
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const PlantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PlantName = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const PlantType = styled.span`
  font-size: 14px;
  color: #666;
  text-transform: capitalize;
`;

const PlantInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  background-color: #f5f5f5;
  border-radius: 8px;
  
  p {
    margin-bottom: 16px;
    color: #666;
  }
`;

export const PlantList: React.FC<PlantListProps> = ({ onNewPlant }) => {
  const plants = useGameStore((state) => state.plants);
  const activePlantId = useGameStore((state) => state.activePlantId);
  const setActivePlant = useGameStore((state) => state.setActivePlant);
  
  const handleSelectPlant = (id: string) => {
    setActivePlant(id);
  };
  
  return (
    <Container>
      <Card title="Your Garden">
        <Button onClick={onNewPlant} variant="primary" fullWidth>
          Add New Plant
        </Button>
        
        {plants.length === 0 ? (
          <EmptyState>
            <p>You don't have any plants yet.</p>
            <Button onClick={onNewPlant} variant="primary">
              Create Your First Plant
            </Button>
          </EmptyState>
        ) : (
          <PlantGrid>
            {plants.map((plant) => (
              <PlantCard
                key={plant.id}
                isActive={plant.id === activePlantId}
                onClick={() => handleSelectPlant(plant.id)}
              >
                <PlantHeader>
                  <PlantName>{plant.name}</PlantName>
                  <PlantType>{plant.type}</PlantType>
                </PlantHeader>
                
                <div>
                  Health: {Math.round(plant.health)}%
                  <br />
                  Happiness: {Math.round(plant.happiness)}%
                </div>
                
                <PlantInfo>
                  <span>Growth: {Math.round(plant.growthStage * 100)}%</span>
                  <span>{plant.personality}</span>
                </PlantInfo>
              </PlantCard>
            ))}
          </PlantGrid>
        )}
      </Card>
    </Container>
  );
};

export default PlantList; 