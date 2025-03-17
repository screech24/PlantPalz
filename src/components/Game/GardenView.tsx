import React, { useRef } from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import { useGardenScene } from '../../hooks/useGardenScene';
import Button from '../UI/Button';

const Container = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    height: 600px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => `rgba(${theme.isDark ? '0, 0, 0' : '255, 255, 255'}, 0.8)`};
  z-index: 10;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: center;
  gap: 16px;
  z-index: 10;
`;

const TimeIndicator = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  padding: 8px 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const EmptyState = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  
  h3 {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
  
  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    text-align: center;
    max-width: 80%;
  }
`;

// Sun icon for day time
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

// Moon icon for night time
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

export const GardenView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plants = useGameStore((state) => state.plants);
  const isDaytime = useGameStore((state) => state.isDaytime);
  const isCurtainsOpen = useGameStore((state) => state.isCurtainsOpen);
  const isGrowLightOn = useGameStore((state) => state.isGrowLightOn);
  const toggleCurtains = useGameStore((state) => state.toggleCurtains);
  const toggleGrowLight = useGameStore((state) => state.toggleGrowLight);
  
  const { isLoading } = useGardenScene({
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    plants,
    isDaytime,
    isCurtainsOpen,
    isGrowLightOn,
    onToggleCurtains: toggleCurtains,
    onToggleGrowLight: toggleGrowLight
  });
  
  // If no plants, show empty state
  if (plants.length === 0) {
    return (
      <Container>
        <EmptyState>
          <h3>Your Garden is Empty</h3>
          <p>Create some plants to see them displayed in your garden.</p>
        </EmptyState>
      </Container>
    );
  }
  
  return (
    <Container ref={containerRef}>
      {isLoading && (
        <LoadingOverlay>
          <p>Loading garden...</p>
        </LoadingOverlay>
      )}
      
      <TimeIndicator>
        {isDaytime ? <SunIcon /> : <MoonIcon />}
        {isDaytime ? 'Day' : 'Night'}
      </TimeIndicator>
      
      <ControlsOverlay>
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
          {isGrowLightOn ? 'Turn Off Grow Light' : 'Turn On Grow Light'}
        </Button>
      </ControlsOverlay>
    </Container>
  );
};

export default GardenView; 