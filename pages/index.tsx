// pages/index.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import PlanetCanvas from '../warpgate/SpaceTime';
import InfoPanel from '../warpgate/InfoPanel';
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
    <div className="w-screen h-screen bg-gray-900 relative"> {/* Full-screen container */}
      <Head>
        <title>Planetfolio</title>
        <meta name="description" content="Ridwan Sharkar Landing Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Render PlanetCanvas with the onSelectPlanet handler */}
      <PlanetCanvas 
        onSelectPlanet={handleSelectPlanet} 
        selectedPlanet={selectedPlanet} // Add this line to fix the error
      />

      {/* Render InfoPanel as an overlay */}
      {selectedPlanet && (
        <InfoPanel
          planet={selectedPlanet.planet}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
};

export default HomePage;
