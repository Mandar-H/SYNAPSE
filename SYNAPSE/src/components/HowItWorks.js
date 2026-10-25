import React from 'react';
import { motion } from 'framer-motion';

const HowItWorks = ({ theme }) => {
  const steps = [
    {
      id: 1,
      title: 'Drop your files',
      description: 'Drag and drop PDFs, images, audio, or text. Your data stays private.',
      icon: '📁',
      animation: 'fileDrop'
    },
    {
      id: 2,
      title: 'Pick a tool',
      description: 'Choose from a catalog of powerful tools designed for common tasks.',
      icon: '⚙️',
      animation: 'rippleSelect'
    },
    {
      id: 3,
      title: 'Get instant results',
      description: 'Process in seconds. Download or continue in a workflow.',
      icon: '⚡',
      animation: 'sheenSweep'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section
      id="how-it-works"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      style={{
        padding: '32px 0',
        background: 'transparent'
      }}
    >
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '18px'
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={stepVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
              style={{
                background: theme === 'dark' ? '#2d2d2d' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                borderRadius: '14px',
                padding: '20px',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#343b4f';
                e.target.style.boxShadow = theme === 'dark' 
                  ? '0 10px 24px rgba(0,0,0,.22)' 
                  : '0 10px 24px rgba(16,24,40,.10)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = theme === 'dark' ? '#2f2f2f' : '#e5e8ef';
                e.target.style.boxShadow = 'none';
              }}
            >
              {/* Step Number */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: theme === 'dark' 
                    ? 'linear-gradient(135deg, #007acc, #6b8cff)'
                    : 'linear-gradient(135deg, #18a058, #36d399)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: theme === 'dark'
                    ? '0 4px 12px rgba(0,122,204,0.3)'
                    : '0 4px 12px rgba(24,160,88,0.3)'
                }}
              >
                {step.id}
              </motion.div>

              {/* Icon */}
              <motion.div
                whileHover={{ 
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.3 }
                }}
                style={{
                  fontSize: '32px',
                  marginBottom: '12px',
                  display: 'inline-block'
                }}
              >
                {step.icon}
              </motion.div>

              <motion.h3
                style={{
                  margin: '0 0 8px',
                  fontSize: '18px',
                  color: theme === 'dark' ? '#d4d4d4' : '#101217',
                  fontWeight: 600
                }}
              >
                {step.title}
              </motion.h3>

              <p style={{
                margin: 0,
                color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                fontSize: '14px',
                lineHeight: 1.5
              }}>
                {step.description}
              </p>

              {/* Step-specific animations */}
              {step.animation === 'fileDrop' && (
                <motion.div
                  initial={{ opacity: 0, y: -20, rotate: -10 }}
                  whileHover={{ 
                    opacity: 1, 
                    y: 0, 
                    rotate: -3,
                    transition: { duration: 0.5 }
                  }}
                  style={{
                    position: 'absolute',
                    top: '-36px',
                    right: '20px',
                    width: '22px',
                    height: '28px',
                    borderRadius: '3px',
                    background: theme === 'dark'
                      ? 'linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0))'
                      : 'linear-gradient(180deg, rgba(30,36,48,.22), rgba(30,36,48,0))',
                    border: theme === 'dark'
                      ? '1px solid rgba(255,255,255,.18)'
                      : '1px solid rgba(30,36,48,.18)',
                    boxShadow: theme === 'dark'
                      ? '0 10px 20px rgba(0,0,0,.35)'
                      : '0 10px 20px rgba(16,24,40,.20)',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {step.animation === 'rippleSelect' && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 0 }}
                  whileHover={{ 
                    scale: 3,
                    opacity: [0.4, 0.2, 0],
                    transition: { duration: 0.9, ease: "easeOut" }
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: theme === 'dark'
                      ? 'radial-gradient(circle, rgba(255,255,255,.28) 0%, rgba(255,255,255,.14) 35%, rgba(255,255,255,0) 60%)'
                      : 'radial-gradient(circle, rgba(30,36,48,.28) 0%, rgba(30,36,48,.16) 35%, rgba(30,36,48,0) 60%)',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {step.animation === 'sheenSweep' && (
                <motion.div
                  initial={{ x: '-55%', opacity: 0 }}
                  whileHover={{ 
                    x: '130%',
                    opacity: [0, 0.35, 0.18, 0],
                    transition: { duration: 1, ease: "easeInOut" }
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '-55%',
                    width: '55%',
                    background: theme === 'dark'
                      ? 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.18) 45%, rgba(255,255,255,0) 100%)'
                      : 'linear-gradient(100deg, rgba(30,36,48,0) 0%, rgba(30,36,48,.22) 45%, rgba(30,36,48,0) 100%)',
                    transform: 'skewX(-20deg)',
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Progress line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-9px',
                    width: '18px',
                    height: '2px',
                    background: theme === 'dark'
                      ? 'linear-gradient(90deg, #007acc, #6b8cff)'
                      : 'linear-gradient(90deg, #18a058, #36d399)',
                    transform: 'translateY(-50%)',
                    borderRadius: '1px'
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default HowItWorks;
