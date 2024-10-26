// glowShader.ts
export const glowVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    float strength = pow(0.6 - dot(vNormal, vPositionNormal), 3.0);
    gl_FragColor = vec4(glowColor, strength * intensity);
  }
`;