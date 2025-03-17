import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  padding?: string;
  elevation?: 'low' | 'medium' | 'high';
  fullWidth?: boolean;
  onClick?: () => void;
}

const Container = styled.div<{
  $padding: string;
  $elevation: string;
  $fullWidth: boolean;
  $clickable: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ $padding }) => $padding};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  
  /* Elevation variants */
  box-shadow: ${({ $elevation, theme }) =>
    $elevation === 'low'
      ? theme.shadows.sm
      : $elevation === 'high'
      ? theme.shadows.lg
      : theme.shadows.md};
  
  /* Clickable styles */
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: transform ${({ theme }) => theme.transitions.short}, 
              box-shadow ${({ theme }) => theme.transitions.short};
  
  &:hover {
    transform: ${({ $clickable }) => ($clickable ? 'translateY(-2px)' : 'none')};
    box-shadow: ${({ $clickable, $elevation, theme }) =>
      $clickable
        ? $elevation === 'low'
          ? theme.shadows.md
          : $elevation === 'high'
          ? theme.shadows.xl
          : theme.shadows.lg
        : $elevation === 'low'
        ? theme.shadows.sm
        : $elevation === 'high'
        ? theme.shadows.lg
        : theme.shadows.md};
  }
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Card: React.FC<CardProps> = ({
  children,
  title,
  padding = '16px',
  elevation = 'medium',
  fullWidth = false,
  onClick,
}) => {
  return (
    <Container
      $padding={padding}
      $elevation={elevation}
      $fullWidth={fullWidth}
      $clickable={!!onClick}
      onClick={onClick}
    >
      {title && <Title>{title}</Title>}
      {children}
    </Container>
  );
};

export default Card; 