import React, { useState } from 'react';
import styled from 'styled-components';
import { PlantType } from '../../types';
import { useGameStore } from '../../store/gameStore';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

interface NewPlantFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
`;

const PlantTypeOption = styled.div<{ selected: boolean }>`
  padding: 12px;
  border: 2px solid ${({ selected }) => (selected ? '#4CAF50' : '#ddd')};
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    border-color: #4CAF50;
    background-color: ${({ selected }) => (selected ? 'rgba(76, 175, 80, 0.1)' : 'transparent')};
  }
`;

const PlantTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const NewPlantForm: React.FC<NewPlantFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<PlantType>('succulent');
  const addPlant = useGameStore((state) => state.addPlant);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === '') {
      alert('Please enter a name for your plant.');
      return;
    }
    
    addPlant(name, type);
    onClose();
    
    // Reset form
    setName('');
    setType('succulent');
  };
  
  const plantTypes: PlantType[] = ['succulent', 'cactus', 'fern', 'flowering'];
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Plant"
      maxWidth="600px"
    >
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Plant Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for your plant"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label>Plant Type</Label>
          <PlantTypeGrid>
            {plantTypes.map((plantType) => (
              <PlantTypeOption
                key={plantType}
                selected={type === plantType}
                onClick={() => setType(plantType)}
              >
                {plantType.charAt(0).toUpperCase() + plantType.slice(1)}
              </PlantTypeOption>
            ))}
          </PlantTypeGrid>
        </FormGroup>
        
        <Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Plant
          </Button>
        </Footer>
      </Form>
    </Modal>
  );
};

export default NewPlantForm; 