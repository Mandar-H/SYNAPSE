import React from 'react';
import { motion } from 'framer-motion';

const Pricing = ({ theme }) => {
  const features = [
    'All tools included',
    'Privacy-first processing',
    'Email support'
  ];

  return (
    <motion.section
      id="pricing"
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
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          Simple pricing
        </motion.h2>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <motion.div
            whileHover={{ 
              y: -5,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            style={{
              background: theme === 'dark'
                ? 'linear-gradient(180deg, rgba(255,59,59,0.06), rgba(255,255,255,0))'
                : 'linear-gradient(180deg, rgba(24,160,88,0.06), rgba(255,255,255,0))',
              border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: theme === 'dark' 
                ? '0 10px 30px rgba(0,0,0,.35)' 
                : '0 10px 30px rgba(16,24,40,.06)',
              maxWidth: '400px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated background gradient */}
            <motion.div
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(0,122,204,0.1), rgba(107,140,255,0.1))',
                  'linear-gradient(45deg, rgba(107,140,255,0.1), rgba(255,59,59,0.1))',
                  'linear-gradient(45deg, rgba(255,59,59,0.1), rgba(24,160,88,0.1))',
                  'linear-gradient(45deg, rgba(24,160,88,0.1), rgba(0,122,204,0.1))'
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.3,
                pointerEvents: 'none'
              }}
            />

            {/* Price */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                marginBottom: '16px',
                justifyContent: 'center'
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: theme === 'dark' ? '#d4d4d4' : '#101217',
                  background: theme === 'dark'
                    ? 'linear-gradient(135deg, #007acc, #6b8cff)'
                    : 'linear-gradient(135deg, #18a058, #36d399)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                Free
              </motion.span>
              <span style={{
                color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                fontSize: '16px'
              }}>
                • Unlimited small files
              </span>
            </motion.div>

            {/* Features */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{
                margin: '12px 0 20px',
                paddingLeft: '18px',
                color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                listStyle: 'none'
              }}
            >
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  style={{
                    margin: '8px 0',
                    position: 'relative',
                    paddingLeft: '20px'
                  }}
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: theme === 'dark'
                        ? 'linear-gradient(135deg, #007acc, #6b8cff)'
                        : 'linear-gradient(135deg, #18a058, #36d399)',
                      boxShadow: theme === 'dark'
                        ? '0 0 8px rgba(0,122,204,0.4)'
                        : '0 0 8px rgba(24,160,88,0.4)'
                    }}
                  />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.button
              whileHover={{ 
                y: -2,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '12px',
                fontWeight: 600,
                border: 'none',
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, #007acc, #6b8cff)'
                  : 'linear-gradient(135deg, #18a058, #36d399)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                boxShadow: theme === 'dark'
                  ? '0 8px 16px rgba(0,122,204,0.3)'
                  : '0 8px 16px rgba(24,160,88,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = theme === 'dark'
                  ? '0 10px 18px rgba(0,122,204,0.4)'
                  : '0 10px 18px rgba(24,160,88,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = theme === 'dark'
                  ? '0 8px 16px rgba(0,122,204,0.3)'
                  : '0 8px 16px rgba(24,160,88,0.3)';
              }}
            >
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ display: 'inline-block' }}
              >
                Start now →
              </motion.span>
            </motion.button>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                fontSize: '24px',
                opacity: 0.6
              }}
            >
              ✨
            </motion.div>

            <motion.div
              animate={{
                y: [0, 8, 0],
                rotate: [0, -3, 0]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                fontSize: '20px',
                opacity: 0.4
              }}
            >
              🚀
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Pricing;
