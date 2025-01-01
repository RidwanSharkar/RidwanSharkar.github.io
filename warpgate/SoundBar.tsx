// warpgate/SoundBar.tsx

import React, { useEffect, useState } from 'react';
import styles from './InfoPanel.module.css'; 
import { motion, AnimatePresence } from 'framer-motion'; 

interface FixedInfoPanelProps {
  content: React.ReactNode;
  onClose?: () => void;
}

const FixedInfoPanel: React.FC<FixedInfoPanelProps> = ({ content }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Show on mount
  }, []);


  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.fixedBottomLeftPanel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FixedInfoPanel;
