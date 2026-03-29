import React from 'react';
import { motion } from 'framer-motion';

const logos = [
  { name: 'Logo 1', url: '/logo1.png' },
  { name: 'Logo 2', url: '/logo2.png' },
  { name: 'Logo 3', url: '/logo3.png' },
  { name: 'Logo 4', url: '/logo4.png' },
  { name: 'Logo 5', url: '/logo5.png' },
  { name: 'Logo 6', url: '/logo6.png' },
  { name: 'Logo 7', url: '/logo7.png' },
  { name: 'Logo 8', url: '/logo8.png' },
  { name: 'Logo 9', url: '/logo9.png' },
  { name: 'Logo 10', url: '/logo10.png' },
];

export const LogoMarquee = () => {
  // Duplicate logos for seamless looping
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative w-full py-24 overflow-hidden bg-transparent">
      {/* Edge Fades */}
      <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      {/* Vertical Fades */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="flex items-center">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <div className="flex items-center gap-20 px-10">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`logo-${index}-${logo.name}`}
                className="flex items-center justify-center min-w-[120px] opacity-80 hover:opacity-100 transition-all duration-500 cursor-pointer group"
                style={{ height: '50px' }}
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110 brightness-110 contrast-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
