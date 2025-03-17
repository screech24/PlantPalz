import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { getPlantResponse } from '../../utils/plantResponses';
import Button from '../UI/Button';
import Card from '../UI/Card';
import ProgressBar from '../UI/ProgressBar';
import { PotType, PotColor, getColorValue } from '../../models/potModels';

interface PlantControlsProps {
  plantId: string | null;
}

const Container = styled.div`
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.surface};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
`;

const StatsItem = styled.div`
  margin-bottom: 8px;
`;

const PlantName = styled.h3`
  margin: 0 0 4px 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PlantType = styled.p`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const GrowthStageLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 16px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.text.secondary};
  cursor: pointer;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const CustomizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const PotButton = styled.button<{ $isActive: boolean; $color: string }>`
  padding: 8px;
  background-color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.background};
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.colors.text.onPrimary : theme.colors.text.primary};
  border: 1px solid ${({ $color }) => $color};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ $isActive, theme, $color }) => 
      $isActive ? theme.colors.primary : $color + '33'};
  }
`;

const ColorButton = styled.button<{ $isActive: boolean; $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  border: 2px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const getPotTypeColor = (type: PotType): string => {
  switch (type) {
    case 'basic': return '#a67c52';
    case 'round': return '#5d9cec';
    case 'square': return '#ed5565';
    case 'hexagonal': return '#a0d468';
    case 'decorative': return '#ac92ec';
    default: return '#a67c52';
  }
};

const getGrowthStageLabel = (growthStage: number): string => {
  if (growthStage < 0.25) return 'Seedling';
  if (growthStage < 0.5) return 'Sprout';
  if (growthStage < 0.75) return 'Young';
  if (growthStage < 1) return 'Mature';
  return 'Flourishing';
};

export const PlantControls: React.FC<PlantControlsProps> = ({ plantId }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'actions' | 'customize'>('stats');
  const [response, setResponse] = useState<string | null>(null);
  
  const getPlantById = useGameStore((state) => state.getPlantById);
  const waterPlant = useGameStore((state) => state.waterPlant);
  const fertilizePlant = useGameStore((state) => state.fertilizePlant);
  const adjustSunlight = useGameStore((state) => state.adjustSunlight);
  const prunePlant = useGameStore((state) => state.prunePlant);
  const talkToPlant = useGameStore((state) => state.talkToPlant);
  const updatePotType = useGameStore((state) => state.updatePotType);
  const updatePotColor = useGameStore((state) => state.updatePotColor);
  const toggleCurtains = useGameStore((state) => state.toggleCurtains);
  const toggleGrowLight = useGameStore((state) => state.toggleGrowLight);
  const isCurtainsOpen = useGameStore((state) => state.isCurtainsOpen);
  const isGrowLightOn = useGameStore((state) => state.isGrowLightOn);
  
  const plant = plantId ? getPlantById(plantId) : null;
  
  if (!plant) {
    return null;
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
  
  const handlePotTypeChange = (potType: PotType) => {
    updatePotType(plant.id, potType);
  };
  
  const handlePotColorChange = (potColor: PotColor) => {
    updatePotColor(plant.id, potColor);
  };
  
  const getPotTypeName = (type: PotType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const growthStageLabel = getGrowthStageLabel(plant.growthStage);
  const potTypes: PotType[] = ['basic', 'round', 'square', 'hexagonal', 'decorative'];
  const potColors: PotColor[] = ['terracotta', 'white', 'black', 'blue', 'green', 'purple', 'yellow', 'pink'];
  
  return (
    <Container>
      <StyledCard>
        <PlantName>{plant.name}</PlantName>
        <PlantType>{plant.type} Plant ({plant.personality})</PlantType>
        
        <TabContainer>
          <Tab 
            $active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </Tab>
          <Tab 
            $active={activeTab === 'actions'} 
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </Tab>
          <Tab 
            $active={activeTab === 'customize'} 
            onClick={() => setActiveTab('customize')}
          >
            Customize
          </Tab>
        </TabContainer>
        
        {activeTab === 'stats' && (
          <>
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
            
            <StatsGrid>
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
            </StatsGrid>
          </>
        )}
        
        {activeTab === 'actions' && (
          <>
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
              
              <Button 
                onClick={toggleCurtains}
                variant="secondary"
              >
                {isCurtainsOpen ? 'Close Curtains' : 'Open Curtains'}
              </Button>
              
              <Button 
                onClick={toggleGrowLight}
                variant="secondary"
              >
                {isGrowLightOn ? 'Turn Off Light' : 'Turn On Light'}
              </Button>
            </ActionGrid>
            
            {response && (
              <ResponseContainer>
                <p>"{response}"</p>
              </ResponseContainer>
            )}
          </>
        )}
        
        {activeTab === 'customize' && (
          <>
            <SectionTitle>Pot Type</SectionTitle>
            <CustomizationGrid>
              {potTypes.map((type) => (
                <PotButton
                  key={type}
                  $isActive={plant.potType === type}
                  $color={getPotTypeColor(type)}
                  onClick={() => handlePotTypeChange(type)}
                >
                  {getPotTypeName(type)}
                </PotButton>
              ))}
            </CustomizationGrid>
            
            <SectionTitle>Pot Color</SectionTitle>
            <CustomizationGrid>
              {potColors.map((color) => (
                <ColorButton
                  key={color}
                  $color={getColorValue(color)}
                  $isActive={plant.potColor === color}
                  onClick={() => handlePotColorChange(color)}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </CustomizationGrid>
          </>
        )}
      </StyledCard>
    </Container>
  );
};

export default PlantControls; 