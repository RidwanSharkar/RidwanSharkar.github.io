// pages/index.tsx

import type { NextPage } from 'next';
import Head from 'next/head';
import PortalCanvas from '../warpgate/PortalCanvas';

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen bg-gray-900">
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="My personal portfolio with 3D portal animations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Full-screen 3D Canvas */}
      <PortalCanvas />
    </div>
  );
};

export default Home;
