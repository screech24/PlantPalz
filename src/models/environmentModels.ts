import * as THREE from 'three';

// Environment model class for the garden scene
export class EnvironmentModel {
  group: THREE.Group;
  room: THREE.Group;
  window: THREE.Group;
  curtains: THREE.Group;
  shelf: THREE.Group;
  growLight: THREE.Group;
  
  // State
  isCurtainsOpen: boolean;
  isGrowLightOn: boolean;
  isDaytime: boolean;
  
  constructor() {
    this.group = new THREE.Group();
    this.room = new THREE.Group();
    this.window = new THREE.Group();
    this.curtains = new THREE.Group();
    this.shelf = new THREE.Group();
    this.growLight = new THREE.Group();
    
    this.isCurtainsOpen = true;
    this.isGrowLightOn = false;
    this.isDaytime = true;
    
    this.generate();
  }
  
  // Generate the environment model
  generate() {
    this.generateRoom();
    this.generateWindow();
    this.generateCurtains();
    this.generateShelf();
    this.generateGrowLight();
    
    // Add all elements to the main group
    this.group.add(this.room);
    this.group.add(this.window);
    this.group.add(this.curtains);
    this.group.add(this.shelf);
    this.group.add(this.growLight);
  }
  
  // Generate the room (walls, floor, ceiling)
  private generateRoom() {
    // Clear existing model
    while (this.room.children.length > 0) {
      const object = this.room.children[0];
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
      this.room.remove(object);
    }
    
    // Room dimensions
    const roomWidth = 20;
    const roomDepth = 15;
    const roomHeight = 10;
    const wallThickness = 0.2;
    
    // Floor
    const floorGeometry = new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xD2B48C, // Tan color for wooden floor
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -wallThickness / 2;
    floor.receiveShadow = true;
    this.room.add(floor);
    
    // Back wall (with window)
    const backWallGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, wallThickness);
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xF5F5F5, // Off-white color for walls
      roughness: 0.9,
      metalness: 0.1
    });
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.z = -roomDepth / 2;
    backWall.position.y = roomHeight / 2;
    backWall.receiveShadow = true;
    this.room.add(backWall);
    
    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -roomWidth / 2;
    leftWall.position.y = roomHeight / 2;
    leftWall.receiveShadow = true;
    this.room.add(leftWall);
    
    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(wallThickness, roomHeight, roomDepth);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.x = roomWidth / 2;
    rightWall.position.y = roomHeight / 2;
    rightWall.receiveShadow = true;
    this.room.add(rightWall);
    
    // Ceiling
    const ceilingGeometry = new THREE.BoxGeometry(roomWidth, wallThickness, roomDepth);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, // White ceiling
      roughness: 0.9,
      metalness: 0.1
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.position.y = roomHeight;
    ceiling.receiveShadow = true;
    this.room.add(ceiling);
  }
  
  // Generate the window
  private generateWindow() {
    // Clear existing model
    while (this.window.children.length > 0) {
      const object = this.window.children[0];
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
      this.window.remove(object);
    }
    
    // Window dimensions
    const windowWidth = 8;
    const windowHeight = 6;
    const windowDepth = 0.1;
    const frameWidth = 0.3;
    
    // Window frame
    const frameGeometry = new THREE.BoxGeometry(windowWidth + frameWidth * 2, windowHeight + frameWidth * 2, windowDepth);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, // White frame
      roughness: 0.9,
      metalness: 0.1
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -7.4; // Slightly in front of back wall
    frame.position.y = 5; // Middle of the wall
    this.window.add(frame);
    
    // Window glass
    const glassGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth / 2);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xADD8E6, // Light blue tint
      roughness: 0,
      metalness: 0.1,
      transparent: true,
      opacity: 0.3,
      transmission: 0.9,
      clearcoat: 1.0
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.z = -7.35; // Slightly in front of frame
    glass.position.y = 5; // Middle of the wall
    this.window.add(glass);
    
    // Window dividers
    const dividerHorizontalGeometry = new THREE.BoxGeometry(windowWidth, frameWidth / 2, windowDepth);
    const dividerHorizontal = new THREE.Mesh(dividerHorizontalGeometry, frameMaterial);
    dividerHorizontal.position.z = -7.3; // Slightly in front of glass
    dividerHorizontal.position.y = 5; // Middle of the window
    this.window.add(dividerHorizontal);
    
    const dividerVerticalGeometry = new THREE.BoxGeometry(frameWidth / 2, windowHeight, windowDepth);
    const dividerVertical = new THREE.Mesh(dividerVerticalGeometry, frameMaterial);
    dividerVertical.position.z = -7.3; // Slightly in front of glass
    dividerVertical.position.y = 5; // Middle of the window
    this.window.add(dividerVertical);
    
    // Add sunlight from window
    const sunlight = new THREE.DirectionalLight(0xFFFFFF, this.isDaytime ? 1.0 : 0.0);
    sunlight.position.set(0, 5, -10);
    sunlight.target.position.set(0, 0, 0);
    sunlight.castShadow = true;
    
    // Configure shadow properties
    sunlight.shadow.mapSize.width = 2048;
    sunlight.shadow.mapSize.height = 2048;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 50;
    sunlight.shadow.camera.left = -10;
    sunlight.shadow.camera.right = 10;
    sunlight.shadow.camera.top = 10;
    sunlight.shadow.camera.bottom = -10;
    
    this.window.add(sunlight);
    this.window.add(sunlight.target);
  }
  
  // Generate the curtains
  private generateCurtains() {
    // Clear existing model
    while (this.curtains.children.length > 0) {
      const object = this.curtains.children[0];
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
      this.curtains.remove(object);
    }
    
    // Curtain dimensions
    const curtainWidth = 4.5;
    const curtainHeight = 7;
    
    // Curtain material
    const curtainMaterial = new THREE.MeshStandardMaterial({
      color: 0x6A5ACD, // Slate blue
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    
    // Left curtain
    const leftCurtainGeometry = new THREE.PlaneGeometry(curtainWidth, curtainHeight);
    const leftCurtain = new THREE.Mesh(leftCurtainGeometry, curtainMaterial);
    leftCurtain.position.set(-4 + (this.isCurtainsOpen ? -2 : 0), 5, -7.2);
    leftCurtain.rotation.y = this.isCurtainsOpen ? Math.PI / 6 : 0;
    this.curtains.add(leftCurtain);
    
    // Right curtain
    const rightCurtainGeometry = new THREE.PlaneGeometry(curtainWidth, curtainHeight);
    const rightCurtain = new THREE.Mesh(rightCurtainGeometry, curtainMaterial);
    rightCurtain.position.set(4 + (this.isCurtainsOpen ? 2 : 0), 5, -7.2);
    rightCurtain.rotation.y = this.isCurtainsOpen ? -Math.PI / 6 : 0;
    this.curtains.add(rightCurtain);
    
    // Curtain rod
    const rodGeometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 16);
    const rodMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // Saddle brown
      roughness: 0.7,
      metalness: 0.3
    });
    const rod = new THREE.Mesh(rodGeometry, rodMaterial);
    rod.position.set(0, 8.5, -7.2);
    rod.rotation.z = Math.PI / 2;
    this.curtains.add(rod);
    
    // Rod ends (finials)
    const finialGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const leftFinial = new THREE.Mesh(finialGeometry, rodMaterial);
    leftFinial.position.set(-5, 8.5, -7.2);
    this.curtains.add(leftFinial);
    
    const rightFinial = new THREE.Mesh(finialGeometry, rodMaterial);
    rightFinial.position.set(5, 8.5, -7.2);
    this.curtains.add(rightFinial);
  }
  
  // Generate the shelf
  private generateShelf() {
    // Clear existing model
    while (this.shelf.children.length > 0) {
      const object = this.shelf.children[0];
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
      this.shelf.remove(object);
    }
    
    // Shelf dimensions
    const shelfWidth = 12;
    const shelfDepth = 2;
    const shelfThickness = 0.2;
    const shelfHeight = 1;
    const numShelves = 4;
    
    // Shelf material
    const shelfMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // Saddle brown for wooden shelf
      roughness: 0.8,
      metalness: 0.2
    });
    
    // Create shelves
    for (let i = 0; i < numShelves; i++) {
      const shelfGeometry = new THREE.BoxGeometry(shelfWidth, shelfThickness, shelfDepth);
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(0, i * shelfHeight + 1, -6);
      shelf.receiveShadow = true;
      shelf.castShadow = true;
      this.shelf.add(shelf);
    }
    
    // Create vertical supports
    const supportGeometry = new THREE.BoxGeometry(shelfThickness, numShelves * shelfHeight, shelfDepth);
    const leftSupport = new THREE.Mesh(supportGeometry, shelfMaterial);
    leftSupport.position.set(-shelfWidth / 2 + shelfThickness / 2, (numShelves * shelfHeight) / 2, -6);
    leftSupport.receiveShadow = true;
    leftSupport.castShadow = true;
    this.shelf.add(leftSupport);
    
    const rightSupport = new THREE.Mesh(supportGeometry, shelfMaterial);
    rightSupport.position.set(shelfWidth / 2 - shelfThickness / 2, (numShelves * shelfHeight) / 2, -6);
    rightSupport.receiveShadow = true;
    rightSupport.castShadow = true;
    this.shelf.add(rightSupport);
    
    const middleSupport = new THREE.Mesh(supportGeometry, shelfMaterial);
    middleSupport.position.set(0, (numShelves * shelfHeight) / 2, -6);
    middleSupport.receiveShadow = true;
    middleSupport.castShadow = true;
    this.shelf.add(middleSupport);
    
    // Create back panel
    const backPanelGeometry = new THREE.BoxGeometry(shelfWidth, numShelves * shelfHeight, shelfThickness);
    const backPanelMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // Slightly lighter than the shelf
      roughness: 0.8,
      metalness: 0.2
    });
    const backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial);
    backPanel.position.set(0, (numShelves * shelfHeight) / 2, -6 - shelfDepth / 2 + shelfThickness / 2);
    backPanel.receiveShadow = true;
    backPanel.castShadow = true;
    this.shelf.add(backPanel);
  }
  
  // Generate the grow light
  private generateGrowLight() {
    // Clear existing model
    while (this.growLight.children.length > 0) {
      const object = this.growLight.children[0];
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
      this.growLight.remove(object);
    }
    
    // Light fixture dimensions
    const fixtureWidth = 10;
    const fixtureDepth = 1;
    const fixtureHeight = 0.2;
    
    // Light fixture
    const fixtureGeometry = new THREE.BoxGeometry(fixtureWidth, fixtureHeight, fixtureDepth);
    const fixtureMaterial = new THREE.MeshStandardMaterial({
      color: 0x303030, // Dark gray
      roughness: 0.7,
      metalness: 0.5
    });
    const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
    fixture.position.set(0, 5, -5.5);
    fixture.castShadow = true;
    this.growLight.add(fixture);
    
    // Light bulbs
    const bulbGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const bulbMaterial = new THREE.MeshStandardMaterial({
      color: this.isGrowLightOn ? 0xFFFFFF : 0xCCCCCC,
      roughness: 0.4,
      metalness: 0.8,
      emissive: this.isGrowLightOn ? 0xFFFFFF : 0x000000,
      emissiveIntensity: this.isGrowLightOn ? 1.0 : 0.0
    });
    
    // Create multiple bulbs along the fixture
    for (let i = -4; i <= 4; i += 2) {
      const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
      bulb.position.set(i, 4.8, -5.5);
      bulb.rotation.x = Math.PI / 2;
      this.growLight.add(bulb);
    }
    
    // Add grow light illumination
    const growLightIllumination = new THREE.SpotLight(
      0xFFFFFF, 
      this.isGrowLightOn ? 1.0 : 0.0,
      10,
      Math.PI / 4,
      0.5,
      2
    );
    growLightIllumination.position.set(0, 4.8, -5.5);
    growLightIllumination.target.position.set(0, 0, -5.5);
    growLightIllumination.castShadow = true;
    
    // Configure shadow properties
    growLightIllumination.shadow.mapSize.width = 1024;
    growLightIllumination.shadow.mapSize.height = 1024;
    growLightIllumination.shadow.camera.near = 0.5;
    growLightIllumination.shadow.camera.far = 10;
    
    this.growLight.add(growLightIllumination);
    this.growLight.add(growLightIllumination.target);
    
    // Add hanging wires
    const wireGeometry = new THREE.CylinderGeometry(0.02, 0.02, 4.2, 8);
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000, // Black wire
      roughness: 0.9,
      metalness: 0.1
    });
    
    // Create wires at each end of the fixture
    const leftWire = new THREE.Mesh(wireGeometry, wireMaterial);
    leftWire.position.set(-fixtureWidth / 2 + 0.5, 7.1, -5.5);
    this.growLight.add(leftWire);
    
    const rightWire = new THREE.Mesh(wireGeometry, wireMaterial);
    rightWire.position.set(fixtureWidth / 2 - 0.5, 7.1, -5.5);
    this.growLight.add(rightWire);
  }
  
  // Toggle curtains open/closed
  toggleCurtains() {
    this.isCurtainsOpen = !this.isCurtainsOpen;
    this.updateCurtains();
  }
  
  // Update curtains position based on state
  updateCurtains() {
    // Find the left and right curtains
    const leftCurtain = this.curtains.children.find(
      child => child instanceof THREE.Mesh && 
      child.position.x < 0 && 
      child.geometry instanceof THREE.PlaneGeometry
    ) as THREE.Mesh;
    
    const rightCurtain = this.curtains.children.find(
      child => child instanceof THREE.Mesh && 
      child.position.x > 0 && 
      child.geometry instanceof THREE.PlaneGeometry
    ) as THREE.Mesh;
    
    if (leftCurtain && rightCurtain) {
      // Update positions and rotations
      leftCurtain.position.x = -4 + (this.isCurtainsOpen ? -2 : 0);
      leftCurtain.rotation.y = this.isCurtainsOpen ? Math.PI / 6 : 0;
      
      rightCurtain.position.x = 4 + (this.isCurtainsOpen ? 2 : 0);
      rightCurtain.rotation.y = this.isCurtainsOpen ? -Math.PI / 6 : 0;
    }
    
    // Update sunlight intensity based on curtain state and time of day
    const sunlight = this.window.children.find(
      child => child instanceof THREE.DirectionalLight
    ) as THREE.DirectionalLight;
    
    if (sunlight) {
      sunlight.intensity = this.isDaytime ? (this.isCurtainsOpen ? 1.0 : 0.3) : 0.0;
    }
  }
  
  // Toggle grow light on/off
  toggleGrowLight() {
    this.isGrowLightOn = !this.isGrowLightOn;
    this.updateGrowLight();
  }
  
  // Update grow light based on state
  updateGrowLight() {
    // Update bulb materials
    const bulbs = this.growLight.children.filter(
      child => child instanceof THREE.Mesh && 
      child.geometry instanceof THREE.CylinderGeometry &&
      child.position.y < 5
    ) as THREE.Mesh[];
    
    bulbs.forEach(bulb => {
      const material = bulb.material as THREE.MeshStandardMaterial;
      material.emissive.set(this.isGrowLightOn ? 0xFFFFFF : 0x000000);
      material.emissiveIntensity = this.isGrowLightOn ? 1.0 : 0.0;
      material.color.set(this.isGrowLightOn ? 0xFFFFFF : 0xCCCCCC);
    });
    
    // Update grow light illumination
    const growLight = this.growLight.children.find(
      child => child instanceof THREE.SpotLight
    ) as THREE.SpotLight;
    
    if (growLight) {
      growLight.intensity = this.isGrowLightOn ? 1.0 : 0.0;
    }
  }
  
  // Set time of day (day/night)
  setTimeOfDay(isDaytime: boolean) {
    this.isDaytime = isDaytime;
    this.updateCurtains(); // This will update the sunlight intensity
  }
}

// Create an environment model
export const createEnvironmentModel = (): EnvironmentModel => {
  return new EnvironmentModel();
}; 