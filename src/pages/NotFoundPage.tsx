import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/UI/Button';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  line-height: 1;
`;

const Title = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 16px;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 32px;
  max-width: 500px;
`;

const PlantIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <PlantIcon>🌵</PlantIcon>
      <ErrorCode>404</ErrorCode>
      <Title>Page Not Found</Title>
      <Description>
        Oops! It looks like you've wandered into the desert. The page you're looking for doesn't exist or has been moved.
      </Description>
      <ButtonGroup>
        <Button as={Link} to="/" variant="primary">
          Go Home
        </Button>
        <Button as={Link} to="/game" variant="secondary">
          My Garden
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default NotFoundPage; 