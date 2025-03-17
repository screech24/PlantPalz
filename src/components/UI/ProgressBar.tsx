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
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const BarContainer = styled.div<{ $height: string; $backgroundColor: string }>`
  width: 100%;
  height: ${({ $height }) => $height};
  background-color: ${({ $backgroundColor, theme }) => $backgroundColor || theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const Bar = styled.div<{ width: string; $color: string }>`
  height: 100%;
  width: ${({ width }) => width};
  background-color: ${({ $color, theme }) => $color || theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: width ${({ theme }) => theme.transitions.medium};
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = '12px',
  color,
  backgroundColor,
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
      <BarContainer $height={height} $backgroundColor={backgroundColor || ''}>
        <Bar width={`${percentage}%`} $color={color || ''} />
      </BarContainer>
    </Container>
  );
};

export default ProgressBar; 