# Planetfolio v3.0
- Collision Logic + Explosions
- Hyperbolic Trajectories
- Sun Gravity Influence
- Binary Planet System
- Am Backing Tracks 

![Planetfolio v3.0](Planetfolio-3.0.gif)

# Planetfolio v2.0
- Exoplanets
- HUD Interface
- Meditative SoundBar
- Nerd Stats

![Planetfolio v2.0](https://github.com/user-attachments/assets/67420c06-3db2-4496-9796-9b7cdd9e9ee7)

---

## Technical Overview

**Planetfolio** is an interactive 3D portfolio experience built as a procedurally animated solar system. Each planet represents a project, social profile, or creative work, orbiting in real-time with physics-inspired motion and custom simplified gravitational mechanics.

### Tech Stack
- **Next.js 14** - React framework with static export optimization
- **React Three Fiber** - Declarative Three.js rendering in React
- **TypeScript** - Type-safe component architecture
- **Three.js** - WebGL-powered 3D graphics engine
- **Framer Motion** - Smooth UI transitions and animations
- **Tailwind CSS** - Utility-first styling for HUD components

### Core Features

#### 🪐 Orbital Mechanics System
- **Keplerian Orbits**: Planets follow elliptical paths with configurable radius, speed, and initial angles
- **Binary Planet Systems**: Gravitationally-bound planet pairs orbiting a shared barycenter
- **Moon Subsystems**: Nested orbital hierarchies with independent rotation speeds
- **Ring Structures**: Procedurally-generated planetary rings with custom inclinations and transparency

#### 🌌 Physics & Gravity Simulation
- **Inverse-Square Law Gravity**: Real-time n-body attraction calculations for exoplanet trajectories
- **Hyperbolic Flybys**: Exoplanets spawn beyond system boundaries with randomized approach vectors
- **Collision Detection**: Continuous distance-checking between asteroids, planets, and the sun
- **Particle Explosions**: Physics-driven debris clouds with color inheritance on impact

#### ☄️ Dynamic Asteroid Field
- **350+ Procedural Asteroids**: Icosahedral geometry with varying sizes and orbital inclinations
- **Dual-Band Configuration**: Inner belt (2-7 AU) and outer belt (9-11.5 AU) populations
- **Rotation Dynamics**: Individual spin states for visual depth

#### 🎨 Rendering & Materials
- **SVG Texture Mapping**: Logo overlays on planetary surfaces with alpha blending
- **Custom Shaders**: Emissive glow effects, roughness/metalness PBR materials
- **Trail Rendering**: Velocity-based motion trails for hyperbolic objects
- **Ambient Lighting**: Directional sun illumination with HDR tone mapping

#### 🎛️ Interactive Interface
- **Clickable Celestial Bodies**: Raycast-based selection system for planets and moons
- **Dynamic InfoPanel**: Modal overlays displaying project metadata and navigation links
- **Audio Player**: Integrated ambient soundtrack with custom controls
- **Visibility Management**: Tab-blur detection to pause animations and conserve resources

#### 🚀 Performance Optimizations
- **Instanced Geometry**: Shared mesh buffers for asteroid field rendering
- **useFrame Hooks**: Synchronized animation loop across 400+ moving objects
- **Lazy Suspense Loading**: Code-split 3D scenes with fallback states
- **Static Export**: Pre-rendered Next.js build for CDN deployment

### Architecture Highlights

```typescript
// Simplified Physics Loop (Exoplanet.tsx)
useFrame(() => {
  const distanceToSun = position.length();
  
  // Gravity influence within threshold
  if (distanceToSun < HYPERBOLIC_THRESHOLD) {
    const gravityStrength = BASE_GRAVITY / (distanceToSun ** 2);
    const gravityVector = position.normalize()
      .multiplyScalar(-gravityStrength);
    velocity.add(gravityVector);
  }
  
  position.add(velocity);
});
```

The system uses **Vector3 mathematics** for 3D transformations, **spherical coordinates** for spawn distributions, and **axis-angle rotations** to vary exoplanet inclinations. All orbital motion is calculated per-frame using trigonometric functions and elapsed time deltas.

### Data-Driven Design

Planets are defined as JSON-like objects with properties for:
- Orbital parameters (radius, speed, initial angle)
- Visual attributes (color, size, rings, textures)
- Interactive metadata (links, labels, descriptions)
- Hierarchical relationships (moons, binary companions) <br>
This allows easy content updates without touching render logic.
