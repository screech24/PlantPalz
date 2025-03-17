import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'water';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children: React.ReactNode;
  as?: React.ElementType | typeof Link;
  to?: string;
  href?: string;
}

interface StyledButtonProps {
  $variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'water';
  $size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  border: none;
  outline: none;
  
  /* Size variants */
  padding: ${({ $size, theme }) => 
    $size === 'small' ? `${theme.spacing.xs} ${theme.spacing.md}` : 
    $size === 'large' ? `${theme.spacing.md} ${theme.spacing.xl}` : 
    `${theme.spacing.sm} ${theme.spacing.lg}`};
  
  font-size: ${({ $size, theme }) => 
    $size === 'small' ? theme.typography.fontSize.sm : 
    $size === 'large' ? theme.typography.fontSize.lg : 
    theme.typography.fontSize.md};
  
  /* Color variants */
  background-color: ${({ $variant, theme }) => 
    $variant === 'secondary' ? theme.colors.secondary : 
    $variant === 'danger' ? theme.colors.error : 
    $variant === 'success' ? theme.colors.primary : 
    $variant === 'water' ? '#2196f3' : 
    theme.colors.primary};
  
  color: ${({ $variant, theme }) => 
    $variant === 'secondary' ? theme.colors.text.primary : 
    theme.colors.text.primary};
  
  /* Width */
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  
  /* Hover and active states */
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    background-color: ${({ $variant, theme }) => 
      $variant === 'secondary' ? theme.colors.secondaryDark : 
      $variant === 'danger' ? theme.colors.error : 
      $variant === 'success' ? theme.colors.primaryDark : 
      $variant === 'water' ? '#1976d2' : 
      theme.colors.primaryDark};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.sm};
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
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button; 