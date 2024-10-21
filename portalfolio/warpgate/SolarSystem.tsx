// warpgate/SolarSystem.tsx
import Planet from './OrbitalPlanet';

interface PlanetData {
  position: [number, number, number];
  link: string;
  label: string;
  orbitRadius: number;
  orbitSpeed: number;
  planetColor: string;
  ringColor?: string;
  size: number;
}

const PlanetGroup: React.FC = () => {
  const planets: PlanetData[] = [
    {
      position: [0, 0, 0],
      link: 'https://www.linkedin.com/in/RidwanSharkar',
      label: 'LinkedIn',
      orbitRadius: 4,
      orbitSpeed: 0.3,
      planetColor: '#0077B5', // LinkedIn blue
      size: 0.8
    },
    {
      position: [0, 0, 0],
      link: 'https://github.com/RidwanSharkar',
      label: 'GitHub',
      orbitRadius: 6,
      orbitSpeed: 0.2,
      planetColor: '#6e5494', // GitHub purple
      ringColor: '#4078c0', // GitHub blue
      size: 1
    },
    {
      position: [0, 0, 0],
      link: 'https://mythos.store',
      label: 'Art Portfolio',
      orbitRadius: 8,
      orbitSpeed: 0.15,
      planetColor: '#FF6B6B', // Coral red
      size: 1.2
    },
    {
      position: [0, 0, 0],
      link: 'https://instagram.com/ridwansharkar/?hl=en',
      label: 'Instagram',
      orbitRadius: 10,
      orbitSpeed: 0.1,
      planetColor: '#E4405F', // Instagram pink
      ringColor: '#FCAF45', // Instagram yellow
      size: 0.9
    }
  ];

  return (
    <>
      {/* Central sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={1}
        />
      </mesh>
      
      {planets.map((planet, index) => (
        <Planet
          key={index}
          {...planet}
        />
      ))}
    </>
  );
};

export default PlanetGroup;