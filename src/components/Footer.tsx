// components/Footer.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  path: string;
  label: string;
  svg: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Home',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3z" />
      </svg>
    ),
  },
  {
    path: '/create-bet',
    label: 'Create',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    path: '/wallet',
    label: 'Wallet',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1" />
        <path d="M16 16h6" />
      </svg>
    ),
  },
  {
    path: '/history',
    label: 'History',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l4 2" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Profile',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M4 21v-2a4 4 0 0 1 3-3.87" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const Footer = () => {
  const pathname = usePathname(); // Next.js hook for current route

  return (
    <>
      <footer className="fixed bottom-6 left-1/2 transform -translate-x-1/2 
        bg-gray-800/90 backdrop-blur-xl rounded-2xl 
        shadow-2xl border border-gray-700/50 
        w-full max-w-md mx-auto px-1 py-2
        flex justify-around items-center
        z-50"
      >
        {navItems.map(({ path, label, svg }) => {
          const isActive = pathname === path;

          return (
            <Link
              href={path}
              key={path}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl text-xs font-medium transition-all duration-300
                ${isActive 
                  ? 'text-white bg-blue-600 shadow-lg scale-105' 
                  : 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                }
              `}
            >
              <span
                className={`transition-all duration-300 ${
                  isActive ? 'drop-shadow-lg' : ''
                }`}
              >
                {svg}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </footer>

      {/* Optional: Add padding at bottom of body so content isn't hidden */}
      <div className="h-20" />
    </>
  );
};

export default Footer;