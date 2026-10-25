import React from 'react';
import { motion } from 'framer-motion';

const Tools = ({ theme }) => {
  const tools = [
    {
      id: 1,
      icon: '📝',
      title: 'Summarize',
      description: 'Compress long documents into crisp, accurate summaries.',
      color: '#ff3b3b'
    },
    {
      id: 2,
      icon: '📑',
      title: 'Extract',
      description: 'Pull key fields, entities, and tables from PDFs and images.',
      color: '#6b8cff'
    },
    {
      id: 3,
      icon: '🕶️',
      title: 'Redact',
      description: 'Remove PII with smart detection and review.',
      color: '#8b5cf6'
    },
    {
      id: 4,
      icon: '🗜️',
      title: 'Compress',
      description: 'Shrink PDFs for fast sharing without quality loss.',
      color: '#18a058'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      id="tools"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      style={{
        padding: '32px 0 20px',
        scrollMarginTop: '80px'
      }}
    >
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '28px',
            margin: '8px 0 18px',
            letterSpacing: '-0.2px',
            color: theme === 'dark' ? '#d4d4d4' : '#101217',
            fontWeight: 700
          }}
        >
          Popular tools
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px'
          }}
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '16px',
                background: theme === 'dark' ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#343b4f';
                e.target.style.background = theme === 'dark' ? '#191d28' : '#f8fafc';
                e.target.style.boxShadow = theme === 'dark' 
                  ? '0 16px 30px rgba(0,0,0,.25)' 
                  : '0 16px 30px rgba(16,24,40,.10)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = theme === 'dark' ? '#2f2f2f' : '#e5e8ef';
                e.target.style.background = theme === 'dark' ? '#2d2d2d' : '#ffffff';
                e.target.style.boxShadow = 'none';
              }}
            >
              {/* Hover Effect Overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.3 }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${tool.color}20, transparent)`,
                  borderRadius: '14px',
                  pointerEvents: 'none'
                }}
              />

              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.3 }
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '22px',
                  background: theme === 'dark' ? '#1c2030' : '#eef2f7',
                  borderRadius: '10px',
                  border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                  flexShrink: 0
                }}
              >
                {tool.icon}
              </motion.div>

              <div style={{ flex: 1 }}>
                <motion.h3
                  whileHover={{ color: tool.color }}
                  style={{
                    margin: '0 0 4px',
                    fontSize: '16px',
                    color: theme === 'dark' ? '#d4d4d4' : '#101217',
                    fontWeight: 600,
                    transition: 'color 0.2s ease'
                  }}
                >
                  {tool.title}
                </motion.h3>
                <p style={{
                  margin: 0,
                  color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                  fontSize: '14px',
                  lineHeight: 1.4
                }}>
                  {tool.description}
                </p>
              </div>

              {/* Animated border */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, ${tool.color}, ${tool.color}80)`,
                  borderRadius: '0 0 14px 14px',
                  transformOrigin: 'left'
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          div {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (max-width: 720px) {
          div {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 420px) {
          div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default Tools;
