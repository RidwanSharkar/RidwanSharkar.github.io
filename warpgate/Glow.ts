// Glow.ts
export const glowVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const glowFragmentShader = `
  uniform vec3 glowColor;
  uniform float intensity;
  varying vec3 vNormal;
  void main() 
  {
    float glow = dot(vNormal, vec3(0.0, 0.0, 1.0));
    glow = pow(glow, intensity);
    gl_FragColor = vec4(glowColor * glow, 1.0);
  }
`;
