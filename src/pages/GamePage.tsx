import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../store/gameStore';
import PlantView from '../components/Game/PlantView';
import PlantStats from '../components/Game/PlantStats';
import PlantActions from '../components/Game/PlantActions';
import PlantList from '../components/Game/PlantList';
import NewPlantForm from '../components/Game/NewPlantForm';
import ShareModal from '../components/Shared/ShareModal';
import Button from '../components/UI/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const GameGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const PlantViewContainer = styled.div`
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  grid-column: 1 / -1;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
  }
`;

const StatsContainer = styled.div`
  grid-column: 1 / -1;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-column: auto;
  }
`;

const ActionsContainer = styled.div`
  grid-column: 1 / -1;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-column: auto;
  }
`;

const ListContainer = styled.div`
  grid-column: 1 / -1;
  margin-top: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
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