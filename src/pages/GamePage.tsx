import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../store/gameStore';
import PlantView from '../components/Game/PlantView';
import PlantStats from '../components/Game/PlantStats';
import PlantActions from '../components/Game/PlantActions';
import PlantList from '../components/Game/PlantList';
import NewPlantForm from '../components/Game/NewPlantForm';
import ShareModal from '../components/Shared/ShareModal';
import PlantCustomization from '../components/Game/PlantCustomization';
import Button from '../components/UI/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 24px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 3fr 2fr;
    grid-template-areas: 
      "view stats"
      "view actions"
      "view customize";
  }
`;

const PlantViewContainer = styled.div`
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: view;
    height: 100%;
    min-height: 500px;
  }
`;

const StatsContainer = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: stats;
  }
`;

const ActionsContainer = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: actions;
  }
`;

const CustomizationContainer = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-area: customize;
  }
`;

const ListContainer = styled.div`
  margin-top: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    
    > button {
      flex: 1;
    }
  }
`;

export const GamePage: React.FC = () => {
  const [isNewPlantModalOpen, setIsNewPlantModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { activePlantId, getPlantById } = useGameStore();
  
  const activePlant = activePlantId ? getPlantById(activePlantId) : null;
  
  const handleOpenNewPlantModal = () => {
    setIsNewPlantModalOpen(true);
  };
  
  const handleCloseNewPlantModal = () => {
    setIsNewPlantModalOpen(false);
  };
  
  const handleOpenShareModal = () => {
    if (activePlant) {
      setIsShareModalOpen(true);
    }
  };
  
  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };
  
  return (
    <Container>
      <Header>
        <Title>My Garden</Title>
        <ButtonGroup>
          {activePlant && (
            <Button onClick={handleOpenShareModal} variant="secondary">
              Share Plant
            </Button>
          )}
          <Button onClick={handleOpenNewPlantModal} variant="primary">
            New Plant
          </Button>
        </ButtonGroup>
      </Header>
      
      <GameGrid>
        <PlantViewContainer id="plant-view-container">
          {activePlantId && <PlantView plantId={activePlantId} />}
        </PlantViewContainer>
        
        <StatsContainer>
          <PlantStats plant={activePlant} />
        </StatsContainer>
        
        <ActionsContainer>
          <PlantActions plant={activePlant} />
        </ActionsContainer>
        
        <CustomizationContainer>
          {activePlant && <PlantCustomization plant={activePlant} />}
        </CustomizationContainer>
      </GameGrid>
      
      <ListContainer>
        <PlantList onNewPlant={handleOpenNewPlantModal} />
      </ListContainer>
      
      <NewPlantForm 
        isOpen={isNewPlantModalOpen} 
        onClose={handleCloseNewPlantModal} 
      />
      
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={handleCloseShareModal} 
        plant={activePlant} 
      />
    </Container>
  );
};

export default GamePage; 