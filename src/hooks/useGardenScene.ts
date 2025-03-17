import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Plant } from '../types';
import { getColorValue, PotColor } from '../models/potModels';

export const useGardenScene = (
  plants: Plant[],
  activePlantId: string | null,
  onSelectPlant: (plantId: string | null) => void
) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const plantsRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const roomModelRef = useRef<THREE.Object3D | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const frameIdRef = useRef<number | null>(null);

  // Initialize the scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Store a reference to the current canvas element to use in cleanup
    const canvas = canvasRef.current;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45, // Field of view (reduced for better plant visibility)
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 8); // Adjusted position for better plant visibility
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvas.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3; // Closer minimum distance
    controls.maxDistance = 15; // Farther maximum distance
    controls.maxPolarAngle = Math.PI / 2;
    controls.target.set(0, 2, 0); // Focus on the center of the scene
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Increased intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Create a simple room environment instead of loading an external model
    createSimpleRoom(scene);

    // Handle window resize
    const handleResize = () => {
      if (!canvas || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    // Initial resize to ensure correct sizing
    handleResize();

    // Handle mouse click for plant selection
    const handleMouseClick = (event: MouseEvent) => {
      if (!canvas || !cameraRef.current || !sceneRef.current) return;
      
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / canvas.clientHeight) * 2 + 1;
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      const plantObjects = Array.from(plantsRef.current.values());
      const intersects = raycasterRef.current.intersectObjects(plantObjects, true);
      
      if (intersects.length > 0) {
        let selectedPlantId: string | null = null;
        
        // Find the plant ID from the intersected object
        for (const [id, obj] of plantsRef.current.entries()) {
          if (obj === intersects[0].object || obj.getObjectById(intersects[0].object.id)) {
            selectedPlantId = id;
            break;
          }
        }
        
        onSelectPlant(selectedPlantId);
      } else {
        onSelectPlant(null);
      }
    };

    canvas.addEventListener('click', handleMouseClick);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();

    // Create a copy of the plants map for cleanup
    const plantsMap = plantsRef.current;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('click', handleMouseClick);
        if (rendererRef.current) {
          canvas.removeChild(rendererRef.current.domElement);
        }
      }
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      plantsMap.clear();
    };
  }, [onSelectPlant]);

  // Function to create a simple room environment
  const createSimpleRoom = (scene: THREE.Scene) => {
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xeeeeee,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create back wall
    const wallGeometry = new THREE.PlaneGeometry(20, 10);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xf5f5f5,
      roughness: 0.9,
      metalness: 0.1
    });
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.z = -5;
    backWall.position.y = 5;
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    // Create side walls
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.position.x = -10;
    leftWall.position.y = 5;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.position.x = 10;
    rightWall.position.y = 5;
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    
    // Create a simple shelf
    const shelfGeometry = new THREE.BoxGeometry(12, 0.2, 3);
    const shelfMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.7,
      metalness: 0.2
    });
    const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
    shelf.position.set(0, 1.5, -3);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    scene.add(shelf);
    
    // Create shelf supports
    const supportGeometry = new THREE.BoxGeometry(0.2, 1.5, 3);
    const support1 = new THREE.Mesh(supportGeometry, shelfMaterial);
    support1.position.set(-5.9, 0.75, -3);
    support1.castShadow = true;
    support1.receiveShadow = true;
    scene.add(support1);
    
    const support2 = new THREE.Mesh(supportGeometry, shelfMaterial);
    support2.position.set(5.9, 0.75, -3);
    support2.castShadow = true;
    support2.receiveShadow = true;
    scene.add(support2);
    
    // Create a simple window
    const windowFrameGeometry = new THREE.BoxGeometry(4, 4, 0.2);
    const windowFrameMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.3
    });
    const windowFrame = new THREE.Mesh(windowFrameGeometry, windowFrameMaterial);
    windowFrame.position.set(0, 5, -4.9);
    windowFrame.castShadow = true;
    scene.add(windowFrame);
    
    const windowGlassGeometry = new THREE.PlaneGeometry(3.6, 3.6);
    const windowGlassMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x88ccff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.9
    });
    const windowGlass = new THREE.Mesh(windowGlassGeometry, windowGlassMaterial);
    windowGlass.position.set(0, 5, -4.8);
    scene.add(windowGlass);
    
    // Store the room model reference
    const roomGroup = new THREE.Group();
    roomGroup.add(floor, backWall, leftWall, rightWall, shelf, support1, support2, windowFrame, windowGlass);
    roomModelRef.current = roomGroup;
  };

  // Update plants in the scene
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const scene = sceneRef.current;
    const currentPlantIds = new Set(plants.map(plant => plant.id));
    
    // Remove plants that are no longer in the list
    for (const [id, obj] of plantsRef.current.entries()) {
      if (!currentPlantIds.has(id)) {
        scene.remove(obj);
        plantsRef.current.delete(id);
      }
    }
    
    // Add or update plants
    plants.forEach((plant, index) => {
      // Calculate position based on index
      // Arrange plants in a grid with 3 plants per shelf for better visibility
      const plantsPerShelf = 3;
      const shelfIndex = Math.floor(index / plantsPerShelf);
      const positionOnShelf = index % plantsPerShelf;
      
      // Calculate x position with more spacing between plants
      const xSpacing = 1.5; // Increased spacing
      const xOffset = (plantsPerShelf - 1) * xSpacing / 2;
      const x = positionOnShelf * xSpacing - xOffset;
      
      // Calculate y position (height) based on shelf
      const y = 1.5 + shelfIndex * 1.2;
      
      // Position plants slightly forward for better visibility
      const z = -1.5 + shelfIndex * 0.5;
      
      // If the plant already exists in the scene, just update its position
      if (plantsRef.current.has(plant.id)) {
        const plantObj = plantsRef.current.get(plant.id)!;
        plantObj.position.set(x, y, z);
        
        // Highlight the active plant
        if (plant.id === activePlantId) {
          // Scale up the active plant slightly
          plantObj.scale.set(1.1, 1.1, 1.1);
          
          // Find the pot material and make it more emissive
          plantObj.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const material = child.material as THREE.MeshStandardMaterial;
              if (material.name === 'pot') {
                material.emissive.set(0x333333);
                material.emissiveIntensity = 0.5;
              }
            }
          });
        } else {
          // Reset scale and emissive for non-active plants
          plantObj.scale.set(1, 1, 1);
          
          plantObj.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              const material = child.material as THREE.MeshStandardMaterial;
              if (material.name === 'pot') {
                material.emissive.set(0x000000);
                material.emissiveIntensity = 0;
              }
            }
          });
        }
        return;
      }
      
      // Create a new plant object
      createPlantObject(plant, x, y, z, scene);
    });
  }, [plants, activePlantId]);

  // Function to create a plant object
  const createPlantObject = (plant: Plant, x: number, y: number, z: number, scene: THREE.Scene) => {
    // Create a group for the plant
    const plantGroup = new THREE.Group();
    plantGroup.position.set(x, y, z);
    
    // Create pot
    const potGeometry = getPotGeometry(plant.potType);
    const potColor = getColorValue(plant.potColor);
    const potMaterial = new THREE.MeshStandardMaterial({ 
      color: new THREE.Color(potColor),
      roughness: 0.7,
      metalness: 0.1,
      name: 'pot'
    });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.castShadow = true;
    pot.receiveShadow = true;
    pot.position.y = -0.15; // Slightly lower to sit on the shelf
    plantGroup.add(pot);
    
    // Create soil
    const soilGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
    const soilMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3E2723,
      roughness: 1.0,
      metalness: 0.0
    });
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = 0.05;
    plantGroup.add(soil);
    
    // Create plant stem and leaves based on plant type and growth stage
    createPlantStemAndLeaves(plant, plantGroup);
    
    // Add the plant to the scene and store it in the map
    scene.add(plantGroup);
    plantsRef.current.set(plant.id, plantGroup);
  };

  // Function to get pot geometry based on pot type
  const getPotGeometry = (potType: string): THREE.BufferGeometry => {
    switch (potType) {
      case 'round':
        return new THREE.CylinderGeometry(0.2, 0.25, 0.3, 32);
      case 'square':
        return new THREE.BoxGeometry(0.4, 0.3, 0.4);
      case 'hexagonal':
        return new THREE.CylinderGeometry(0.2, 0.25, 0.3, 6);
      case 'decorative':
        // A more complex pot with ridges
        const decorativePot = new THREE.Group();
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.22, 0.25, 0.25, 32),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        );
        const top = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.22, 0.1, 32),
          new THREE.MeshStandardMaterial({ color: 0x000000 })
        );
        top.position.y = 0.15;
        decorativePot.add(base, top);
        return new THREE.CylinderGeometry(0.2, 0.25, 0.3, 32);
      default: // 'basic'
        return new THREE.CylinderGeometry(0.2, 0.25, 0.3, 32);
    }
  };

  // Function to create plant stem and leaves
  const createPlantStemAndLeaves = (plant: Plant, plantGroup: THREE.Group) => {
    const growthFactor = plant.growthStage;
    
    // Create stem
    const stemHeight = 0.1 + growthFactor * 0.5;
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.03, stemHeight, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2E7D32,
      roughness: 0.8,
      metalness: 0.1
    });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.1 + stemHeight / 2;
    stem.castShadow = true;
    plantGroup.add(stem);
    
    // Create leaves based on plant type
    switch (plant.type.toLowerCase()) {
      case 'succulent':
        createSucculentLeaves(plant, plantGroup, stemHeight);
        break;
      case 'cactus':
        createCactusSpikes(plant, plantGroup, stemHeight);
        break;
      case 'fern':
        createFernLeaves(plant, plantGroup, stemHeight);
        break;
      case 'flower':
        createFlowerPetals(plant, plantGroup, stemHeight);
        break;
      default:
        createGenericLeaves(plant, plantGroup, stemHeight);
        break;
    }
  };

  // Function to create succulent leaves
  const createSucculentLeaves = (plant: Plant, plantGroup: THREE.Group, stemHeight: number) => {
    const leafCount = Math.max(3, Math.floor(plant.growthStage * 12));
    const leafSize = 0.1 + plant.growthStage * 0.1;
    
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const radius = 0.05 + plant.growthStage * 0.1;
      
      const leafGeometry = new THREE.SphereGeometry(leafSize, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x66BB6A,
        roughness: 0.7,
        metalness: 0.1
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      leaf.position.x = Math.cos(angle) * radius;
      leaf.position.z = Math.sin(angle) * radius;
      leaf.position.y = 0.1 + stemHeight;
      
      leaf.rotation.x = Math.PI / 2;
      leaf.rotation.z = angle;
      
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }
  };

  // Function to create cactus spikes
  const createCactusSpikes = (plant: Plant, plantGroup: THREE.Group, stemHeight: number) => {
    // Override the stem with a cactus body
    plantGroup.remove(plantGroup.children[plantGroup.children.length - 1]); // Remove the default stem
    
    const cactusHeight = 0.2 + plant.growthStage * 0.4;
    const cactusGeometry = new THREE.CylinderGeometry(0.1, 0.12, cactusHeight, 8);
    const cactusMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2E7D32,
      roughness: 0.9,
      metalness: 0.0
    });
    const cactus = new THREE.Mesh(cactusGeometry, cactusMaterial);
    cactus.position.y = 0.1 + cactusHeight / 2;
    cactus.castShadow = true;
    plantGroup.add(cactus);
    
    // Add spikes
    const spikeCount = Math.max(5, Math.floor(plant.growthStage * 20));
    
    for (let i = 0; i < spikeCount; i++) {
      const heightPercent = Math.random();
      const angle = Math.random() * Math.PI * 2;
      
      const spikeGeometry = new THREE.CylinderGeometry(0.002, 0.001, 0.05, 4);
      const spikeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xE0E0E0,
        roughness: 0.5,
        metalness: 0.5
      });
      const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);
      
      spike.position.y = 0.1 + heightPercent * cactusHeight;
      spike.position.x = Math.cos(angle) * 0.1;
      spike.position.z = Math.sin(angle) * 0.1;
      
      spike.rotation.x = Math.PI / 2;
      spike.rotation.z = angle;
      
      spike.castShadow = true;
      plantGroup.add(spike);
    }
  };

  // Function to create fern leaves
  const createFernLeaves = (plant: Plant, plantGroup: THREE.Group, stemHeight: number) => {
    const leafCount = Math.max(2, Math.floor(plant.growthStage * 8));
    
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const leafLength = 0.2 + plant.growthStage * 0.3;
      
      const leafGeometry = new THREE.PlaneGeometry(leafLength, 0.05);
      const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x388E3C,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      leaf.position.y = 0.1 + stemHeight;
      leaf.rotation.z = angle;
      leaf.rotation.x = Math.PI / 4;
      
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }
  };

  // Function to create flower petals
  const createFlowerPetals = (plant: Plant, plantGroup: THREE.Group, stemHeight: number) => {
    // Only add flower if growth stage is sufficient
    if (plant.growthStage > 0.5) {
      const petalCount = 5;
      const flowerSize = 0.1 + (plant.growthStage - 0.5) * 0.2;
      
      // Create flower center
      const centerGeometry = new THREE.SphereGeometry(flowerSize * 0.3, 8, 8);
      const centerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFD54F,
        roughness: 0.7,
        metalness: 0.3
      });
      const center = new THREE.Mesh(centerGeometry, centerMaterial);
      center.position.y = 0.1 + stemHeight + 0.05;
      center.castShadow = true;
      plantGroup.add(center);
      
      // Create petals
      for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        
        const petalGeometry = new THREE.CircleGeometry(flowerSize, 8);
        const petalMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xE91E63,
          roughness: 0.8,
          metalness: 0.1,
          side: THREE.DoubleSide
        });
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        petal.position.y = 0.1 + stemHeight + 0.05;
        petal.position.x = Math.cos(angle) * flowerSize * 0.5;
        petal.position.z = Math.sin(angle) * flowerSize * 0.5;
        
        petal.rotation.y = angle;
        petal.rotation.x = Math.PI / 2;
        
        petal.castShadow = true;
        plantGroup.add(petal);
      }
    }
  };

  // Function to create generic leaves
  const createGenericLeaves = (plant: Plant, plantGroup: THREE.Group, stemHeight: number) => {
    const leafCount = Math.max(2, Math.floor(plant.growthStage * 6));
    
    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2;
      const leafSize = 0.1 + plant.growthStage * 0.1;
      
      const leafGeometry = new THREE.CircleGeometry(leafSize, 8);
      const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4CAF50,
        roughness: 0.8,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      
      leaf.position.y = 0.1 + stemHeight - 0.05 + (i % 3) * 0.05;
      leaf.position.x = Math.cos(angle) * 0.1;
      leaf.position.z = Math.sin(angle) * 0.1;
      
      leaf.rotation.y = angle;
      leaf.rotation.x = Math.PI / 4;
      
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }
  };

  return canvasRef;
}; 