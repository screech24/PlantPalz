import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: white;
  }
`;

const LogoIcon = styled.span`
  font-size: 24px;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: white;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md};
  margin: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transitions.short};
  font-weight: ${({ $active, theme }) => 
    $active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular};
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primaryDark : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md} 0;
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: transform ${({ theme }) => theme.transitions.medium},
              opacity ${({ theme }) => theme.transitions.medium};
  z-index: 999;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)<{ $active?: boolean }>`
  color: white;
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  transition: background-color ${({ theme }) => theme.transitions.short};
  font-weight: ${({ $active, theme }) => 
    $active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular};
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primaryDark : 'transparent'};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    color: white;
  }
`;

const PlantCount = styled.span`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  padding: 2px 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { plants } = useGameStore();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen && 
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <NavbarContainer>
      <Logo to="/">
        <LogoIcon>🌱</LogoIcon>
        Plant Palz
      </Logo>
      
      <NavLinks>
        <NavLink to="/" $active={isActive('/')}>
          Home
        </NavLink>
        <NavLink to="/game" $active={isActive('/game')}>
          My Garden
          {plants.length > 0 && <PlantCount>{plants.length}</PlantCount>}
        </NavLink>
        <NavLink to="/settings" $active={isActive('/settings')}>
          Settings
        </NavLink>
      </NavLinks>
      
      <MobileMenuButton ref={mobileButtonRef} onClick={toggleMobileMenu}>
        {mobileMenuOpen ? '✕' : '☰'}
      </MobileMenuButton>
      
      <MobileMenu ref={mobileMenuRef} $isOpen={mobileMenuOpen}>
        <MobileNavLink to="/" $active={isActive('/')} onClick={closeMobileMenu}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/game" $active={isActive('/game')} onClick={closeMobileMenu}>
          My Garden
          {plants.length > 0 && <PlantCount>{plants.length}</PlantCount>}
        </MobileNavLink>
        <MobileNavLink to="/settings" $active={isActive('/settings')} onClick={closeMobileMenu}>
          Settings
        </MobileNavLink>
      </MobileMenu>
    </NavbarContainer>
  );
};

export default Navbar; 