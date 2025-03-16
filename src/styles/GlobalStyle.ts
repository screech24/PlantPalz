import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
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
    transition: background-color ${({ theme }) => theme.transitions.medium}, color ${({ theme }) => theme.transitions.medium};
  }
  
  #root {
    height: 100%;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: 1.2;
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
  }
  
  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.xl};
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  input, textarea, select {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  }
  
  ::selection {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export default GlobalStyle; 