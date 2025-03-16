import * as THREE from 'three';
import { PlantType } from '../types';

// Base class for all plant models
export class PlantModel {
  group: THREE.Group;
  type: PlantType;
  growthStage: number;
  
  constructor(type: PlantType, growthStage: number = 0.1) {
    this.group = new THREE.Group();
    this.type = type;
    this.growthStage = growthStage;
    
    this.generate();
  }
  
  // Generate the plant model based on type and growth stage
  generate() {
    // Clear existing model
    while (this.group.children.length > 0) {
      const object = this.group.children[0];
      if ((object as THREE.Mesh).geometry) {
        (object as THREE.Mesh).geometry.dispose();
      }
      if ((object as THREE.Mesh).material) {
        const material = (object as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose());
        } else {
          material.dispose();
        }
      }
      this.group.remove(object);
    }
    
    // Generate new model
    switch (this.type) {
      case 'succulent':
        this.generateSucculent();
        break;
      case 'cactus':
        this.generateCactus();
        break;
      case 'fern':
        this.generateFern();
        break;
      case 'flowering':
        this.generateFlowering();
        break;
    }
  }
  
  // Update the growth stage and regenerate the model
  updateGrowth(growthStage: number) {
    this.growthStage = growthStage;
    this.generate();
  }
  
  // Generate a succulent plant
  private generateSucculent() {
    const stemHeight = 0.2 + this.growthStage * 0.3;
    const stemRadius = 0.3 + this.growthStage * 0.2;
    
    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(
      stemRadius, // top radius
      stemRadius * 0.8, // bottom radius
      stemHeight, // height
      8, // radial segments
      1, // height segments
      false // open ended
    );
    
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d8659,
      roughness: 0.8,
      metalness: 0.2
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = stemHeight / 2;
    this.group.add(stem);
    
    // Create leaves
    const leafCount = Math.floor(5 + this.growthStage * 15);
    
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const radius = stemRadius * 0.9;
      const leafSize = 0.15 + this.growthStage * 0.15;
      
      const leafGeometry = new THREE.SphereGeometry(
        leafSize,
        8,
        8,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
      );
      
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x3da370,
        roughness: 0.7,
        metalness: 0.1
      });
      
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      // Position and rotate leaf
      leaf.position.x = Math.cos(angle) * radius;
      leaf.position.z = Math.sin(angle) * radius;
      leaf.position.y = stemHeight * (0.8 + Math.random() * 0.2);
      
      leaf.rotation.x = Math.PI / 2 - 0.5;
      leaf.rotation.y = -angle;
      
      this.group.add(leaf);
    }
  }
  
  // Generate a cactus plant
  private generateCactus() {
    const stemHeight = 0.5 + this.growthStage * 1.5;
    const stemRadius = 0.2 + this.growthStage * 0.1;
    
    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(
      stemRadius, // top radius
      stemRadius * 1.2, // bottom radius
      stemHeight, // height
      8, // radial segments
      4, // height segments
      false // open ended
    );
    
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x4d8c57,
      roughness: 0.9,
      metalness: 0.1
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = stemHeight / 2;
    this.group.add(stem);
    
    // Add spikes
    const spikeCount = Math.floor(20 + this.growthStage * 30);
    
    for (let i = 0; i < spikeCount; i++) {
      const heightPercent = Math.random();
      const angle = Math.random() * Math.PI * 2;
      
      const spikeLength = 0.05 + this.growthStage * 0.05;
      const spikeGeometry = new THREE.CylinderGeometry(
        0.005, // top radius
        0.01, // bottom radius
        spikeLength, // height
        4, // radial segments
        1, // height segments
        false // open ended
      );
      
      const spikeMaterial = new THREE.MeshStandardMaterial({
        color: 0xd9d9d9,
        roughness: 0.5,
        metalness: 0.5
      });
      
      const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
      
      // Position spike
      const posY = stemHeight * heightPercent;
      spike.position.y = posY;
      spike.position.x = Math.cos(angle) * (stemRadius + spikeLength / 2);
      spike.position.z = Math.sin(angle) * (stemRadius + spikeLength / 2);
      
      // Rotate spike to point outward
      spike.rotation.z = Math.PI / 2;
      spike.rotation.y = -angle;
      
      this.group.add(spike);
    }
    
    // Add flower if growth stage is high enough
    if (this.growthStage > 0.7) {
      const flowerSize = 0.1 + (this.growthStage - 0.7) * 0.2;
      const flowerGeometry = new THREE.SphereGeometry(flowerSize, 8, 8);
      const flowerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff69b4, // Pink
        roughness: 0.7,
        metalness: 0.1
      });
      
      const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
      flower.position.y = stemHeight + flowerSize * 0.5;
      this.group.add(flower);
    }
  }
  
  // Generate a fern plant
  private generateFern() {
    const stemHeight = 0.2 + this.growthStage * 0.3;
    
    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(
      0.05, // top radius
      0.08, // bottom radius
      stemHeight, // height
      8, // radial segments
      1, // height segments
      false // open ended
    );
    
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c4033, // Brown
      roughness: 0.9,
      metalness: 0.1
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = stemHeight / 2;
    this.group.add(stem);
    
    // Create leaves
    const leafCount = Math.floor(3 + this.growthStage * 12);
    
    for (let i = 0; i < leafCount; i++) {
      this.createFernLeaf(i, leafCount);
    }
  }
  
  // Helper method to create a fern leaf
  private createFernLeaf(index: number, totalLeaves: number) {
    const angle = (index / totalLeaves) * Math.PI * 2;
    const leafLength = 0.5 + this.growthStage * 1.0;
    const leafWidth = 0.2 + this.growthStage * 0.2;
    
    // Create leaf stem
    const leafStemGeometry = new THREE.CylinderGeometry(
      0.01, // top radius
      0.02, // bottom radius
      leafLength, // height
      4, // radial segments
      1, // height segments
      false // open ended
    );
    
    const leafStemMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5c33, // Dark green
      roughness: 0.8,
      metalness: 0.1
    });
    
    const leafStem = new THREE.Mesh(leafStemGeometry, leafStemMaterial);
    
    // Position and rotate leaf stem
    leafStem.position.y = leafLength / 2 + 0.2;
    leafStem.rotation.x = Math.PI / 4 + Math.random() * 0.5;
    leafStem.rotation.y = angle;
    
    // Create leaf fronds
    const frondCount = Math.floor(5 + this.growthStage * 10);
    const frondGroup = new THREE.Group();
    
    for (let i = 0; i < frondCount; i++) {
      const frondPercent = i / frondCount;
      const frondSize = leafWidth * (1 - Math.abs(frondPercent - 0.5) * 2);
      
      const frondGeometry = new THREE.PlaneGeometry(frondSize, frondSize * 0.5);
      const frondMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a9d23, // Green
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      
      const frond = new THREE.Mesh(frondGeometry, frondMaterial);
      
      // Position frond along leaf stem
      frond.position.y = leafLength * frondPercent - leafLength / 2;
      frond.position.x = frondSize / 2;
      
      // Alternate fronds on each side
      if (i % 2 === 0) {
        frond.position.x *= -1;
        frond.rotation.y = Math.PI;
      }
      
      frondGroup.add(frond);
    }
    
    leafStem.add(frondGroup);
    this.group.add(leafStem);
  }
  
  // Generate a flowering plant
  private generateFlowering() {
    const stemHeight = 0.5 + this.growthStage * 1.5;
    
    // Create main stem
    const stemGeometry = new THREE.CylinderGeometry(
      0.03, // top radius
      0.05, // bottom radius
      stemHeight, // height
      8, // radial segments
      2, // height segments
      false // open ended
    );
    
    const stemMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d5c33, // Dark green
      roughness: 0.8,
      metalness: 0.1
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = stemHeight / 2;
    this.group.add(stem);
    
    // Create leaves
    const leafCount = Math.floor(4 + this.growthStage * 8);
    
    for (let i = 0; i < leafCount; i++) {
      const leafHeight = (i / leafCount) * stemHeight;
      const angle = (i / leafCount) * Math.PI * 4; // Spiral arrangement
      
      const leafSize = 0.2 + this.growthStage * 0.2;
      const leafGeometry = new THREE.PlaneGeometry(leafSize, leafSize * 0.6);
      const leafMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a9d23, // Green
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      // Position leaf
      leaf.position.y = leafHeight;
      leaf.position.x = Math.cos(angle) * 0.15;
      leaf.position.z = Math.sin(angle) * 0.15;
      
      // Rotate leaf
      leaf.rotation.y = -angle;
      leaf.rotation.x = Math.PI / 6;
      
      this.group.add(leaf);
    }
    
    // Add flowers if growth stage is high enough
    if (this.growthStage > 0.5) {
      const flowerCount = Math.floor(1 + (this.growthStage - 0.5) * 6);
      
      for (let i = 0; i < flowerCount; i++) {
        const flowerSize = 0.1 + (this.growthStage - 0.5) * 0.2;
        
        // Create flower center
        const centerGeometry = new THREE.SphereGeometry(flowerSize * 0.3, 8, 8);
        const centerMaterial = new THREE.MeshStandardMaterial({
          color: 0xffff00, // Yellow
          roughness: 0.7,
          metalness: 0.1
        });
        
        const flowerCenter = new THREE.Mesh(centerGeometry, centerMaterial);
        
        // Create flower petals
        const petalCount = 5 + Math.floor(Math.random() * 3);
        const flowerGroup = new THREE.Group();
        flowerGroup.add(flowerCenter);
        
        // Random flower color
        const colors = [0xff69b4, 0xff6347, 0x9370db, 0x4169e1, 0xffa500];
        const flowerColor = colors[Math.floor(Math.random() * colors.length)];
        
        for (let j = 0; j < petalCount; j++) {
          const petalAngle = (j / petalCount) * Math.PI * 2;
          
          const petalGeometry = new THREE.PlaneGeometry(
            flowerSize * 0.7,
            flowerSize * 0.4
          );
          const petalMaterial = new THREE.MeshStandardMaterial({
            color: flowerColor,
            roughness: 0.7,
            metalness: 0.1,
            side: THREE.DoubleSide
          });
          
          const petal = new THREE.Mesh(petalGeometry, petalMaterial);
          
          // Position petal
          petal.position.x = Math.cos(petalAngle) * flowerSize * 0.5;
          petal.position.z = Math.sin(petalAngle) * flowerSize * 0.5;
          
          // Rotate petal
          petal.rotation.y = -petalAngle;
          petal.rotation.x = Math.PI / 6;
          
          flowerGroup.add(petal);
        }
        
        // Position flower group
        const flowerHeight = stemHeight * 0.7 + i * (stemHeight * 0.3 / flowerCount);
        flowerGroup.position.y = flowerHeight;
        
        // Random offset from center
        const offset = 0.1 + Math.random() * 0.1;
        const offsetAngle = Math.random() * Math.PI * 2;
        flowerGroup.position.x = Math.cos(offsetAngle) * offset;
        flowerGroup.position.z = Math.sin(offsetAngle) * offset;
        
        this.group.add(flowerGroup);
      }
    }
  }
}

// Factory function to create a plant model
export const createPlantModel = (type: PlantType, growthStage: number = 0.1): PlantModel => {
  return new PlantModel(type, growthStage);
}; 