// warpgate/InfoPanel.tsx
import React, { useEffect, useState } from 'react';
import { PlanetData } from './EnhancedPlanetGroup';
import styles from './InfoPanel.module.css'; // Import the CSS Module
import { motion, AnimatePresence } from 'framer-motion'; // Optional for enhanced animations

interface InfoPanelProps {
  planet: PlanetData;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation after component mounts
    setVisible(true);
  }, []);

  // Optional: Use framer-motion for more advanced animations
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.infoPanel} // Use CSS Module class
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <h2>{planet.label}</h2>
          <p>{planet.description || 'No description available.'}</p>
          <a href={planet.link} target="_blank" rel="noopener noreferrer" className={styles.infoButton}>
            Visit
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoPanel;
