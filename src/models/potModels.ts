import * as THREE from 'three';

// Pot types
export type PotType = 'basic' | 'round' | 'square' | 'hexagonal' | 'decorative';

// Pot colors
export type PotColor = 'terracotta' | 'white' | 'black' | 'blue' | 'green' | 'purple' | 'yellow' | 'pink';

// Pot model class
export class PotModel {
  group: THREE.Group;
  type: PotType;
  color: PotColor;
  
  constructor(type: PotType = 'basic', color: PotColor = 'terracotta') {
    this.group = new THREE.Group();
    this.type = type;
    this.color = color;
    
    this.generate();
  }
  
  // Generate the pot model based on type
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
      case 'basic':
        this.generateBasicPot();
        break;
      case 'round':
        this.generateRoundPot();
        break;
      case 'square':
        this.generateSquarePot();
        break;
      case 'hexagonal':
        this.generateHexagonalPot();
        break;
      case 'decorative':
        this.generateDecorativePot();
        break;
    }
  }
  
  // Set pot color
  setColor(color: PotColor) {
    this.color = color;
    this.generate();
  }
  
  // Update color (alias for setColor for consistency with plant models)
  updateColor(color: PotColor) {
    this.setColor(color);
  }
  
  // Get color value based on pot color
  private getColorValue(): number {
    const colorMap: Record<PotColor, number> = {
      terracotta: 0xc84c0c,
      white: 0xffffff,
      black: 0x333333,
      blue: 0x4169e1,
      green: 0x2e8b57,
      purple: 0x9370db,
      yellow: 0xffd700,
      pink: 0xff69b4
    };
    
    return colorMap[this.color];
  }
  
  // Generate a basic pot (cylindrical)
  private generateBasicPot() {
    const potHeight = 0.4;
    const topRadius = 0.5;
    const bottomRadius = 0.35;
    
    // Create pot body
    const potGeometry = new THREE.CylinderGeometry(
      topRadius, // top radius
      bottomRadius, // bottom radius
      potHeight, // height
      16, // radial segments
      1, // height segments
      false // open ended
    );
    
    const potMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.8,
      metalness: 0.1
    });
    
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -potHeight / 2;
    this.group.add(pot);
    
    // Create soil
    const soilGeometry = new THREE.CylinderGeometry(
      topRadius - 0.05, // top radius
      topRadius - 0.05, // bottom radius
      0.05, // height
      16, // radial segments
      1, // height segments
      false // open ended
    );
    
    const soilMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817, // Dark brown
      roughness: 1.0,
      metalness: 0.0
    });
    
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = -0.05 / 2;
    this.group.add(soil);
    
    // Create pot rim
    const rimGeometry = new THREE.TorusGeometry(
      topRadius, // radius
      0.03, // tube radius
      8, // radial segments
      32 // tubular segments
    );
    
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.7,
      metalness: 0.2
    });
    
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0;
    this.group.add(rim);
  }
  
  // Generate a round pot (more curved)
  private generateRoundPot() {
    const potHeight = 0.4;
    const topRadius = 0.5;
    const bottomRadius = 0.3;
    
    // Create pot body using lathe geometry for curved shape
    const points = [];
    const segments = 10;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = -potHeight * t;
      
      // Create a curved profile using quadratic function
      const radius = bottomRadius + (topRadius - bottomRadius) * (1 - Math.pow(t - 1, 2));
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    const potGeometry = new THREE.LatheGeometry(
      points, // points
      32, // segments
      0, // phiStart
      Math.PI * 2 // phiLength
    );
    
    const potMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.8,
      metalness: 0.1
    });
    
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    this.group.add(pot);
    
    // Create soil
    const soilGeometry = new THREE.CylinderGeometry(
      topRadius - 0.05, // top radius
      topRadius - 0.05, // bottom radius
      0.05, // height
      16, // radial segments
      1, // height segments
      false // open ended
    );
    
    const soilMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817, // Dark brown
      roughness: 1.0,
      metalness: 0.0
    });
    
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = -0.05 / 2;
    this.group.add(soil);
    
    // Create pot rim
    const rimGeometry = new THREE.TorusGeometry(
      topRadius, // radius
      0.03, // tube radius
      8, // radial segments
      32 // tubular segments
    );
    
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.7,
      metalness: 0.2
    });
    
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0;
    this.group.add(rim);
  }
  
  // Generate a square pot
  private generateSquarePot() {
    const potHeight = 0.4;
    const topWidth = 1.0;
    const bottomWidth = 0.8;
    
    // Create pot body
    const potGeometry = new THREE.BoxGeometry(
      topWidth, // width
      potHeight, // height
      topWidth // depth
    );
    
    // Modify vertices to create tapered shape
    const positionAttribute = potGeometry.getAttribute('position');
    const positions = positionAttribute.array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      
      // Only modify bottom vertices
      if (y < 0) {
        const scale = bottomWidth / topWidth;
        positions[i] *= scale; // x
        positions[i + 2] *= scale; // z
      }
    }
    
    // Update geometry
    positionAttribute.needsUpdate = true;
    potGeometry.computeVertexNormals();
    
    const potMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.8,
      metalness: 0.1
    });
    
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -potHeight / 2;
    this.group.add(pot);
    
    // Create soil
    const soilGeometry = new THREE.BoxGeometry(
      topWidth - 0.1, // width
      0.05, // height
      topWidth - 0.1 // depth
    );
    
    const soilMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817, // Dark brown
      roughness: 1.0,
      metalness: 0.0
    });
    
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = -0.05 / 2;
    this.group.add(soil);
    
    // Create pot rim
    const rimGeometry = new THREE.BoxGeometry(
      topWidth + 0.05, // width
      0.05, // height
      topWidth + 0.05 // depth
    );
    
    // Remove center of rim to create frame
    const innerGeometry = new THREE.BoxGeometry(
      topWidth - 0.05, // width
      0.06, // height (slightly larger to avoid z-fighting)
      topWidth - 0.05 // depth
    );
    
    // Since we can't use CSG directly, we'll fake it with a frame
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.7,
      metalness: 0.2
    });
    
    // Create frame edges
    const edgeWidth = 0.05;
    const edgeHeight = 0.05;
    const edgeLength = topWidth + 0.05;
    
    const createEdge = (x: number, z: number, rotationY: number) => {
      const edgeGeometry = new THREE.BoxGeometry(edgeLength, edgeHeight, edgeWidth);
      const edge = new THREE.Mesh(edgeGeometry, rimMaterial);
      edge.position.set(x, 0, z);
      edge.rotation.y = rotationY;
      return edge;
    };
    
    // Add four edges
    const halfSize = (topWidth + 0.05) / 2;
    this.group.add(createEdge(0, -halfSize, 0));
    this.group.add(createEdge(0, halfSize, 0));
    this.group.add(createEdge(-halfSize, 0, Math.PI / 2));
    this.group.add(createEdge(halfSize, 0, Math.PI / 2));
  }
  
  // Generate a hexagonal pot
  private generateHexagonalPot() {
    const potHeight = 0.4;
    const topRadius = 0.5;
    const bottomRadius = 0.35;
    
    // Create pot body
    const potGeometry = new THREE.CylinderGeometry(
      topRadius, // top radius
      bottomRadius, // bottom radius
      potHeight, // height
      6, // radial segments (6 for hexagon)
      1, // height segments
      false // open ended
    );
    
    const potMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.8,
      metalness: 0.1
    });
    
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -potHeight / 2;
    this.group.add(pot);
    
    // Create soil
    const soilGeometry = new THREE.CylinderGeometry(
      topRadius - 0.05, // top radius
      topRadius - 0.05, // bottom radius
      0.05, // height
      6, // radial segments (6 for hexagon)
      1, // height segments
      false // open ended
    );
    
    const soilMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817, // Dark brown
      roughness: 1.0,
      metalness: 0.0
    });
    
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = -0.05 / 2;
    this.group.add(soil);
    
    // Create pot rim
    // For hexagonal rim, we'll create 6 edges
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.7,
      metalness: 0.2
    });
    
    for (let i = 0; i < 6; i++) {
      const angle1 = (i / 6) * Math.PI * 2;
      const angle2 = ((i + 1) / 6) * Math.PI * 2;
      
      const x1 = Math.cos(angle1) * topRadius;
      const z1 = Math.sin(angle1) * topRadius;
      const x2 = Math.cos(angle2) * topRadius;
      const z2 = Math.sin(angle2) * topRadius;
      
      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
      
      const edgeGeometry = new THREE.CylinderGeometry(
        0.03, // top radius
        0.03, // bottom radius
        length, // height
        8, // radial segments
        1, // height segments
        false // open ended
      );
      
      const edge = new THREE.Mesh(edgeGeometry, rimMaterial);
      
      // Position and rotate edge
      edge.position.x = (x1 + x2) / 2;
      edge.position.z = (z1 + z2) / 2;
      edge.position.y = 0;
      
      // Rotate to align with edge
      edge.rotation.y = Math.atan2(z2 - z1, x2 - x1);
      edge.rotation.z = Math.PI / 2;
      
      this.group.add(edge);
    }
  }
  
  // Generate a decorative pot
  private generateDecorativePot() {
    const potHeight = 0.5;
    const topRadius = 0.5;
    const middleRadius = 0.4;
    const bottomRadius = 0.45;
    
    // Create pot body using lathe geometry for complex shape
    const points = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = -potHeight * t;
      
      // Create a more complex profile with curves
      let radius;
      if (t < 0.2) {
        // Top section
        radius = topRadius - (topRadius - middleRadius) * (t / 0.2);
      } else if (t < 0.8) {
        // Middle section with curve
        const normalizedT = (t - 0.2) / 0.6;
        radius = middleRadius + (bottomRadius - middleRadius) * Math.sin(normalizedT * Math.PI);
      } else {
        // Bottom section
        const normalizedT = (t - 0.8) / 0.2;
        radius = bottomRadius - (bottomRadius - middleRadius) * normalizedT;
      }
      
      points.push(new THREE.Vector2(radius, y));
    }
    
    const potGeometry = new THREE.LatheGeometry(
      points, // points
      32, // segments
      0, // phiStart
      Math.PI * 2 // phiLength
    );
    
    const potMaterial = new THREE.MeshStandardMaterial({
      color: this.getColorValue(),
      roughness: 0.8,
      metalness: 0.1
    });
    
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    this.group.add(pot);
    
    // Create soil
    const soilGeometry = new THREE.CylinderGeometry(
      topRadius - 0.05, // top radius
      topRadius - 0.05, // bottom radius
      0.05, // height
      16, // radial segments
      1, // height segments
      false // open ended
    );
    
    const soilMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2817, // Dark brown
      roughness: 1.0,
      metalness: 0.0
    });
    
    const soil = new THREE.Mesh(soilGeometry, soilMaterial);
    soil.position.y = -0.05 / 2;
    this.group.add(soil);
    
    // Add decorative patterns
    const patternCount = 8;
    
    for (let i = 0; i < patternCount; i++) {
      const angle = (i / patternCount) * Math.PI * 2;
      
      // Create a decorative line
      const lineGeometry = new THREE.BoxGeometry(0.02, potHeight * 0.6, 0.02);
      const lineMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // White decoration
        roughness: 0.7,
        metalness: 0.3
      });
      
      const line = new THREE.Mesh(lineGeometry, lineMaterial);
      
      // Position line
      line.position.x = Math.cos(angle) * middleRadius;
      line.position.z = Math.sin(angle) * middleRadius;
      line.position.y = -potHeight * 0.4;
      
      this.group.add(line);
      
      // Add decorative dots
      const dotCount = 3;
      
      for (let j = 0; j < dotCount; j++) {
        const dotGeometry = new THREE.SphereGeometry(0.03, 8, 8);
        const dotMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff, // White decoration
          roughness: 0.7,
          metalness: 0.3
        });
        
        const dot = new THREE.Mesh(dotGeometry, dotMaterial);
        
        // Position dot between lines
        const dotAngle = angle + (Math.PI / patternCount);
        const dotHeight = -potHeight * (0.2 + j * 0.2);
        
        dot.position.x = Math.cos(dotAngle) * middleRadius;
        dot.position.z = Math.sin(dotAngle) * middleRadius;
        dot.position.y = dotHeight;
        
        this.group.add(dot);
      }
    }
    
    // Create pot rim
    const rimGeometry = new THREE.TorusGeometry(
      topRadius, // radius
      0.03, // tube radius
      8, // radial segments
      32 // tubular segments
    );
    
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, // White rim
      roughness: 0.7,
      metalness: 0.3
    });
    
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0;
    this.group.add(rim);
  }
}

// Factory function to create a pot model
export const createPotModel = (type: PotType = 'basic', color: PotColor = 'terracotta'): PotModel => {
  return new PotModel(type, color);
}; 