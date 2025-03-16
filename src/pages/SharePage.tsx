import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Plant } from '../types';
import { handleSharedPlantLink } from '../utils/sharing';
import { useGameStore } from '../stores/gameStore';
import PlantView from '../components/Game/PlantView';
import PlantStats from '../components/Game/PlantStats';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2e7d32;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PlantViewContainer = styled.div`
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StatsContainer = styled(Card)`
  padding: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 1.2rem;
  color: #555;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 48px;
  font-size: 1.2rem;
  color: #d32f2f;
`;

const SharePage: React.FC = () => {
  const navigate = useNavigate();
  const { plants, getPlantById } = useGameStore();
  const [sharedPlant, setSharedPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSharedPlant = async () => {
      try {
        setLoading(true);
        
        // Get plant ID from URL
        const plantId = handleSharedPlantLink();
        
        if (!plantId) {
          setError('No plant found in the shared link');
          setLoading(false);
          return;
        }
        
        // Find the plant in the store
        const plant = getPlantById(plantId);
        
        if (!plant) {
          setError('Plant not found. It may have been deleted or the link is invalid.');
          setLoading(false);
          return;
        }
        
        setSharedPlant(plant);
        setLoading(false);
      } catch (error) {
        console.error('Error loading shared plant:', error);
        setError('Failed to load the shared plant');
        setLoading(false);
      }
    };
    
    loadSharedPlant();
  }, [getPlantById]);
  
  const handleAddToGarden = () => {
    if (sharedPlant) {
      // In a real app, you would clone the plant and add it to the user's garden
      // For now, we'll just navigate to the game page
      navigate('/game');
    }
  };
  
  const handleGoToGame = () => {
    navigate('/game');
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading shared plant...</LoadingMessage>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
        <ButtonContainer>
          <Button onClick={handleGoToGame} variant="primary">
            Go to My Garden
          </Button>
        </ButtonContainer>
      </Container>
    );
  }
  
  if (!sharedPlant) {
    return (
      <Container>
        <ErrorMessage>Plant not found</ErrorMessage>
        <ButtonContainer>
          <Button onClick={handleGoToGame} variant="primary">
            Go to My Garden
          </Button>
        </ButtonContainer>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>{sharedPlant.name}</Title>
        <Subtitle>A beautiful {sharedPlant.type} shared with you!</Subtitle>
      </Header>
      
      <Content>
        <PlantViewContainer>
          <PlantView plantId={sharedPlant.id} />
        </PlantViewContainer>
        
        <StatsContainer>
          <PlantStats plant={sharedPlant} />
        </StatsContainer>
      </Content>
      
      <ButtonContainer>
        <Button onClick={handleAddToGarden} variant="primary">
          Add to My Garden
        </Button>
        <Button onClick={handleGoToGame} variant="secondary">
          Go to My Garden
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default SharePage; 