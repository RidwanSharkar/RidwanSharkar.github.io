// src/components/Planet/shaders/atmosphereShader.ts
import * as THREE from 'three';

export const AtmosphereShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Calculate atmosphere intensity based on viewing angle
      float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
      
      // Create a gradient from blue to light blue
      vec3 atmosphereColor = mix(
        vec3(0.4, 0.7, 1.0),    // Light blue
        vec3(0.6, 0.8, 1.0),    // Lighter blue
        intensity
      );
      
      // Add slight color variation based on height
      float heightFactor = vPosition.y * 0.1 + 0.5;
      atmosphereColor *= heightFactor;
      
      gl_FragColor = vec4(atmosphereColor, intensity * 0.3);
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
});