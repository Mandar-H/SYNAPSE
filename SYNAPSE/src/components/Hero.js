import React from 'react';
import { motion } from 'framer-motion';

const Hero = ({ theme, onLoginClick }) => {
  const scrollToTools = () => {
    const element = document.querySelector('#tools');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        padding: '64px 0 32px',
        background: 'transparent',
        position: 'relative'
      }}
    >
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        alignItems: 'center',
        gap: '32px'
      }}>
        {/* Hero Content */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              margin: '0 0 8px',
              fontSize: '56px',
              lineHeight: 1.05,
              letterSpacing: '-1px',
              color: theme === 'dark' ? '#d4d4d4' : '#101217',
              fontWeight: 800
            }}
          >
            S.Y.N.A.P.S.E
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{
              margin: '8px 0 20px',
              color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
              fontSize: '18px',
              lineHeight: 1.6
            }}
          >
            Fast, secure, and delightful AI tools to handle your documents: summarize, extract, classify, translate, transcribe, redact, and more.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
          >
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scrollToTools}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '12px',
                fontWeight: 600,
                border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                background: 'transparent',
                color: theme === 'dark' ? '#d4d4d4' : '#101217',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = theme === 'dark' ? '#d4d4d4' : '#101217';
                e.target.style.boxShadow = theme === 'dark' 
                  ? '0 6px 14px rgba(0,0,0,.12)' 
                  : '0 6px 14px rgba(16,24,40,.08)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = theme === 'dark' ? '#2f2f2f' : '#e5e8ef';
                e.target.style.boxShadow = 'none';
              }}
            >
              Explore tools
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: '14px' }}
              >
                →
              </motion.span>
            </motion.button>
            
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLoginClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 18px',
                borderRadius: '12px',
                fontWeight: 600,
                border: `1px solid ${theme === 'dark' ? '#007acc' : '#18a058'}`,
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, #007acc 0%, #005a9e 100%)' 
                  : 'linear-gradient(135deg, #18a058 0%, #0f7a3d 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: theme === 'dark' 
                  ? '0 8px 16px rgba(0, 122, 204, 0.35)' 
                  : '0 8px 16px rgba(24, 160, 88, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = theme === 'dark' 
                  ? '0 10px 18px rgba(0, 122, 204, 0.35)' 
                  : '0 10px 18px rgba(24, 160, 88, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = theme === 'dark' 
                  ? '0 8px 16px rgba(0, 122, 204, 0.35)' 
                  : '0 8px 16px rgba(24, 160, 88, 0.25)';
              }}
            >
              Get Started
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            style={{
              marginTop: '14px',
              color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: theme === 'dark' 
                  ? 'rgba(0,122,204,0.1)' 
                  : 'rgba(24,160,88,0.1)',
                border: `1px solid ${theme === 'dark' 
                  ? 'rgba(0,122,204,0.2)' 
                  : 'rgba(24,160,88,0.2)'}`,
                color: theme === 'dark' ? '#007acc' : '#18a058',
                fontWeight: 500
              }}
            >
              Runs in your browser
            </motion.span>
            <span style={{ opacity: 0.6 }}>•</span>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: theme === 'dark' 
                  ? 'rgba(255,59,59,0.1)' 
                  : 'rgba(255,107,53,0.1)',
                border: `1px solid ${theme === 'dark' 
                  ? 'rgba(255,59,59,0.2)' 
                  : 'rgba(255,107,53,0.2)'}`,
                color: theme === 'dark' ? '#ff3b3b' : '#ff6b35',
                fontWeight: 500
              }}
            >
              Privacy-first
            </motion.span>
          </motion.div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            position: 'relative',
            minHeight: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Floating Cards */}
          {[
            { id: 1, title: 'Summarize', icon: '📝', delay: 0, x: -60, y: -40 },
            { id: 2, title: 'Extract', icon: '📑', delay: 0.2, x: 40, y: -20 },
            { id: 3, title: 'Redact', icon: '🕶️', delay: 0.4, x: -20, y: 40 },
            { id: 4, title: 'Compress', icon: '🗜️', delay: 0.6, x: 60, y: 20 }
          ].map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: card.delay }}
              whileHover={{ scale: 1.1, y: -5 }}
              style={{
                position: 'absolute',
                left: `calc(50% + ${card.x}px)`,
                top: `calc(50% + ${card.y}px)`,
                width: '80px',
                height: '80px',
                background: theme === 'dark' ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                boxShadow: theme === 'dark' 
                  ? '0 10px 30px rgba(0,0,0,.35)' 
                  : '0 10px 30px rgba(16,24,40,.06)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = theme === 'dark' ? '#343b4f' : '#cfd6e5';
                e.target.style.background = theme === 'dark' ? '#191d28' : '#f8fafc';
                e.target.style.boxShadow = theme === 'dark' 
                  ? '0 16px 30px rgba(0,0,0,.25)' 
                  : '0 16px 30px rgba(16,24,40,.10)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = theme === 'dark' ? '#2f2f2f' : '#e5e8ef';
                e.target.style.background = theme === 'dark' ? '#2d2d2d' : '#ffffff';
                e.target.style.boxShadow = theme === 'dark' 
                  ? '0 10px 30px rgba(0,0,0,.35)' 
                  : '0 10px 30px rgba(16,24,40,.06)';
              }}
            >
              <div style={{ fontSize: '24px' }}>{card.icon}</div>
              <div style={{
                fontSize: '10px',
                color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                fontWeight: 500
              }}>
                {card.title}
              </div>
            </motion.div>
          ))}

          {/* Central Orb */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: theme === 'dark'
                ? 'radial-gradient(circle, rgba(0,122,204,0.3), rgba(0,122,204,0.1))'
                : 'radial-gradient(circle, rgba(24,160,88,0.3), rgba(24,160,88,0.1))',
              filter: 'blur(20px)',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          div {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 720px) {
          h1 {
            font-size: 42px !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default Hero;
