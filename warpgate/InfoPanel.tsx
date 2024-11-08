// warpgate/InfoPanel.tsx
import React, { useEffect, useState } from 'react';
import { PlanetData } from './EnhancedPlanetGroup';
import styles from './InfoPanel.module.css'; 
import { motion, AnimatePresence } from 'framer-motion'; 

interface InfoPanelProps {
  planet: PlanetData;
  onClose: () => void;
}

// Converters, scaled to solar system
const convertSize = (size: number): string => {
  const miles = Math.round(size * 12000);
  return `${miles.toLocaleString()} miles`;
};

const convertSpeed = (speed: number, planetLabel: string): string => {
  const speeds: { [key: string]: number } = {
    'Fretboard-x': 76775,
    'LinkedIn': 62250,
    'GitHub': 21500,
    'Unknown': 21500,
    'Instagram': 59670,
    'Mythos.store': 89112,
  };
  return `${speeds[planetLabel]?.toLocaleString() || 0} mph`;
};

const convertDistance = (distance: number): string => {
  const miles = distance * 100_000_000;
  return `${miles.toExponential(2)} miles`;
};

// Replace the calculateTemperature function with this:
const getPlanetTemperature = (planetLabel: string): string => {
  const temperatures: { [key: string]: number } = {
    'Fretboard-x': 420,
    'LinkedIn': 69,
    'GitHub': 11,
    'Unknown': 262,
    'Instagram': -41,
    'Mythos.store': -89,
  };
  
  return `${temperatures[planetLabel] || 0}°F`;
};

//LOOSEAF
const getAtmosphereComposition = (planetColor: string): string => {
  const atmospheres: { [key: string]: string } = {
    '#B7D3F2': '• Nitrogen (78%)\n• Oxygen (21%)\n• Argon (1%)\n• Earth-like',
    '#4FB8FF': '• Nitrogen (80%)\n• Methane (15%)\n• Hydrogen (5%)',
    '#8980F5': '• Hydrogen (75%)\n• Helium (24%)\n• Methane (1%)',
    '#84DCC6': '• Carbon Dioxide (95%)\n• Nitrogen (3%)\n• Argon (2%)',
    '#F4ACB7': '• Sulfur Dioxide (80%)\n• Carbon Dioxide (15%)\n• Helium (5%)',
    '#2DE1FC': '• Helium (60%)\n• Hydrogen (30%)\n• Methane (10%)'
  };
  return atmospheres[planetColor]?.split('\n').map(line => 
    `<div style="margin-left: 1rem">${line}</div>`
  ).join('') || 'Unknown composition';
};

const getPlanetMass = (planetLabel: string): string => {
  const masses: { [key: string]: number } = {
    'Fretboard-x': 1.4e24,
    'LinkedIn': 1.7e25,
    'GitHub': 2.2e26,
    'Unknown': 1.5e25,
    'Instagram': 1.3e26,
    'Mythos.store': 9.8e24,
  };
  const mass = masses[planetLabel];
  return mass ? `${mass.toExponential(2)} lbs` : 'Unknown mass';
};

const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 500);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <div className={styles.overlay} onClick={handleClose}></div>
          
          <motion.div
            className={styles.statsPanel}
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={styles.statsTitle}>{"{ "}{planet.label}{" }"}</h3>
            <div className={`${styles.statsGrid} text-sm`}>
              <div><span>Mass:</span> <span>{getPlanetMass(planet.label)}</span></div>
              <div><span>Diameter:</span> <span>{convertSize(planet.size)}</span></div>
              <div><span>Orbital Speed:</span> <span>{convertSpeed(planet.orbitSpeed, planet.label)}</span></div>
              <div><span>Orbital Radius:</span> <span>{convertDistance(planet.orbitRadius)}</span></div>
              <div><span>Mean Temperature:</span> <span>{getPlanetTemperature(planet.label)}</span></div>
              <div>
                <span>Atmospheric Emission Spectrum:</span>
                <div dangerouslySetInnerHTML={{ __html: getAtmosphereComposition(planet.planetColor) }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.infoPanel}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.infoPanelContent}>
              <div className={styles.planetIcon}>
                <img 
                  src={planet.logoTexturePath || '/textures/transparent.png'} 
                  alt={`${planet.label} icon`}
                  width={42}
                  height={42}
                />
              </div>
              <div>
                <h2>{planet.label}</h2>
                <p>{planet.description || 'No description available.'}</p>
              </div>
            </div>
            <a href={planet.link} target="_blank" rel="noopener noreferrer" className={styles.infoButton}>
              Visit
            </a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;