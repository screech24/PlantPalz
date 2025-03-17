import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    transition: background-color ${({ theme }) => theme.transitions.medium}, 
                color ${({ theme }) => theme.transitions.medium},
                border-color ${({ theme }) => theme.transitions.medium},
                box-shadow ${({ theme }) => theme.transitions.medium};
  }
  
  html, body {
    height: 100%;
    width: 100%;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    height: 100%;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  }
  
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
  
  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
  
  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
  
  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.short};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primaryDark};
    }
  }
  
  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    border: none;
  }
  
  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  input, textarea, select {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    padding: ${({ theme }) => theme.spacing.sm};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight}40;
    }
  }
  
  ::selection {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export default GlobalStyle; 