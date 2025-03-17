import React from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { PotType, PotColor } from '../../models/potModels';
import Card from '../UI/Card';

interface PlantCustomizationProps {
  plantId: string | null;
}

const Container = styled.div`
  margin-bottom: 20px;
`;

const CustomizationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const PotButton = styled.button<{ isActive: boolean; color: string }>`
  width: 100%;
  padding: 8px;
  border: 2px solid ${({ isActive, color }) => isActive ? color : 'transparent'};
  border-radius: 8px;
  background-color: ${({ theme, color }) => color};
  color: ${({ color }) => 
    ['white', 'yellow', 'pink'].includes(color.toLowerCase()) ? '#333' : '#fff'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${({ isActive }) => isActive ? 'bold' : 'normal'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ColorButton = styled.button<{ color: string; isActive: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid ${({ isActive }) => isActive ? '#333' : 'transparent'};
  background-color: ${({ color }) => color};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h3`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const getPotTypeColor = (potType: PotType) => {
  switch (potType) {
    case 'basic':
      return '#8D6E63';
    case 'round':
      return '#5D4037';
    case 'square':
      return '#795548';
    case 'hexagonal':
      return '#6D4C41';
    case 'decorative':
      return '#4E342E';
    default:
      return '#8D6E63';
  }
};

const getColorValue = (color: PotColor) => {
  switch (color) {
    case 'terracotta':
      return '#CD5C5C';
    case 'white':
      return '#FFFFFF';
    case 'black':
      return '#333333';
    case 'blue':
      return '#1E88E5';
    case 'green':
      return '#43A047';
    case 'purple':
      return '#8E24AA';
    case 'yellow':
      return '#FDD835';
    case 'pink':
      return '#EC407A';
    default:
      return '#CD5C5C';
  }
};

export const PlantCustomization: React.FC<PlantCustomizationProps> = ({ plantId }) => {
  const getPlantById = useGameStore((state) => state.getPlantById);
  const updatePotType = useGameStore((state) => state.updatePotType);
  const updatePotColor = useGameStore((state) => state.updatePotColor);
  
  const plant = plantId ? getPlantById(plantId) : null;
  
  if (!plant) {
    return (
      <Card>
        <p>Select a plant to customize its pot.</p>
      </Card>
    );
  }
  
  const handlePotTypeChange = (potType: PotType) => {
    updatePotType(plant.id, potType);
  };
  
  const handlePotColorChange = (potColor: PotColor) => {
    updatePotColor(plant.id, potColor);
  };
  
  const getPotTypeName = (type: PotType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const potTypes: PotType[] = ['basic', 'round', 'square', 'hexagonal', 'decorative'];
  const potColors: PotColor[] = ['terracotta', 'white', 'black', 'blue', 'green', 'purple', 'yellow', 'pink'];
  
  return (
    <Container>
      <Card>
        <h3>Customize Pot</h3>
        
        <SectionTitle>Pot Type</SectionTitle>
        <CustomizationGrid>
          {potTypes.map((type) => (
            <PotButton
              key={type}
              isActive={plant.potType === type}
              color={getPotTypeColor(type)}
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
              color={getColorValue(color)}
              isActive={plant.potColor === color}
              onClick={() => handlePotColorChange(color)}
              title={color.charAt(0).toUpperCase() + color.slice(1)}
            />
          ))}
        </CustomizationGrid>
      </Card>
    </Container>
  );
};

export default PlantCustomization; 