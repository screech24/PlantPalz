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

const getPotTypeColor = (potType: PotType) => {
  switch (potType) {
    case 'basic': return '#8d6e63';
    case 'round': return '#5c6bc0';
    case 'square': return '#26a69a';
    case 'hexagonal': return '#ec407a';
    case 'decorative': return '#7e57c2';
    default: return '#8d6e63';
  }
};

const PotOption = styled.div<{ selected: boolean; potType: PotType }>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => props.selected 
    ? `${getPotTypeColor(props.potType)}` 
    : props.theme.colors.surface};
  border: 2px solid ${props => props.selected 
    ? props.theme.colors.primary 
    : props.theme.colors.border};
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  color: ${props => props.selected ? '#ffffff' : props.theme.colors.text.primary};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  
  &:hover {
    background-color: ${props => props.selected 
      ? getPotTypeColor(props.potType) 
      : `${getPotTypeColor(props.potType)}40`};
    transform: translateY(-2px);
  }
`;

const ColorOption = styled.div<{ color: string; selected: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 3px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  cursor: pointer;
  margin: 0 auto;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  }
`;

const SectionTitle = styled.h4`
  margin: 15px 0 5px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
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
              potType={potType}
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