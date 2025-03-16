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
  padding: string;
  elevation: string;
  fullWidth: boolean;
  clickable: boolean;
}>`
  background-color: #ffffff;
  border-radius: 12px;
  padding: ${({ padding }) => padding};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  
  /* Elevation variants */
  box-shadow: ${({ elevation }) =>
    elevation === 'low'
      ? '0 2px 4px rgba(0, 0, 0, 0.05)'
      : elevation === 'high'
      ? '0 8px 16px rgba(0, 0, 0, 0.1)'
      : '0 4px 8px rgba(0, 0, 0, 0.05)'};
  
  /* Clickable styles */
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: ${({ clickable }) => (clickable ? 'translateY(-2px)' : 'none')};
    box-shadow: ${({ clickable, elevation }) =>
      clickable
        ? elevation === 'low'
          ? '0 4px 8px rgba(0, 0, 0, 0.1)'
          : elevation === 'high'
          ? '0 12px 24px rgba(0, 0, 0, 0.15)'
          : '0 8px 16px rgba(0, 0, 0, 0.1)'
        : elevation === 'low'
        ? '0 2px 4px rgba(0, 0, 0, 0.05)'
        : elevation === 'high'
        ? '0 8px 16px rgba(0, 0, 0, 0.1)'
        : '0 4px 8px rgba(0, 0, 0, 0.05)'};
  }
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
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
      padding={padding}
      elevation={elevation}
      fullWidth={fullWidth}
      clickable={!!onClick}
      onClick={onClick}
    >
      {title && <Title>{title}</Title>}
      {children}
    </Container>
  );
};

export default Card; 