import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Footer = ({ theme }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerLinks = [
    { name: 'Privacy', href: '#privacy' },
    { name: 'Terms', href: '#terms' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        borderTop: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
        padding: '18px 0 30px',
        background: theme === 'dark' ? 'rgba(0,0,0,.2)' : '#ffffff',
        marginTop: '40px'
      }}
    >
      <div style={{
        maxWidth: '1120px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Brand */}
          <motion.div
            whileHover={{ y: -1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: theme === 'dark' ? '#d4d4d4' : '#101217',
              fontWeight: 700,
              letterSpacing: '0.2px'
            }}
          >
            <img
              src={process.env.PUBLIC_URL + '/logo.svg'}
              alt="Synapse Logo"
              style={{ width: 24, height: 24, borderRadius: 4, marginRight: 2 }}
            />
            <motion.span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                background: theme === 'dark'
                  ? 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(222,228,236,0.98) 55%, rgba(190,200,214,0.98) 100%)'
                  : 'linear-gradient(180deg, rgba(30,36,48,1) 0%, rgba(43,50,64,1) 55%, rgba(58,68,85,1) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: theme === 'dark' ? '0 1px 6px rgba(0,0,0,.18)' : 'none',
                position: 'relative'
              }}
              whileHover={{
                textShadow: theme === 'dark' ? '0 2px 10px rgba(0,0,0,.28)' : 'none'
              }}
              transition={{ duration: 0.3 }}
            >
              S.Y.N.A.P.S.E
            </motion.span>
          </motion.div>

          {/* Links */}
          <motion.ul
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              listStyle: 'none',
              display: 'flex',
              gap: '14px',
              margin: 0,
              padding: 0,
              justifyContent: 'flex-end'
            }}
          >
            {footerLinks.map((link, index) => (
              <motion.li
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <motion.a
                  href={link.href}
                  whileHover={{ y: -2 }}
                  style={{
                    color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                    textDecoration: 'none',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    display: 'block',
                    transition: 'all 0.2s ease',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = theme === 'dark' ? '#d4d4d4' : '#101217';
                    e.target.style.background = theme === 'dark' ? 'rgba(255,255,255,.04)' : 'rgba(16,24,40,.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = theme === 'dark' ? '#9aa0a6' : '#5f6673';
                    e.target.style.background = 'transparent';
                  }}
                >
                  {link.name}
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            gridColumn: '1 / -1',
            margin: '12px 0 0',
            color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
            fontSize: '13px',
            textAlign: 'center'
          }}
        >
          © {currentYear} Synapse. All rights reserved.
        </motion.p>

        {/* Animated elements */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '20px',
            fontSize: '16px',
            opacity: 0.4
          }}
        >
          
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '20px',
            fontSize: '14px',
            opacity: 0.3
          }}
        >
          ⚡
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 720px) {
          div {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          
          ul {
            justify-content: center !important;
            margin-top: 12px !important;
          }
        }
      `}</style>
    </motion.footer>
  );
};

export default Footer;
