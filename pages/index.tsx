// pages/index.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import PlanetCanvas from '../warpgate/SpaceTime';
import InfoPanel from '../warpgate/InfoPanel';
import FixedInfoPanel from '../warpgate/SoundBar'; 
import AudioPlayer from '../warpgate/SoundPlayer'; 
import { PlanetData } from '../warpgate/EnhancedPlanetGroup';

const HomePage: NextPage = () => {
  const [selectedPlanet, setSelectedPlanet] = useState<{ index: number; planet: PlanetData } | null>(null);

  const handleSelectPlanet = (index: number, planet: PlanetData) => {
    setSelectedPlanet(prev => (prev?.index === index ? null : { index, planet }));
  };

  const handleClosePanel = () => {
    setSelectedPlanet(null);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 relative"> 
      <Head>
        <title>Planetfolio</title>
        <meta name="description" content="Ridwan Sharkar Landing Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PlanetCanvas 
        onSelectPlanet={handleSelectPlanet} 
        selectedPlanet={selectedPlanet}
      />

      {/* InfoPanel overlay */}
      {selectedPlanet && (
        <InfoPanel
          planet={selectedPlanet.planet}
          onClose={handleClosePanel}
        />
      )}

      {/* Fixed Bottom Panel */}
      <FixedInfoPanel
        content={
          <div>
            
            {/* Audio Player */}
            <AudioPlayer src="/audio/track3.MP3" />

            
          </div>
        }
      />
    </div>
  );
};

export default HomePage;
