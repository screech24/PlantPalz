import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  height?: string;
  color?: string;
  backgroundColor?: string;
  label?: string;
  showValue?: boolean;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #333;
`;

const BarContainer = styled.div<{ height: string; backgroundColor: string }>`
  width: 100%;
  height: ${({ height }) => height};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div<{ width: string; color: string }>`
  height: 100%;
  width: ${({ width }) => width};
  background-color: ${({ color }) => color};
  border-radius: 4px;
  transition: width 0.3s ease-in-out;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = '12px',
  color = '#4CAF50',
  backgroundColor = '#e0e0e0',
  label,
  showValue = true,
}) => {
  // Ensure value is between 0 and max
  const clampedValue = Math.max(0, Math.min(value, max));
  const percentage = (clampedValue / max) * 100;
  
  return (
    <Container>
      {(label || showValue) && (
        <LabelContainer>
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(percentage)}%</span>}
        </LabelContainer>
      )}
      <BarContainer height={height} backgroundColor={backgroundColor}>
        <Bar width={`${percentage}%`} color={color} />
      </BarContainer>
    </Container>
  );
};

export default ProgressBar; 