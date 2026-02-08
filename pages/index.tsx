// pages/index.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import PlanetCanvas from '../warpgate/SpaceTime';
import InfoPanel from '../warpgate/InfoPanel';
import FixedInfoPanel from '../warpgate/SoundBar'; 
import AudioPlayer from '../warpgate/SoundPlayer'; 
import TimeWarp from '../warpgate/TimeWarp';
import { PlanetData } from '../warpgate/EnhancedPlanetGroup';
import styles from '../styles/NebulaToggle.module.css';
import panelStyles from '../warpgate/InfoPanel.module.css';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage: NextPage = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<{ index: number; planet: PlanetData } | null>(null);
  const [showNebulas, setShowNebulas] = useState(true);
  const [timeScale, setTimeScale] = useState(1);

  const handleSelectPlanet = (index: number, planet: PlanetData) => {
    setSelectedPlanet(prev => (prev?.index === index ? null : { index, planet }));
  };

  const handleClosePanel = () => {
    setSelectedPlanet(null);
  };

  const toggleNebulas = () => {
    setShowNebulas(prev => !prev);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 relative"> 
      <Head>
        <title>Planetfolio</title>
        <meta name="description" content="Ridwan Sharkar Landing Page" />
        <link rel="icon" type="image/svg+xml" href="/textures/mythos.png" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>

      <PlanetCanvas 
        onSelectPlanet={handleSelectPlanet} 
        selectedPlanet={selectedPlanet}
        showNebulas={showNebulas}
        timeScale={timeScale}
      />

      {/* InfoPanel overlay */}
      {selectedPlanet && (
        <InfoPanel
          planet={selectedPlanet.planet}
          onClose={handleClosePanel}
        />
      )}

      {/* Toggle Nebulas Button */}
      <button
        onClick={toggleNebulas}
        className={`${styles.nebulaToggle} ${showNebulas ? styles.active : ''}`}
      >
        <span className={styles.label}>𖥂</span>
        <span className={styles.toggle}>
          <span className={styles.toggleIndicator}></span>
        </span>
      </button>

      {/* Fixed Bottom Panel */}
      <FixedInfoPanel
        content={
          <div>
            
            {/* Audio Player */}
            <AudioPlayer src="/audio/track3.MP3" />

            
          </div>
        }
      />

      {/* Time Warp Center Panel */}
      <AnimatePresence>
        <motion.div
          className={panelStyles.fixedBottomCenterPanel}
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ duration: 0.5 }}
        >
          <TimeWarp value={timeScale} onChange={setTimeScale} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
