import React from 'react';
import styled from 'styled-components';
import { useGameStore } from '../../store/gameStore';
import Card from '../UI/Card';
import { AchievementCategory } from '../../types';

const Container = styled.div`
  margin-bottom: 24px;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const AchievementItem = styled.div<{ unlocked: boolean }>`
  background-color: ${({ theme, unlocked }) => 
    unlocked ? theme.colors.success + '20' : theme.colors.surface};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: ${({ unlocked }) => unlocked ? 1 : 0.6};
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${({ unlocked }) => unlocked ? 'scale(1.05)' : 'none'};
    box-shadow: ${({ unlocked, theme }) => 
      unlocked ? `0 4px 8px ${theme.colors.shadow}` : 'none'};
  }
`;

const AchievementIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const AchievementTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AchievementDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const CategoryTabs = styled.div`
  display: flex;
  overflow-x: auto;
  margin-bottom: 16px;
  padding-bottom: 8px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
`;

const CategoryTab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, active }) => 
    active ? theme.colors.white : theme.colors.text.primary};
  border: none;
  border-radius: 16px;
  margin-right: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary : theme.colors.border};
  }
`;

const UnlockedDate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 8px;
`;

export const Achievements: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<AchievementCategory | 'all'>('all');
  const achievements = useGameStore((state) => state.achievements);
  
  const categories: Array<{ id: AchievementCategory | 'all', label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'care', label: 'Care' },
    { id: 'growth', label: 'Growth' },
    { id: 'collection', label: 'Collection' },
    { id: 'happiness', label: 'Happiness' },
    { id: 'special', label: 'Special' },
  ];
  
  const filteredAchievements = activeCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);
  
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString();
  };
  
  return (
    <Container>
      <Card title="Achievements">
        <CategoryTabs>
          {categories.map((category) => (
            <CategoryTab
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </CategoryTab>
          ))}
        </CategoryTabs>
        
        <AchievementGrid>
          {filteredAchievements.map((achievement) => (
            <AchievementItem key={achievement.id} unlocked={achievement.unlocked}>
              <AchievementIcon>{achievement.icon}</AchievementIcon>
              <AchievementTitle>{achievement.title}</AchievementTitle>
              <AchievementDescription>{achievement.description}</AchievementDescription>
              
              {achievement.maxProgress && (
                <ProgressBar>
                  <ProgressFill 
                    progress={(achievement.progress || 0) / achievement.maxProgress * 100} 
                  />
                </ProgressBar>
              )}
              
              {achievement.unlocked && achievement.unlockedAt && (
                <UnlockedDate>Unlocked: {formatDate(achievement.unlockedAt)}</UnlockedDate>
              )}
            </AchievementItem>
          ))}
        </AchievementGrid>
      </Card>
    </Container>
  );
};

export default Achievements; 