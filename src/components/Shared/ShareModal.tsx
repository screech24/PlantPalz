import React, { useState } from 'react';
import styled from 'styled-components';
import { getShareUrl, copyShareLink, shareToSocialMedia, captureScreenshot } from '../../utils/sharing';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { useGameStore } from '../../store/gameStore';

interface ShareModalProps {
  isOpen?: boolean;
  onClose: () => void;
  plantId: string;
}

const ShareGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const ShareOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
  }
`;

const ShareIcon = styled.div`
  font-size: 24px;
  color: #4CAF50;
`;

const ShareLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const SuccessMessage = styled.div`
  padding: 12px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  color: #388e3c;
  margin-top: 16px;
  text-align: center;
`;

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen = true, onClose, plantId }) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const getPlantById = useGameStore(state => state.getPlantById);
  
  const plant = getPlantById(plantId);
  
  if (!plant) return null;
  
  const shareUrl = getShareUrl(plant);
  
  const handleCopyLink = async () => {
    const success = await copyShareLink(plant);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };
  
  const handleShareTwitter = async () => {
    const success = await shareToSocialMedia(plant, 'twitter');
    if (success) {
      setShareSuccess('Opened Twitter sharing in a new window');
      setTimeout(() => setShareSuccess(null), 3000);
    }
  };
  
  const handleShareFacebook = async () => {
    const success = await shareToSocialMedia(plant, 'facebook');
    if (success) {
      setShareSuccess('Opened Facebook sharing in a new window');
      setTimeout(() => setShareSuccess(null), 3000);
    }
  };
  
  const handleScreenshot = async () => {
    const screenshot = await captureScreenshot();
    if (screenshot) {
      const link = document.createElement('a');
      link.href = screenshot;
      link.download = `${plant.name}-plant-palz.png`;
      link.click();
      setShareSuccess('Screenshot downloaded');
      setTimeout(() => setShareSuccess(null), 3000);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share ${plant.name}`}>
      <p>Share your plant with friends and family!</p>
      
      <ShareGrid>
        <ShareOption onClick={handleCopyLink}>
          <ShareIcon>📋</ShareIcon>
          <ShareLabel>Copy Link</ShareLabel>
        </ShareOption>
        
        <ShareOption onClick={handleShareTwitter}>
          <ShareIcon>🐦</ShareIcon>
          <ShareLabel>Twitter</ShareLabel>
        </ShareOption>
        
        <ShareOption onClick={handleShareFacebook}>
          <ShareIcon>👍</ShareIcon>
          <ShareLabel>Facebook</ShareLabel>
        </ShareOption>
        
        <ShareOption onClick={handleScreenshot}>
          <ShareIcon>📸</ShareIcon>
          <ShareLabel>Screenshot</ShareLabel>
        </ShareOption>
      </ShareGrid>
      
      <h3>Share Link</h3>
      <LinkContainer>
        <LinkInput value={shareUrl} readOnly onClick={(e) => e.currentTarget.select()} />
        <Button onClick={handleCopyLink} variant="primary" size="small">
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </LinkContainer>
      
      {shareSuccess && <SuccessMessage>{shareSuccess}</SuccessMessage>}
    </Modal>
  );
};

export default ShareModal; 