// components/PortalGroup.tsx


import Portal from './Portal';

// Define the structure of each portal's data
interface PortalData {
  position: [number, number, number]; // Tuple of exactly three numbers
  link: string;
  label: string;
}

// components/PortalGroup.tsx

const PortalGroup: React.FC = () => {
        const portals: PortalData[] = [
          {
            position: [-2, 0, 0], // [number, number, number]
            link: 'https://www.linkedin.com/in/RidwanSharkar',
            label: 'LinkedIn',
          },
          {
            position: [0, 0, 0], // [number, number, number]
            link: 'https://github.com/RidwanSharkar',
            label: 'GitHub',
          },
          {
            position: [2, 0, 0], // [number, number, number]
            link: 'https://mythos.store',
            label: 'Art Portfolio',
          },
          {
            position: [0, -2, 0], // [number, number, number]
            link: 'https://instagram.com/ridwansharkar/?hl=en',
            label: 'Instagram',
          },
        ];

      
        return (
          <>
            {portals.map((portal, index) => (
              <Portal
                key={index}
                position={portal.position}
                link={portal.link}
                label={portal.label}
              />
            ))}
          </>
        );
      };
      
      export default PortalGroup;
      