// warpgate/InfoPanel.tsx
import React, { useEffect, useState } from 'react';
import { PlanetData } from './EnhancedPlanetGroup';
import styles from './InfoPanel.module.css'; 
import { motion, AnimatePresence } from 'framer-motion'; 

interface InfoPanelProps {
  planet: PlanetData;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ planet, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Show panel on mount
  }, []);

  const handleClose = () => {
    setVisible(false); // Trigger exit animation
    setTimeout(onClose, 500); // Wait for animation to finish before closing
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay detects external click */}
          <div className={styles.overlay} onClick={handleClose}></div>
          
          <motion.div
          className={styles.infoPanel}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2>{planet.label}</h2>
            <p>{planet.description || 'No description available.'}</p>
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