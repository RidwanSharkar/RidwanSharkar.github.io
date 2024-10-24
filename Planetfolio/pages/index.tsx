// pages/index.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import PlanetCanvas from '../warpgate/SpaceTime';

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen bg-gray-900">
      <Head>
        <title>Planetfolio</title>
        <meta name="description" content="Ridwan Sharkar Landing Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Full-screen 3D Canvas */}
      <PlanetCanvas />
    </div>
  );
};

export default Home;
