import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../store/gameStore';
import PlantView from '../components/Game/PlantView';
import PlantStats from '../components/Game/PlantStats';
import PlantActions from '../components/Game/PlantActions';
import PlantList from '../components/Game/PlantList';
import NewPlantForm from '../components/Game/NewPlantForm';
import ShareModal from '../components/Shared/ShareModal';
import PlantCustomization from '../components/Game/PlantCustomization';
import GardenView from '../components/Game/GardenView';
import Button from '../components/UI/Button';
import Achievements from '../components/Game/Achievements';

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
      "view sidebar"
      "actions sidebar";
  }
`;

const ViewContainer = styled.div`
  grid-area: view;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const ViewToggleButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, active }) => 
    active ? theme.colors.white : theme.colors.text.primary};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.surfaceHover};
  }
`;

const ActionsContainer = styled.div`
  grid-area: actions;
`;

const Sidebar = styled.div`
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const GamePage: React.FC = () => {
  const [showNewPlantModal, setShowNewPlantModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [viewMode, setViewMode] = useState<'plant' | 'garden'>('plant');
  
  const plants = useGameStore((state) => state.plants);
  const activePlantId = useGameStore((state) => state.activePlantId);
  const setActivePlant = useGameStore((state) => state.setActivePlant);
  const updateGameState = useGameStore((state) => state.updateGameState);
  
  // Update game state every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateGameState();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [updateGameState]);
  
  const handleOpenNewPlantModal = () => {
    setShowNewPlantModal(true);
  };
  
  const handleCloseNewPlantModal = () => {
    setShowNewPlantModal(false);
  };
  
  const handleOpenShareModal = () => {
    if (activePlantId) {
      setShowShareModal(true);
    }
  };
  
  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };
  
  const handleToggleAchievements = () => {
    setShowAchievements(!showAchievements);
  };
  
  return (
    <Container>
      <Header>
        <Title>Your Garden</Title>
        <ButtonGroup>
          <Button onClick={handleOpenNewPlantModal} variant="primary">
            New Plant
          </Button>
          <Button 
            onClick={handleOpenShareModal} 
            variant="secondary"
            disabled={!activePlantId}
          >
            Share Plant
          </Button>
          <Button 
            onClick={handleToggleAchievements} 
            variant="secondary"
          >
            Achievements
          </Button>
        </ButtonGroup>
      </Header>
      
      <GameGrid>
        <ViewContainer>
          <ViewToggle>
            <ViewToggleButton 
              active={viewMode === 'plant'} 
              onClick={() => setViewMode('plant')}
            >
              Individual Plant
            </ViewToggleButton>
            <ViewToggleButton 
              active={viewMode === 'garden'} 
              onClick={() => setViewMode('garden')}
            >
              Garden View
            </ViewToggleButton>
          </ViewToggle>
          
          {viewMode === 'plant' ? (
            <PlantView plantId={activePlantId} />
          ) : (
            <GardenView />
          )}
        </ViewContainer>
        
        <ActionsContainer>
          {viewMode === 'plant' && activePlantId && (
            <>
              <PlantStats plantId={activePlantId} />
              <PlantActions plantId={activePlantId} />
              <PlantCustomization plantId={activePlantId} />
            </>
          )}
        </ActionsContainer>
        
        <Sidebar>
          <PlantList 
            plants={plants} 
            activePlantId={activePlantId} 
            onSelectPlant={setActivePlant}
          />
        </Sidebar>
      </GameGrid>
      
      {showNewPlantModal && (
        <Modal onClick={handleCloseNewPlantModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <NewPlantForm onClose={handleCloseNewPlantModal} />
          </ModalContent>
        </Modal>
      )}
      
      {showShareModal && activePlantId && (
        <Modal onClick={handleCloseShareModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ShareModal plantId={activePlantId} onClose={handleCloseShareModal} />
          </ModalContent>
        </Modal>
      )}
      
      {showAchievements && (
        <Modal onClick={handleToggleAchievements}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Achievements onClose={handleToggleAchievements} />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default GamePage; 