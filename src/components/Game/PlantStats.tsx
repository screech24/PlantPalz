import React from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import ProgressBar from '../UI/ProgressBar';
import Card from '../UI/Card';

interface PlantStatsProps {
  plantId: string | null;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PlantName = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const PlantType = styled.p`
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #666;
  text-transform: capitalize;
`;

const StatsItem = styled.div`
  margin-bottom: 16px;
`;

const GrowthStageLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  
  span:first-child {
    font-weight: 600;
  }
  
  span:last-child {
    color: #666;
  }
`;

const getGrowthStageLabel = (growthStage: number): string => {
  if (growthStage < 0.2) return 'Seedling';
  if (growthStage < 0.5) return 'Young Plant';
  if (growthStage < 0.8) return 'Mature Plant';
  return 'Fully Grown';
};

export const PlantStats: React.FC<PlantStatsProps> = ({ plantId }) => {
  const getPlantById = useGameStore((state) => state.getPlantById);
  const plant = plantId ? getPlantById(plantId) : null;
  
  if (!plant) {
    return (
      <Card>
        <p>Select a plant to view its stats.</p>
      </Card>
    );
  }
  
  const growthStageLabel = getGrowthStageLabel(plant.growthStage);
  
  return (
    <Container>
      <Card>
        <PlantName>{plant.name}</PlantName>
        <PlantType>{plant.type} Plant</PlantType>
        
        <StatsItem>
          <GrowthStageLabel>
            <span>Growth Stage</span>
            <span>{growthStageLabel}</span>
          </GrowthStageLabel>
          <ProgressBar 
            value={plant.growthStage * 100} 
            color="#8bc34a" 
            label="Growth" 
          />
        </StatsItem>
      </Card>
      
      <StatsGrid>
        <Card>
          <StatsItem>
            <ProgressBar 
              value={plant.health} 
              color="#4caf50" 
              label="Health" 
            />
          </StatsItem>
          
          <StatsItem>
            <ProgressBar 
              value={plant.happiness} 
              color="#ff9800" 
              label="Happiness" 
            />
          </StatsItem>
        </Card>
        
        <Card>
          <StatsItem>
            <ProgressBar 
              value={plant.waterLevel} 
              color="#2196f3" 
              label="Water" 
            />
          </StatsItem>
          
          <StatsItem>
            <ProgressBar 
              value={plant.fertilizerLevel} 
              color="#795548" 
              label="Fertilizer" 
            />
          </StatsItem>
          
          <StatsItem>
            <ProgressBar 
              value={plant.sunExposure} 
              color="#ffeb3b" 
              label="Sunlight" 
            />
          </StatsItem>
        </Card>
      </StatsGrid>
      
      <Card>
        <h3>Personality: {plant.personality}</h3>
        <p>Created: {new Date(plant.createdAt).toLocaleDateString()}</p>
        {plant.traits.length > 0 && (
          <>
            <h3>Traits</h3>
            <ul>
              {plant.traits.map((trait) => (
                <li key={trait.id}>
                  <strong>{trait.name}</strong>: {trait.description}
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </Container>
  );
};

export default PlantStats; 