import React, { useState } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../store/gameStore';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SettingsSection = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
`;

const SettingItem = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: 8px;
`;

const SettingDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: 12px;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.border};
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

const SliderValue = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const ConfirmationModal = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  width: 90%;
  max-width: 500px;
  padding: 24px;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: 16px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const SettingsPage: React.FC = () => {
  const { timeScale, setTimeScale, resetGame } = useGameStore();
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  const handleTimeScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeScale(parseFloat(e.target.value));
  };
  
  const handleResetClick = () => {
    setShowResetConfirmation(true);
  };
  
  const handleConfirmReset = () => {
    resetGame();
    setShowResetConfirmation(false);
  };
  
  const handleCancelReset = () => {
    setShowResetConfirmation(false);
  };
  
  return (
    <Container>
      <Header>
        <Title>Settings</Title>
        <Subtitle>Customize your Plant Palz experience</Subtitle>
      </Header>
      
      <SettingsSection>
        <SectionTitle>Game Settings</SectionTitle>
        
        <SettingItem>
          <SettingLabel htmlFor="timeScale">Time Scale</SettingLabel>
          <SettingDescription>
            Adjust how quickly time passes in the game. Higher values make plants grow faster.
          </SettingDescription>
          <SliderContainer>
            <Slider
              id="timeScale"
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={timeScale}
              onChange={handleTimeScaleChange}
            />
            <SliderValue>{timeScale}x</SliderValue>
          </SliderContainer>
        </SettingItem>
      </SettingsSection>
      
      <SettingsSection>
        <SectionTitle>Data Management</SectionTitle>
        
        <SettingItem>
          <SettingLabel>Reset Game</SettingLabel>
          <SettingDescription>
            This will delete all your plants and reset your game progress. This action cannot be undone.
          </SettingDescription>
          <Button onClick={handleResetClick} variant="danger">
            Reset Game
          </Button>
        </SettingItem>
      </SettingsSection>
      
      <ConfirmationModal isVisible={showResetConfirmation}>
        <ModalContent>
          <ModalTitle>Are you sure?</ModalTitle>
          <p>
            This will delete all your plants and reset your game progress. 
            This action cannot be undone.
          </p>
          <ModalButtons>
            <Button onClick={handleCancelReset} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirmReset} variant="danger">
              Reset Game
            </Button>
          </ModalButtons>
        </ModalContent>
      </ConfirmationModal>
    </Container>
  );
};

export default SettingsPage; 