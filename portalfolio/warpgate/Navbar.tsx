// warpgate/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="absolute top-0 w-full flex justify-end p-4 space-x-4">
      <Link href="https://www.linkedin.com/in/your-profile">
        <a className="text-white hover:text-blue-400">LinkedIn</a>
      </Link>
      <Link href="https://github.com/your-username">
        <a className="text-white hover:text-blue-400">GitHub</a>
      </Link>
      <Link href="https://your-art-portfolio.com">
        <a className="text-white hover:text-blue-400">Art Portfolio</a>
      </Link>
      <Link href="https://instagram.com/your-profile">
        <a className="text-white hover:text-blue-400">Instagram</a>
      </Link>
    </nav>
  );
};

export default Navbar;
