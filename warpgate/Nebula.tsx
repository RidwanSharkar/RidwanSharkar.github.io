// warpgate/Nebula.tsx

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial, Color, DoubleSide, AdditiveBlending, Points } from 'three';

interface NebulaCloudProps {
  position: [number, number, number];
  color1: string;
  color2: string;
  scale: number;
  opacity: number;
  rotationSpeed?: number;
}

const nebulaVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float opacity;
  uniform float time;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 center = vUv - 0.5;
    float dist = length(center);
    
    // Create cloudy noise pattern
    vec3 noiseCoord = vec3(vUv * 3.0, time * 0.02);
    float noise = fbm(noiseCoord);
    noise = (noise + 1.0) * 0.5; // Normalize to 0-1
    
    // Add secondary noise layer for more detail
    float detailNoise = fbm(noiseCoord * 2.0 + vec3(100.0));
    detailNoise = (detailNoise + 1.0) * 0.5;
    
    // Combine noise layers
    float combinedNoise = noise * 0.7 + detailNoise * 0.3;
    
    // Create soft circular falloff
    float falloff = 1.0 - smoothstep(0.0, 0.5, dist);
    falloff = pow(falloff, 1.5);
    
    // Mix colors based on noise
    vec3 finalColor = mix(color1, color2, combinedNoise);
    
    // Add some brightness variation
    finalColor *= 0.8 + combinedNoise * 0.4;
    
    // Apply falloff and opacity
    float alpha = falloff * combinedNoise * opacity;
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Special spiral nebula shader
const spiralFragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float opacity;
  uniform float time;
  uniform float seed;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  float turbulence(vec3 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * abs(snoise(p * frequency));
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = uv - 0.5;
    float dist = length(center);
    float angle = atan(center.y, center.x);
    
    // Spiral coordinates
    float spiralAngle = angle + dist * 8.0 + time * 0.05;
    vec2 spiralUv = vec2(cos(spiralAngle), sin(spiralAngle)) * dist + 0.5;
    
    vec3 spiralCoord = vec3(spiralUv * 3.0 + seed, time * 0.02);
    
    // Spiral arms
    float arms = sin(angle * 3.0 + dist * 10.0 + seed * 5.0) * 0.5 + 0.5;
    arms = pow(arms, 0.7);
    
    float spiralNoise = fbm(spiralCoord, 5);
    spiralNoise = (spiralNoise + 1.0) * 0.5;
    
    float noise = spiralNoise * arms;
    
    // Swirling falloff
    float spiralFalloff = 1.0 - smoothstep(0.1, 0.5, dist);
    spiralFalloff *= arms;
    
    // Add turbulent edges
    float edgeTurb = turbulence(vec3(uv * 4.0, seed));
    
    float falloff = spiralFalloff * (1.0 - edgeTurb * 0.3);
    float colorMix = spiralNoise;
    
    // Mix three colors based on noise
    vec3 finalColor;
    if (colorMix < 0.5) {
      finalColor = mix(color1, color2, colorMix * 2.0);
    } else {
      finalColor = mix(color2, color3, (colorMix - 0.5) * 2.0);
    }
    
    // Add brightness variation
    finalColor *= 0.7 + noise * 0.5;
    
    // Edge glow
    float edgeGlow = falloff * (1.0 - falloff) * 4.0;
    finalColor += color2 * edgeGlow * 0.3;
    
    // Apply falloff and opacity
    float alpha = falloff * opacity;
    alpha *= 0.8 + noise * 0.4;
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Vivid emission nebula shader - bright glowing gas clouds
const pillarFragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float opacity;
  uniform float time;
  uniform float seed;
  
  varying vec2 vUv;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  float turbulence(vec3 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * abs(snoise(p * frequency));
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = uv - 0.5;
    float dist = length(center);
    
    // Create billowing cloud structure
    vec3 cloudCoord = vec3(uv * 2.5 + seed, time * 0.015);
    
    // Multiple layers of noise for rich detail
    float cloud1 = fbm(cloudCoord, 5);
    float cloud2 = fbm(cloudCoord * 1.8 + vec3(seed * 3.0), 4);
    float cloud3 = turbulence(cloudCoord * 0.8);
    
    // Create bright glowing cores
    float coreNoise = fbm(vec3(uv * 3.0, seed * 2.0), 4);
    float core1 = 1.0 - smoothstep(0.0, 0.3, length(center - vec2(0.1 + coreNoise * 0.1, 0.0)));
    float core2 = 1.0 - smoothstep(0.0, 0.25, length(center - vec2(-0.15, 0.1 + coreNoise * 0.05)));
    float cores = max(core1, core2) * 0.6;
    
    // Combine clouds
    float cloudMix = (cloud1 + 1.0) * 0.5;
    float detailMix = (cloud2 + 1.0) * 0.5;
    float turbMix = cloud3 * 0.5;
    
    float combinedCloud = cloudMix * 0.5 + detailMix * 0.3 + turbMix * 0.2;
    combinedCloud = pow(combinedCloud, 0.8); // Boost brightness
    
    // Soft organic falloff
    float edgeNoise = fbm(vec3(center * 5.0, seed), 3) * 0.2;
    float falloff = 1.0 - smoothstep(0.2, 0.5 + edgeNoise, dist);
    falloff = pow(falloff, 0.7);
    
    // Color regions based on different noise layers
    float colorRegion1 = smoothstep(0.3, 0.7, cloudMix + coreNoise * 0.3);
    float colorRegion2 = smoothstep(0.4, 0.8, detailMix);
    
    // Mix colors - create vivid transitions
    vec3 finalColor = color1;
    finalColor = mix(finalColor, color2, colorRegion1);
    finalColor = mix(finalColor, color3, colorRegion2 * 0.7);
    
    // Add bright core glow
    finalColor += color3 * cores * 1.5;
    finalColor += color2 * cores * 0.8;
    
    // Enhance saturation and brightness
    finalColor *= 1.2 + combinedCloud * 0.6;
    
    // Add rim lighting effect
    float rim = smoothstep(0.3, 0.5, dist) * (1.0 - smoothstep(0.5, 0.55, dist));
    finalColor += color2 * rim * 0.4;
    
    // Apply falloff
    float alpha = falloff * combinedCloud * opacity;
    alpha += cores * opacity * 0.5; // Cores stay bright
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Wispy nebula shader - flowing ethereal tendrils
const wispyFragmentShader = `
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform float opacity;
  uniform float time;
  uniform float seed;
  
  varying vec2 vUv;
  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  float fbm(vec3 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  float turbulence(vec3 p) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * abs(snoise(p * frequency));
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 center = uv - 0.5;
    float dist = length(center);
    
    vec3 wispCoord = vec3(uv * 2.5, time * 0.02 + seed);
    
    // Flowing curves - gentler
    float flow = sin(uv.y * 4.0 + uv.x * 1.5 + time * 0.08 + seed * 3.0) * 0.4;
    flow += sin(uv.y * 2.5 - uv.x * 3.0 + seed * 7.0) * 0.25;
    
    // Turbulent wisps
    float wisp = turbulence(wispCoord + vec3(flow, 0.0, 0.0));
    float detail = fbm(wispCoord * 1.5, 5);
    
    float noise = wisp * 0.6 + (detail + 1.0) * 0.4;
    
    // Soft radial falloff - very gradual fade at edges
    float radialFade = 1.0 - smoothstep(0.2, 0.5, dist);
    radialFade = pow(radialFade, 0.6); // Softer falloff curve
    
    // Add noise-based edge variation for organic feel
    float edgeNoise = fbm(vec3(center * 4.0, seed), 4);
    float noisyRadius = dist - edgeNoise * 0.15;
    float softEdge = 1.0 - smoothstep(0.25, 0.55, noisyRadius);
    
    // Organic, flowing shape - softer mask
    float flowMask = sin(uv.x * 3.14159 * 0.8 + 0.3 + flow * 1.5) * sin(uv.y * 3.14159 * 0.8 + 0.3);
    flowMask = pow(max(flowMask, 0.0), 0.5); // Softer power for gradual transition
    
    // Gentle streaky variation (not hard edges)
    float streaks = fbm(vec3(uv.x * 5.0, uv.y * 1.5, seed), 3);
    streaks = (streaks + 1.0) * 0.5; // Normalize to 0-1
    
    // Combine all falloffs for very soft edges
    float falloff = flowMask * softEdge * radialFade;
    falloff *= 0.7 + streaks * 0.3; // Subtle variation, not harsh cutoff
    falloff = smoothstep(0.0, 0.4, falloff); // Extra smoothing
    
    float colorMix = wisp * 0.5 + 0.25;
    
    // Mix three colors
    vec3 finalColor;
    if (colorMix < 0.5) {
      finalColor = mix(color1, color2, colorMix * 2.0);
    } else {
      finalColor = mix(color2, color3, (colorMix - 0.5) * 2.0);
    }
    
    finalColor *= 0.7 + noise * 0.4;
    
    // Soft edge glow
    float edgeGlow = falloff * (1.0 - falloff) * 3.0;
    finalColor += color2 * edgeGlow * 0.2;
    
    float alpha = falloff * opacity;
    alpha *= 0.7 + noise * 0.3;
    alpha = clamp(alpha, 0.0, 1.0);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const NebulaCloud: React.FC<NebulaCloudProps> = ({
  position,
  color1,
  color2,
  scale,
  opacity,
  rotationSpeed = 0.001
}) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    color1: { value: new Color(color1) },
    color2: { value: new Color(color2) },
    opacity: { value: opacity },
    time: { value: 0 }
  }), [color1, color2, opacity]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale, scale, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

// Special spiral nebula component
interface SpiralNebulaProps {
  position: [number, number, number];
  color1: string;
  color2: string;
  color3: string;
  scale: number;
  opacity: number;
  rotationSpeed?: number;
  seed: number;
  initialRotation?: [number, number, number];
}

const SpiralNebula: React.FC<SpiralNebulaProps> = ({
  position,
  color1,
  color2,
  color3,
  scale,
  opacity,
  rotationSpeed = 0.0025,
  seed,
  initialRotation = [0, 0, 0]
}) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const baseRotation = useRef(initialRotation);

  const uniforms = useMemo(() => ({
    color1: { value: new Color(color1) },
    color2: { value: new Color(color2) },
    color3: { value: new Color(color3) },
    opacity: { value: opacity },
    time: { value: 0 },
    seed: { value: seed }
  }), [color1, color2, color3, opacity, seed]);

  // Set initial rotation on mount
  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x = initialRotation[0];
      meshRef.current.rotation.y = initialRotation[1];
      meshRef.current.rotation.z = initialRotation[2];
    }
  }, [initialRotation]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      // Spin around the spiral's local Z axis while maintaining tilt
      meshRef.current.rotation.z = baseRotation.current[2] + clock.getElapsedTime() * rotationSpeed * 10;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale, scale, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={spiralFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

// Pillar nebula component - Pillars of Creation style
interface PillarNebulaProps {
  position: [number, number, number];
  color1: string;
  color2: string;
  color3: string;
  scaleX: number;
  scaleY: number;
  opacity: number;
  rotationSpeed?: number;
  seed: number;
}

const PillarNebula: React.FC<PillarNebulaProps> = ({
  position,
  color1,
  color2,
  color3,
  scaleX,
  scaleY,
  opacity,
  rotationSpeed = 0.0000375,
  seed
}) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    color1: { value: new Color(color1) },
    color2: { value: new Color(color2) },
    color3: { value: new Color(color3) },
    opacity: { value: opacity },
    time: { value: 0 },
    seed: { value: seed }
  }), [color1, color2, color3, opacity, seed]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scaleX, scaleY, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={pillarFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

// Wispy nebula component - flowing ethereal tendrils
interface WispyNebulaProps {
  position: [number, number, number];
  color1: string;
  color2: string;
  color3: string;
  scaleX: number;
  scaleY: number;
  opacity: number;
  rotationSpeed?: number;
  seed: number;
}

const WispyNebula: React.FC<WispyNebulaProps> = ({
  position,
  color1,
  color2,
  color3,
  scaleX,
  scaleY,
  opacity,
  rotationSpeed = 0.0001,
  seed
}) => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    color1: { value: new Color(color1) },
    color2: { value: new Color(color2) },
    color3: { value: new Color(color3) },
    opacity: { value: opacity },
    time: { value: 0 },
    seed: { value: seed }
  }), [color1, color2, color3, opacity, seed]);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += rotationSpeed;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scaleX, scaleY, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={wispyFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
        blending={AdditiveBlending}
      />
    </mesh>
  );
};

// Nebula dust particles for extra atmosphere
const NebulaDust: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  count: number;
  spread: number;
}> = ({ position, color, count, spread }) => {
  const pointsRef = useRef<Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.random() * spread;

      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);

      siz[i] = Math.random() * 2 + 0.5;
    }

    return [pos, siz];
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.005;
      pointsRef.current.rotation.x = clock.getElapsedTime() * 0.003;
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.3}
        transparent
        opacity={0.1}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
};

interface NebulaConfig {
  position: [number, number, number];
  color1: string;
  color2: string;
  scale: number;
  opacity: number;
  rotationSpeed: number;
  dustColor: string;
  dustCount: number;
  rotation: [number, number, number];
}

interface SpiralConfig {
  position: [number, number, number];
  color1: string;
  color2: string;
  color3: string;
  scale: number;
  opacity: number;
  rotationSpeed: number;
  seed: number;
  dustColor: string;
  rotation: [number, number, number];
}

// Color palettes for nebulae - matching planet/moon colors
const nebulaColorPalettes = [
  { dark: '#1a0a2a', bright: '#A55BFF', dust: '#CCA2FF' },   // Purple (GitHub)
  { dark: '#0a1a2a', bright: '#4FB8FF', dust: '#A0C4E2' },   // Blue (LinkedIn)
  { dark: '#0a2020', bright: '#2DE1FC', dust: '#00FFFF' },   // Cyan (Eidolon)
  { dark: '#1a1a2a', bright: '#BAB9FF', dust: '#B8B3E9' },   // Lavender (Avernus)
  { dark: '#0a2a2a', bright: '#84DCC6', dust: '#2DE1FC' },   // Teal/Mint (Mythos)
  { dark: '#2a1a2a', bright: '#FFCAE2', dust: '#FFA1CB' },   // Pink (Spotify)
  { dark: '#2a1a1a', bright: '#F4ACB7', dust: '#F694C1' },   // Rose Pink (Instagram)
  { dark: '#1a1a2a', bright: '#809BCE', dust: '#D9C6E8' },   // Blue/Purple (Threads)
  { dark: '#2a0a1a', bright: '#ff00ff', dust: '#FFA1CB' },   // Magenta (Exoplanet)
];

// Spiral color palettes - 3 colors each (matching planets)
const spiralColorPalettes = [
  { c1: '#1a0a2a', c2: '#A55BFF', c3: '#CCA2FF', dust: '#B8B3E9' },  // Purple (GitHub)
  { c1: '#0a1a2a', c2: '#4FB8FF', c3: '#A0C4E2', dust: '#2DE1FC' },  // Blue (LinkedIn)
  { c1: '#0a2020', c2: '#2DE1FC', c3: '#84DCC6', dust: '#00FFFF' },  // Cyan/Teal (Eidolon/Mythos)
  { c1: '#1a0a2a', c2: '#A55BFF', c3: '#CCA2FF', dust: '#B8B3E9' },  // Pink (Instagram/Spotify)
  { c1: '#1a1a2a', c2: '#BAB9FF', c3: '#D9C6E8', dust: '#809BCE' },  // Lavender (Avernus)
];

// Vivid emission nebula color palettes - dramatic contrasting colors
const pillarColorPalettes = [
  { c1: '#1a0a1a', c2: '#ff3366', c3: '#00ffff', dust: '#ff6699' },  // Magenta/Cyan (dramatic contrast)
  { c1: '#0a1a2a', c2: '#ff6633', c3: '#2DE1FC', dust: '#ffaa00' },  // Orange/Teal (fire & ice)
  { c1: '#1a0a0a', c2: '#ff0044', c3: '#ff9900', dust: '#ff6666' },  // Red/Orange (hot emission)
  { c1: '#0a0a2a', c2: '#ff00ff', c3: '#00ffff', dust: '#ff66ff' },  // Magenta/Cyan (neon)
  { c1: '#1a1a0a', c2: '#ffcc00', c3: '#ff3366', dust: '#ffaa33' },  // Gold/Pink (warm glow)
  { c1: '#0a1a1a', c2: '#2DE1FC', c3: '#ff6699', dust: '#66ffff' },  // Cyan/Pink (pastel vivid)
  { c1: '#1a0a2a', c2: '#A55BFF', c3: '#ff6633', dust: '#cc66ff' },  // Purple/Orange
  { c1: '#0a2a1a', c2: '#66ff66', c3: '#ff3366', dust: '#99ff99' },  // Green/Magenta
];

// Wispy color palettes - ethereal flowing colors (matching planets + extra green/blue/red)
const wispyColorPalettes = [
  { c1: '#0a2020', c2: '#84DCC6', c3: '#2DE1FC', dust: '#00FFFF' },  // Mint/Cyan (Mythos)
  { c1: '#0a1a2a', c2: '#2DE1FC', c3: '#00FFFF', dust: '#4FB8FF' },  // Bright Cyan (Eidolon)
  { c1: '#0a2a1a', c2: '#66ff33', c3: '#84DCC6', dust: '#2DE1FC' },  // Electric Green
  { c1: '#0a1a2a', c2: '#4FB8FF', c3: '#2DE1FC', dust: '#A0C4E2' },  // Blue/Cyan (LinkedIn)
  { c1: '#0a2020', c2: '#00FFFF', c3: '#66ff33', dust: '#84DCC6' },  // Cyan/Green
  { c1: '#0a1a1a', c2: '#2DE1FC', c3: '#84DCC6', dust: '#00FFFF' },  // Teal/Cyan
  { c1: '#2a0a0a', c2: '#ff3366', c3: '#F87666', dust: '#FF7F11' },  // Crimson/Coral
  { c1: '#2a0a1a', c2: '#F87666', c3: '#ff3366', dust: '#FFA1CB' },  // Coral/Red
  { c1: '#2a1010', c2: '#ff0044', c3: '#ff3366', dust: '#F4ACB7' },  // Bright Red
  { c1: '#1a1a2a', c2: '#BAB9FF', c3: '#D9C6E8', dust: '#B8B3E9' },  // Lavender (Avernus)
  { c1: '#2a1a2a', c2: '#FFCAE2', c3: '#F4ACB7', dust: '#FFA1CB' },  // Pink (Spotify/Instagram)
];

const Nebula: React.FC = () => {
  // Generate truly random nebulae - SPHERICALLY distributed with CLUSTERING
  const nebulae: NebulaConfig[] = useMemo(() => {
    const count = 6 + Math.floor(Math.random() * 14); // 10-17 nebulae
    const generated: NebulaConfig[] = [];
    
    // Generate 2-4 cluster centers for nebulae to group around
    const numClusters = 2 + Math.floor(Math.random() * 3);
    const clusterCenters: [number, number, number][] = [];
    
    for (let c = 0; c < numClusters; c++) {
      const cTheta = Math.random() * Math.PI * 2;
      const cPhi = Math.acos(2 * Math.random() - 1);
      const cRadius = 100 + Math.random() * 80;
      clusterCenters.push([
        cRadius * Math.sin(cPhi) * Math.cos(cTheta),
        cRadius * Math.sin(cPhi) * Math.sin(cTheta),
        cRadius * Math.cos(cPhi)
      ]);
    }
    
    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number;
      
      // 60% chance to spawn near a cluster center, 40% random
      if (Math.random() < 0.6 && clusterCenters.length > 0) {
        // Pick a random cluster center
        const cluster = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
        
        // Offset from cluster center (spread of 30-60 units)
        const spread = 30 + Math.random() * 30;
        x = cluster[0] + (Math.random() - 0.5) * spread * 2;
        y = cluster[1] + (Math.random() - 0.5) * spread * 2;
        z = cluster[2] + (Math.random() - 0.5) * spread * 2;
      } else {
        // Completely random spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 90 + Math.random() * 110;
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta);
        z = radius * Math.cos(phi);
      }
      
      // Random color palette - nebulae in same cluster often share similar colors
      const paletteIndex = Math.floor(Math.random() * nebulaColorPalettes.length);
      const palette = nebulaColorPalettes[paletteIndex];
      
      // Random scale and properties
      const scale = 10 + Math.random() * 50; // 10-60
      const opacity = 0.125 + Math.random() * 0.2; // 0.175-0.375
      const rotationSpeed = (Math.random() - 0.5) * 0.001;
      const dustCount = 100 + Math.floor(Math.random() * 150);
      
      // Random rotation so nebulae face different directions
      const rotX = Math.random() * Math.PI * 2;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = Math.random() * Math.PI * 2;
      
      generated.push({
        position: [x, y, z] as [number, number, number],
        color1: palette.dark,
        color2: palette.bright,
        scale,
        opacity,
        rotationSpeed,
        dustColor: palette.dust,
        dustCount,
        rotation: [rotX, rotY, rotZ] as [number, number, number]
      });
    }
    
    return generated;
  }, []);

  // Generate random spiral nebula - different each page load
  const spiralNebula: SpiralConfig = useMemo(() => {
    // Random position
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 50;
    const x = Math.cos(angle) * distance;
    const y = (Math.random() - 0.5) * 60;
    const z = -100 - Math.random() * 50;
    
    // Random spiral palette
    const paletteIndex = Math.floor(Math.random() * spiralColorPalettes.length);
    const palette = spiralColorPalettes[paletteIndex];
    
    // Random rotation angles for variety
    const rotX = (Math.random() - 0.5) * Math.PI * 0.5; // -45 to 45 degrees
    const rotY = (Math.random() - 0.5) * Math.PI * 0.5; // -45 to 45 degrees  
    const rotZ = Math.random() * Math.PI * 2; // Full 360 degrees
    
    return {
      position: [x, y, z] as [number, number, number],
      color1: palette.c1,
      color2: palette.c2,
      color3: palette.c3,
      scale: 8 + Math.random() * 20,
      opacity: 0.225 + Math.random() * 0.1,
      rotationSpeed: 0.0006 + Math.random() * 0.02,
      seed: Math.random() * 10,
      dustColor: palette.dust,
      rotation: [rotX, rotY, rotZ] as [number, number, number]
    };
  }, []);

  // Random flag to swap pillar and wispy positions (50% chance)
  const swapPositions = useMemo(() => Math.random() > 0.5, []);

  // Generate random pillar nebula - positioned BEHIND the camera (positive Z)
  const pillarNebula = useMemo(() => {
    // Position behind the camera - swap sides half the time
    const x = swapPositions 
      ? 80 + Math.random() * 60   // Right side (swapped)
      : -60 + Math.random() * 40 - 100; // Left side (default)
    const y = 20 + Math.random() * 50; // Upper area
    const z = 80 + Math.random() * 60; // POSITIVE Z - behind camera
    
    const paletteIndex = Math.floor(Math.random() * pillarColorPalettes.length);
    const palette = pillarColorPalettes[paletteIndex];
    
    return {
      position: [x, y, z] as [number, number, number],
      color1: palette.c1,
      color2: palette.c2,
      color3: palette.c3,
      scaleX: 15 + Math.random() * 40, // More balanced size
      scaleY: 15 + Math.random() * 40, // Similar to width for cloud shape
      opacity: 0.225 + Math.random() * 0.15,
      rotationSpeed: (Math.random() - 0.5) * 0.0003,
      seed: Math.random() * 10,
      dustColor: palette.dust
    };
  }, [swapPositions]);

  // Generate random wispy nebula - positioned BEHIND the camera (positive Z)
  const wispyNebula = useMemo(() => {
    // Position behind the camera - swap sides half the time
    const x = swapPositions 
      ? -60 + Math.random() * 40 - 100  // Left side (swapped)
      : 80 + Math.random() * 60; // Right side (default)
    const y = -10 + Math.random() * 40; // Middle area
    const z = 90 + Math.random() * 70; // POSITIVE Z - behind camera
    
    const paletteIndex = Math.floor(Math.random() * wispyColorPalettes.length);
    const palette = wispyColorPalettes[paletteIndex];
    
    return {
      position: [x, y, z] as [number, number, number],
      color1: palette.c1,
      color2: palette.c2,
      color3: palette.c3,
      scaleX: 60 + Math.random() * 40, // Wider than tall
      scaleY: 30 + Math.random() * 30,
      opacity: 0.25 + Math.random() * 0.1,
      rotationSpeed: (Math.random() - 0.5) * 0.0001,
      seed: Math.random() * 10,
      dustColor: palette.dust
    };
  }, [swapPositions]);

  return (
    <group>
      {/* Random cloud nebulae */}
      {nebulae.map((nebula, index) => (
        <group key={index} position={nebula.position} rotation={nebula.rotation}>
          <NebulaCloud
            position={[0, 0, 0]}
            color1={nebula.color1}
            color2={nebula.color2}
            scale={nebula.scale}
            opacity={nebula.opacity}
            rotationSpeed={nebula.rotationSpeed}
          />
          <NebulaDust
            position={[0, 0, 0]}
            color={nebula.dustColor}
            count={nebula.dustCount}
            spread={nebula.scale * 0.4}
          />
        </group>
      ))}

      {/* Special spiral nebula with random viewing angle */}
      <SpiralNebula
        position={spiralNebula.position}
        color1={spiralNebula.color1}
        color2={spiralNebula.color2}
        color3={spiralNebula.color3}
        scale={spiralNebula.scale}
        opacity={spiralNebula.opacity}
        rotationSpeed={spiralNebula.rotationSpeed}
        seed={spiralNebula.seed}
        initialRotation={spiralNebula.rotation}
      />
      <NebulaDust
        position={spiralNebula.position}
        color={spiralNebula.dustColor}
        count={200}
        spread={spiralNebula.scale * 0.4}
      />

      {/* Pillar nebula - Pillars of Creation style */}
      <PillarNebula
        position={pillarNebula.position}
        color1={pillarNebula.color1}
        color2={pillarNebula.color2}
        color3={pillarNebula.color3}
        scaleX={pillarNebula.scaleX}
        scaleY={pillarNebula.scaleY}
        opacity={pillarNebula.opacity}
        rotationSpeed={pillarNebula.rotationSpeed}
        seed={pillarNebula.seed}
      />
      <NebulaDust
        position={pillarNebula.position}
        color={pillarNebula.dustColor}
        count={180}
        spread={Math.max(pillarNebula.scaleX, pillarNebula.scaleY) * 0.35}
      />

      {/* Wispy nebula - flowing ethereal tendrils */}
      <WispyNebula
        position={wispyNebula.position}
        color1={wispyNebula.color1}
        color2={wispyNebula.color2}
        color3={wispyNebula.color3}
        scaleX={wispyNebula.scaleX}
        scaleY={wispyNebula.scaleY}
        opacity={wispyNebula.opacity}
        rotationSpeed={wispyNebula.rotationSpeed}
        seed={wispyNebula.seed}
      />
      <NebulaDust
        position={wispyNebula.position}
        color={wispyNebula.dustColor}
        count={150}
        spread={Math.max(wispyNebula.scaleX, wispyNebula.scaleY) * 0.35}
      />
    </group>
  );
};

export default Nebula;
