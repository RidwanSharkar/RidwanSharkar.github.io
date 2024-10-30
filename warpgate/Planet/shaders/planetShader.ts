// src/components/Planet/shaders/planetShader.ts
import * as THREE from 'three';

export const PlanetShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    oceanColor: { value: new THREE.Color("#0077be") },    // Deep ocean blue
    shallowColor: { value: new THREE.Color("#0099cc") },  // Shallow water blue
    landColor: { value: new THREE.Color("#4caf50") },     // Land base color
    heightColor: { value: new THREE.Color("#795548") },   // Mountain/height color
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform vec3 oceanColor;
    uniform vec3 shallowColor;
    uniform vec3 landColor;
    uniform vec3 heightColor;
    uniform float time;

    // Improved noise function for more natural patterns
    vec2 hash2(vec2 p) {
      p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float noise(vec2 p) {
      const float K1 = 0.366025404;
      const float K2 = 0.211324865;
      
      vec2 i = floor(p + (p.x + p.y) * K1);
      vec2 a = p - i + (i.x + i.y) * K2;
      vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec2 b = a - o + K2;
      vec2 c = a - 1.0 + 2.0 * K2;
      
      vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
      vec3 n = h * h * h * h * vec3(dot(a,hash2(i)), dot(b,hash2(i+o)), dot(c,hash2(i+1.0)));
      
      return dot(n, vec3(70.0));
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      // Adjust these values to control continent size and detail
      const int OCTAVES = 6;
      
      for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.2;  // Increased frequency multiplier for more detail
        amplitude *= 0.5;
      }
      
      return value * 0.5 + 0.5;
    }

    void main() {
      // Create large-scale continent patterns
      vec2 st = vUv * 3.0;
      float elevation = fbm(st + time * 0.01);
      
      // Add detail to the terrain
      float detail = fbm(st * 5.0) * 0.3;
      elevation = smoothstep(0.4, 0.6, elevation + detail);
      
      // Create coastal regions
      float coast = smoothstep(0.38, 0.42, elevation);
      
      // Calculate atmospheric scattering based on normal
      float atmosphere = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      
      // Mix colors based on elevation and coastal regions
      vec3 terrainColor;
      if (elevation < 0.4) {
        // Deep ocean
        terrainColor = oceanColor;
      } else if (elevation < 0.42) {
        // Coastal waters
        terrainColor = mix(shallowColor, landColor, coast);
      } else {
        // Land with height-based coloring
        float heightFactor = smoothstep(0.42, 0.8, elevation);
        terrainColor = mix(landColor, heightColor, heightFactor);
      }
      
      // Add atmospheric effect
      vec3 atmosphereColor = vec3(0.6, 0.8, 1.0);
      terrainColor = mix(terrainColor, atmosphereColor, atmosphere * 0.3);
      
      gl_FragColor = vec4(terrainColor, 1.0);
    }
  `
});