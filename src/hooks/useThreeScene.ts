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
  
  // Update plant model when plant changes
  useEffect(() => {
    if (!plant || !sceneRef.current) return;
    
    // Remove existing plant and pot models if they exist
    if (plantModelRef.current) {
      sceneRef.current.remove(plantModelRef.current.group);
      plantModelRef.current = null;
    }
    
    if (potModelRef.current) {
      sceneRef.current.remove(potModelRef.current.group);
      potModelRef.current = null;
    }
    
    // Create new pot model
    const potModel = createPotModel('basic', plant.potColor as any);
    potModelRef.current = potModel;
    sceneRef.current.add(potModel.group);
    
    // Create new plant model
    const plantModel = createPlantModel(plant.type, plant.growthStage);
    plantModelRef.current = plantModel;
    sceneRef.current.add(plantModel.group);
    
  }, [plant]);
  
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