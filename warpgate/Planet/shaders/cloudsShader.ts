// src/components/Planet/shaders/cloudsShader.ts
import * as THREE from 'three';

export const CloudsShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
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
    uniform float time;

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
      
      for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      
      return value * 0.5 + 0.5;
    }

    void main() {
      // Create moving cloud patterns
      vec2 st = vUv * 2.0 + vec2(time * 0.01);
      float clouds = fbm(st);
      clouds = smoothstep(0.4, 0.6, clouds);
      
      // Edge softness based on viewing angle
      float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
      
      // Combine clouds with edge softness
      float alpha = clouds * (1.0 - edge * 0.8);
      
      gl_FragColor = vec4(vec3(1.0), alpha * 0.4);  // Reduced overall opacity for subtler clouds
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
});