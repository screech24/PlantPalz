import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createPlantModel } from '../models/plantModels';
import { createPotModel } from '../models/potModels';
import { createEnvironmentModel } from '../models/environmentModels';
import { Plant } from '../types';

interface UseGardenSceneProps {
  containerRef: React.RefObject<HTMLDivElement>;
  plants: Plant[];
  isDaytime: boolean;
  isCurtainsOpen: boolean;
  isGrowLightOn: boolean;
  onToggleCurtains: () => void;
  onToggleGrowLight: () => void;
}

export const useGardenScene = ({
  containerRef,
  plants,
  isDaytime,
  isCurtainsOpen,
  isGrowLightOn,
  onToggleCurtains,
  onToggleGrowLight
}: UseGardenSceneProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const environmentRef = useRef<ReturnType<typeof createEnvironmentModel> | null>(null);
  const plantModelsRef = useRef<Map<string, ReturnType<typeof createPlantModel>>>(new Map());
  const potModelsRef = useRef<Map<string, ReturnType<typeof createPotModel>>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Store a reference to the container element
    const container = containerRef.current;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 15;
    controls.maxPolarAngle = Math.PI / 2;
    controls.target.set(0, 2, -5); // Look at the shelf
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Create environment
    const environment = createEnvironmentModel();
    scene.add(environment.group);
    environmentRef.current = environment;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    setIsLoading(false);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        // Dispose of all geometries and materials
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Update environment state when props change
  useEffect(() => {
    if (!environmentRef.current) return;
    
    const environment = environmentRef.current;
    
    // Update environment state
    environment.isDaytime = isDaytime;
    environment.isCurtainsOpen = isCurtainsOpen;
    environment.isGrowLightOn = isGrowLightOn;
    
    // Update visual elements
    environment.updateCurtains();
    environment.updateGrowLight();
    
  }, [isDaytime, isCurtainsOpen, isGrowLightOn]);
  
  // Update plants when they change
  useEffect(() => {
    if (!sceneRef.current || !environmentRef.current) return;
    
    const scene = sceneRef.current;
    const environment = environmentRef.current;
    
    // Track current plant IDs
    const currentPlantIds = new Set(plants.map(p => p.id));
    
    // Remove plants that are no longer in the list
    for (const [id, model] of plantModelsRef.current.entries()) {
      if (!currentPlantIds.has(id)) {
        scene.remove(model.group);
        plantModelsRef.current.delete(id);
      }
    }
    
    for (const [id, model] of potModelsRef.current.entries()) {
      if (!currentPlantIds.has(id)) {
        scene.remove(model.group);
        potModelsRef.current.delete(id);
      }
    }
    
    // Add or update plants
    plants.forEach((plant, index) => {
      // Calculate position on shelf
      const shelfWidth = 12;
      const numPlantsPerShelf = 2;
      const shelfIndex = Math.floor(index / numPlantsPerShelf);
      const positionOnShelf = index % numPlantsPerShelf;
      
      const x = (positionOnShelf * 4) - 2; // Space plants evenly on shelf
      const y = shelfIndex * 1 + 1.2; // Position on different shelves
      const z = -6; // Align with shelf
      
      // Create or update pot
      let potModel = potModelsRef.current.get(plant.id);
      if (!potModel) {
        potModel = createPotModel(plant.potType, plant.potColor as any);
        potModelsRef.current.set(plant.id, potModel);
        scene.add(potModel.group);
      } else {
        potModel.type = plant.potType;
        potModel.setColor(plant.potColor as any);
        potModel.generate();
      }
      
      // Position pot
      potModel.group.position.set(x, y, z);
      potModel.group.scale.set(0.5, 0.5, 0.5); // Scale down to fit on shelf
      
      // Create or update plant
      let plantModel = plantModelsRef.current.get(plant.id);
      if (!plantModel) {
        plantModel = createPlantModel(plant.type, plant.growthStage);
        plantModelsRef.current.set(plant.id, plantModel);
        scene.add(plantModel.group);
      } else {
        plantModel.type = plant.type;
        plantModel.updateGrowth(plant.growthStage);
      }
      
      // Position plant on top of pot
      plantModel.group.position.set(x, y + 0.2, z);
      plantModel.group.scale.set(0.5, 0.5, 0.5); // Scale down to fit on shelf
    });
    
  }, [plants]);
  
  // Add click handlers for interactive elements
  useEffect(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current || !sceneRef.current) return;
    
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
      
      // Find all intersected objects
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        // Check if we clicked on the curtains
        const curtainIntersect = intersects.find(intersect => {
          let obj = intersect.object;
          while (obj.parent) {
            if (obj.parent === environmentRef.current?.curtains) {
              return true;
            }
            obj = obj.parent;
          }
          return false;
        });
        
        if (curtainIntersect) {
          onToggleCurtains();
          return;
        }
        
        // Check if we clicked on the grow light
        const lightIntersect = intersects.find(intersect => {
          let obj = intersect.object;
          while (obj.parent) {
            if (obj.parent === environmentRef.current?.growLight) {
              return true;
            }
            obj = obj.parent;
          }
          return false;
        });
        
        if (lightIntersect) {
          onToggleGrowLight();
          return;
        }
      }
    };
    
    container.addEventListener('click', handleClick);
    
    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [onToggleCurtains, onToggleGrowLight]);
  
  return {
    isLoading,
    takeScreenshot: () => {
      if (!rendererRef.current) return null;
      
      // Render the scene
      if (sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      // Get the canvas data URL
      return rendererRef.current.domElement.toDataURL('image/png');
    }
  };
}; 