import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { useGameStore } from './store/gameStore';
import { useThemeStore } from './store/themeStore';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import SharePage from './pages/SharePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import { lightTheme, darkTheme } from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 60px; /* Height of navbar */
`;

function App() {
  const { updateGameState } = useGameStore();
  const { isDarkMode } = useThemeStore();
  
  // Update game state periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateGameState();
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [updateGameState]);
  
  // Select theme based on isDarkMode
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Router>
        <AppContainer>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/share" element={<SharePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </MainContent>
          <Footer />
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
