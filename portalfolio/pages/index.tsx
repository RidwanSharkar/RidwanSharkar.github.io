// pages/index.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import PlanetCanvas from '../warpgate/SpaceTime';

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen bg-gray-900">
      <Head>
        <title>Portalfolio</title>
        <meta name="description" content="My personal portalfolio with 3D portal animations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Full-screen 3D Canvas */}
      <PlanetCanvas />
    </div>
  );
};

export default Home;
