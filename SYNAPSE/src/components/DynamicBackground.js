import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const DynamicBackground = ({ theme }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingOrbs = [
    { id: 1, size: 120, color: '#ff3b3b', delay: 0 },
    { id: 2, size: 80, color: '#6b8cff', delay: 0.5 },
    { id: 3, size: 60, color: '#18a058', delay: 1 },
    { id: 4, size: 100, color: '#ff6b35', delay: 1.5 },
    { id: 5, size: 70, color: '#8b5cf6', delay: 2 }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      background: theme === 'dark' 
        ? 'radial-gradient(1200px 800px at 80% -10%, #222933 0%, #1e1e1e 60%), #1e1e1e'
        : 'radial-gradient(1200px 800px at 80% -10%, rgba(28,126,214,.08) 0%, rgba(247,249,251,1) 60%), #f7f9fb',
      backgroundAttachment: 'fixed, fixed',
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundSize: '160% 160%, auto',
      backgroundPosition: '50% -10%, center'
    }}>
      {/* Floating orbs */}
      {floatingOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            filter: 'blur(24px)',
            opacity: theme === 'dark' ? 0.6 : 0.3,
            background: orb.color,
            left: `${20 + (orb.id * 15)}%`,
            top: `${10 + (orb.id * 20)}%`
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 8 + orb.id,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay
          }}
        />
      ))}

      {/* Mouse-following gradient */}
      <motion.div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: theme === 'dark' 
            ? 'radial-gradient(circle, rgba(0,122,204,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(24,160,88,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Subtle grid pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: theme === 'dark'
          ? 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)'
          : 'linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: 0.5
      }} />

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            borderRadius: '50%',
            background: theme === 'dark' ? '#007acc' : '#18a058',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.6
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default DynamicBackground;
