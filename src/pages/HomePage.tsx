import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/UI/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 0;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 80px 0;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 16px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin-bottom: 32px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 64px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const FeatureIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CTASection = styled.section`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: 12px;
  padding: 48px;
  text-align: center;
  margin-bottom: 64px;
`;

const CTATitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 16px;
`;

const CTADescription = styled.p`
  color: white;
  max-width: 600px;
  margin: 0 auto 24px;
`;

const HomePage: React.FC = () => {
  return (
    <Container>
      <HeroSection>
        <Title>Welcome to Plant Palz</Title>
        <Subtitle>
          Grow, nurture, and connect with virtual plants that respond to your care.
          Experience the joy of gardening in a fun, interactive way!
        </Subtitle>
        <ButtonContainer>
          <Button as={Link} to="/game" variant="primary" size="large">
            Start Growing
          </Button>
          <Button as="a" href="#features" variant="secondary" size="large">
            Learn More
          </Button>
        </ButtonContainer>
        <img 
          src="/images/hero-plants.png" 
          alt="Plant Palz virtual garden" 
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
        />
      </HeroSection>
      
      <FeaturesSection id="features">
        <FeatureCard>
          <FeatureIcon>🌱</FeatureIcon>
          <FeatureTitle>Grow Your Garden</FeatureTitle>
          <FeatureDescription>
            Start with a seedling and watch it grow through different stages as you care for it.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>💧</FeatureIcon>
          <FeatureTitle>Interactive Care</FeatureTitle>
          <FeatureDescription>
            Water, fertilize, prune, and adjust sunlight to keep your plants happy and healthy.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>🌞</FeatureIcon>
          <FeatureTitle>Plant Personalities</FeatureTitle>
          <FeatureDescription>
            Each plant has a unique personality that affects how it responds to your care.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
      
      <CTASection>
        <CTATitle>Ready to start your virtual garden?</CTATitle>
        <CTADescription>
          Join thousands of plant enthusiasts who are growing and sharing their virtual gardens.
        </CTADescription>
        <Button as={Link} to="/game" variant="secondary" size="large">
          Start Growing Now
        </Button>
      </CTASection>
    </Container>
  );
};

export default HomePage; 