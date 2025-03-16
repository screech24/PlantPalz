import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
  as?: React.ElementType | typeof Link;
  to?: string;
  href?: string;
}

const StyledButton = styled.button<Omit<ButtonProps, 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;
  outline: none;
  
  /* Size variants */
  padding: ${({ size }) => 
    size === 'small' ? '8px 16px' : 
    size === 'large' ? '16px 32px' : 
    '12px 24px'};
  
  font-size: ${({ size }) => 
    size === 'small' ? '14px' : 
    size === 'large' ? '18px' : 
    '16px'};
  
  /* Color variants */
  background-color: ${({ variant }) => 
    variant === 'secondary' ? '#f5f5f5' : 
    variant === 'danger' ? '#f44336' : 
    variant === 'success' ? '#4caf50' : 
    '#4CAF50'};
  
  color: ${({ variant }) => 
    variant === 'secondary' ? '#333333' : 
    '#ffffff'};
  
  /* Width */
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  
  /* Hover and active states */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${({ variant }) => 
      variant === 'secondary' ? '#e0e0e0' : 
      variant === 'danger' ? '#d32f2f' : 
      variant === 'success' ? '#388e3c' : 
      '#388e3c'};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  as: Component = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      as={Component}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 