import React from 'react';
import styled from 'styled-components';
import { Plant } from '../../types';
import { useGameStore } from '../../store/gameStore';
import { PotType, PotColor } from '../../models/potModels';
import Card from '../UI/Card';

interface PlantCustomizationProps {
  plant: Plant | null;
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

const PotOption = styled.div<{ selected: boolean }>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => props.selected ? props.theme.accentLight : props.theme.cardBackground};
  border: 2px solid ${props => props.selected ? props.theme.accent : props.theme.border};
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.accentLight};
  }
`;

const ColorOption = styled.div<{ color: string; selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 2px solid ${props => props.selected ? props.theme.accent : props.theme.border};
  cursor: pointer;
  margin: 0 auto;
`;

const SectionTitle = styled.h4`
  margin: 15px 0 5px;
  font-size: 1rem;
`;

export const PlantCustomization: React.FC<PlantCustomizationProps> = ({ plant }) => {
  const updatePotType = useGameStore((state) => state.updatePotType);
  const updatePotColor = useGameStore((state) => state.updatePotColor);
  
  if (!plant) {
    return null;
  }
  
  const potTypes: PotType[] = ['basic', 'round', 'square', 'hexagonal', 'decorative'];
  const potColors: { color: PotColor; hex: string }[] = [
    { color: 'terracotta', hex: '#c84c0c' },
    { color: 'white', hex: '#ffffff' },
    { color: 'black', hex: '#333333' },
    { color: 'blue', hex: '#4169e1' },
    { color: 'green', hex: '#2e8b57' },
    { color: 'purple', hex: '#9370db' },
    { color: 'yellow', hex: '#ffd700' },
    { color: 'pink', hex: '#ff69b4' }
  ];
  
  const handlePotTypeChange = (potType: PotType) => {
    updatePotType(plant.id, potType);
  };
  
  const handlePotColorChange = (potColor: PotColor) => {
    updatePotColor(plant.id, potColor);
  };
  
  const getPotTypeName = (type: PotType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  return (
    <Container>
      <Card title="Customize Plant">
        <SectionTitle>Pot Style</SectionTitle>
        <CustomizationGrid>
          {potTypes.map((potType) => (
            <PotOption
              key={potType}
              selected={plant.potType === potType}
              onClick={() => handlePotTypeChange(potType)}
            >
              {getPotTypeName(potType)}
            </PotOption>
          ))}
        </CustomizationGrid>
        
        <SectionTitle>Pot Color</SectionTitle>
        <CustomizationGrid>
          {potColors.map((potColorOption) => (
            <ColorOption
              key={potColorOption.color}
              color={potColorOption.hex}
              selected={plant.potColor === potColorOption.color}
              onClick={() => handlePotColorChange(potColorOption.color)}
            />
          ))}
        </CustomizationGrid>
      </Card>
    </Container>
  );
};

export default PlantCustomization; 