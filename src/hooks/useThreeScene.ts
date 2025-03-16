import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createPlantModel } from '../models/plantModels';
import { createPotModel } from '../models/potModels';
import { Plant } from '../types';

interface UseThreeSceneProps {
  containerRef: React.RefObject<HTMLDivElement>;
  plant: Plant | null;
}

export const useThreeScene = ({ containerRef, plant }: UseThreeSceneProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const plantModelRef = useRef<ReturnType<typeof createPlantModel> | null>(null);
  const potModelRef = useRef<ReturnType<typeof createPotModel> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize the scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50, // FOV
      containerRef.current.clientWidth / containerRef.current.clientHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add a ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);
    
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
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
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
  }, [containerRef]);
  
  // Update plant model when plant changes
  useEffect(() => {
    if (!sceneRef.current || !plant) return;
    
    // Remove existing plant and pot models
    if (plantModelRef.current) {
      sceneRef.current.remove(plantModelRef.current.group);
      plantModelRef.current = null;
    }
    
    if (potModelRef.current) {
      sceneRef.current.remove(potModelRef.current.group);
      potModelRef.current = null;
    }
    
    // Create new pot model
    const potModel = createPotModel('basic', 'terracotta');
    potModelRef.current = potModel;
    sceneRef.current.add(potModel.group);
    
    // Create new plant model
    const plantModel = createPlantModel(plant.type, plant.growthStage);
    plantModelRef.current = plantModel;
    sceneRef.current.add(plantModel.group);
    
  }, [plant]);
  
  // Update plant growth stage when it changes
  useEffect(() => {
    if (!plantModelRef.current || !plant) return;
    
    plantModelRef.current.updateGrowth(plant.growthStage);
    
  }, [plant?.growthStage]);
  
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