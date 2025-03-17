import React from 'react';
import styled from 'styled-components';
import { Plant } from '../../types';
import Card from '../UI/Card';

interface PlantListProps {
  plants: Plant[];
  activePlantId: string | null;
  onSelectPlant: (id: string | null) => void;
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
`;

const PlantCard = styled.div<{ $isActive: boolean }>`
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: ${({ $isActive, theme }) => $isActive ? `2px solid ${theme.colors.primary}` : 'none'};
  cursor: pointer;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
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
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PlantType = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: capitalize;
`;

const PlantInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: 8px;
  
  p {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const PlantList: React.FC<PlantListProps> = ({ plants, activePlantId, onSelectPlant }) => {
  const handleSelectPlant = (id: string) => {
    onSelectPlant(id === activePlantId ? null : id);
  };
  
  return (
    <Container>
      <Card>
        <h3>Your Plants</h3>
        
        {plants.length === 0 ? (
          <EmptyState>
            <p>You don't have any plants yet.</p>
          </EmptyState>
        ) : (
          <PlantGrid>
            {plants.map((plant) => (
              <PlantCard
                key={plant.id}
                $isActive={plant.id === activePlantId}
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