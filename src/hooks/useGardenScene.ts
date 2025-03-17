import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Plant } from '../types';
import { getColorValue } from '../models/potModels';

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
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);
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

    // Load room model
    const loader = new GLTFLoader();
    loader.load('/models/living_room.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      model.position.set(0, 0, 0);
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(model);
      roomModelRef.current = model;
    });

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Handle mouse click for plant selection
    const handleMouseClick = (event: MouseEvent) => {
      if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / canvasRef.current.clientWidth) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / canvasRef.current.clientHeight) * 2 + 1;
      
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

    canvasRef.current.addEventListener('click', handleMouseClick);

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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleMouseClick);
        if (rendererRef.current) {
          canvasRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      plantsRef.current.clear();
    };
  }, [onSelectPlant]);

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
      const loader = new GLTFLoader();
      
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
      
      // Load the plant model
      loader.load('/models/plant.glb', (gltf) => {
        const model = gltf.scene;
        model.position.set(x, y, z);
        model.scale.set(1, 1, 1);
        
        // Apply pot color
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Set pot color
            if (child.name.includes('pot')) {
              const material = child.material as THREE.MeshStandardMaterial;
              material.name = 'pot';
              const potColor = getColorValue(plant.pot.color);
              material.color.set(potColor);
              
              // Highlight active plant
              if (plant.id === activePlantId) {
                material.emissive.set(0x333333);
                material.emissiveIntensity = 0.5;
                model.scale.set(1.1, 1.1, 1.1);
              }
            }
            
            // Set plant color based on health
            if (child.name.includes('leaf')) {
              const material = child.material as THREE.MeshStandardMaterial;
              
              // Calculate color based on health
              const healthPercent = plant.health / 100;
              const r = Math.max(0, 1 - healthPercent);
              const g = Math.min(1, 0.2 + healthPercent * 0.8);
              const b = Math.max(0, 0.2 - healthPercent * 0.2);
              
              material.color.setRGB(r, g, b);
            }
          }
        });
        
        scene.add(model);
        plantsRef.current.set(plant.id, model);
      });
    });
  }, [plants, activePlantId]);

  return canvasRef;
}; 