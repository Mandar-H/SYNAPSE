import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Header = ({ theme, toggleTheme, onLoginClick, isAuthenticated, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { name: 'Tools', href: '#tools' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Docs', href: '#docs' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('[data-profile-dropdown]')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: theme === 'dark' 
          ? 'rgba(11,12,16,.6)' 
          : 'rgba(255,255,255,.85)',
        backdropFilter: 'saturate(140%) blur(10px)',
        borderBottom: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
        padding: '0 20px'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        maxWidth: '1120px',
        margin: '0 auto'
      }}>
        {/* Brand */}
        <motion.a
          href="#"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
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
            style={{ width: 28, height: 28, borderRadius: 6, marginRight: 2 }}
          />
          <motion.span
            style={{
              fontSize: '18px',
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
        </motion.a>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Desktop Menu */}
          <ul style={{
            display: 'flex',
            listStyle: 'none',
            gap: '18px',
            margin: 0,
            padding: 0
          }}>
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  whileHover={{ y: -2 }}
                  style={{
                    color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                    textDecoration: 'none',
                    fontWeight: 500,
                    padding: '6px 8px',
                    borderRadius: '8px',
                    display: 'block',
                    transition: 'all 0.2s ease'
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
                  {item.name}
                </motion.a>
              </motion.li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '4px',
              background: 'transparent',
              border: 0,
              padding: '8px',
              cursor: 'pointer'
            }}
            className="mobile-menu-toggle"
          >
            <motion.span
              animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
              style={{
                width: '20px',
                height: '2px',
                background: theme === 'dark' ? '#d4d4d4' : '#101217',
                display: 'block'
              }}
            />
            <motion.span
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
              style={{
                width: '20px',
                height: '2px',
                background: theme === 'dark' ? '#d4d4d4' : '#101217',
                display: 'block'
              }}
            />
            <motion.span
              animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
              style={{
                width: '20px',
                height: '2px',
                background: theme === 'dark' ? '#d4d4d4' : '#101217',
                display: 'block'
              }}
            />
          </motion.button>

          {/* Profile Button or Sign up/Log in Button */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} data-profile-dropdown>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                  background: theme === 'dark' ? '#2d2d2d' : '#ffffff',
                  color: theme === 'dark' ? '#d4d4d4' : '#101217',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: theme === 'dark' 
                    ? '0 4px 12px rgba(0,0,0,.2)' 
                    : '0 4px 12px rgba(16,24,40,.08)'
                }}
              >
                <img
                  src={user?.avatar}
                  alt="Profile"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <span style={{ fontSize: '14px' }}>{user?.name}</span>
                <motion.div
                  animate={{ rotate: isProfileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: '12px' }}
                >
                  ▼
                </motion.div>
              </motion.button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '8px',
                    background: theme === 'dark' ? '#252526' : '#ffffff',
                    border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '180px',
                    boxShadow: theme === 'dark' 
                      ? '0 10px 30px rgba(0,0,0,.35)' 
                      : '0 10px 30px rgba(16,24,40,.06)',
                    zIndex: 1000
                  }}
                >
                  <div style={{
                    padding: '8px 12px',
                    borderBottom: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      color: theme === 'dark' ? '#d4d4d4' : '#101217',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}>
                      {user?.name}
                    </div>
                    <div style={{
                      color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                      fontSize: '12px'
                    }}>
                      {user?.email}
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onLogout();
                      setIsProfileOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 500,
                      border: 'none',
                      background: 'transparent',
                      color: theme === 'dark' ? '#ff3b3b' : '#ef4444',
                      cursor: 'pointer',
                      fontSize: '14px',
                      textAlign: 'left',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = theme === 'dark' ? 'rgba(255,59,59,0.1)' : 'rgba(239,68,68,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    Sign out
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLoginClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 600,
                border: `1px solid ${theme === 'dark' ? '#007acc' : '#18a058'}`,
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, #007acc 0%, #005a9e 100%)' 
                  : 'linear-gradient(135deg, #18a058 0%, #0f7a3d 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                minWidth: '120px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: theme === 'dark' 
                  ? '0 4px 12px rgba(0, 122, 204, 0.3)' 
                  : '0 4px 12px rgba(24, 160, 88, 0.3)'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: '14px' }}
              >
                👤
              </motion.div>
              Sign up/Log in
            </motion.button>
          )}

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              fontWeight: 600,
              border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
              background: 'transparent',
              color: theme === 'dark' ? '#d4d4d4' : '#101217',
              cursor: 'pointer',
              minWidth: '84px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div
              animate={{ rotate: theme === 'light' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: '14px' }}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </motion.div>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </motion.button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          right: '20px',
          top: '64px',
          background: theme === 'dark' ? '#252526' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
          borderRadius: '12px',
          padding: '10px',
          minWidth: '180px',
          boxShadow: theme === 'dark' 
            ? '0 10px 30px rgba(0,0,0,.35)' 
            : '0 10px 30px rgba(16,24,40,.06)',
          overflow: 'hidden'
        }}
        className="mobile-menu"
      >
        {navItems.map((item, index) => (
          <motion.a
            key={item.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 20 }}
            transition={{ delay: index * 0.1 }}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(item.href);
            }}
            style={{
              display: 'block',
              padding: '8px 12px',
              color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '4px'
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
            {item.name}
          </motion.a>
        ))}
        
        {/* Mobile Profile or Sign up/Log in Button */}
        {isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 20 }}
            transition={{ delay: navItems.length * 0.1 }}
            style={{
              marginTop: '8px',
              padding: '8px 12px',
              border: `1px solid ${theme === 'dark' ? '#2f2f2f' : '#e5e8ef'}`,
              borderRadius: '8px',
              background: theme === 'dark' ? '#2d2d2d' : '#ffffff'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <img
                src={user?.avatar}
                alt="Profile"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div>
                <div style={{
                  color: theme === 'dark' ? '#d4d4d4' : '#101217',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  {user?.name}
                </div>
                <div style={{
                  color: theme === 'dark' ? '#9aa0a6' : '#5f6673',
                  fontSize: '12px'
                }}>
                  {user?.email}
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                fontWeight: 500,
                border: 'none',
                background: 'transparent',
                color: theme === 'dark' ? '#ff3b3b' : '#ef4444',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = theme === 'dark' ? 'rgba(255,59,59,0.1)' : 'rgba(239,68,68,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              Sign out
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : 20 }}
            transition={{ delay: navItems.length * 0.1 }}
            onClick={() => {
              onLoginClick();
              setIsMenuOpen(false);
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 12px',
              marginTop: '8px',
              borderRadius: '8px',
              fontWeight: 600,
              border: `1px solid ${theme === 'dark' ? '#007acc' : '#18a058'}`,
              background: theme === 'dark' 
                ? 'linear-gradient(135deg, #007acc 0%, #005a9e 100%)' 
                : 'linear-gradient(135deg, #18a058 0%, #0f7a3d 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            👤 Sign up/Log in
          </motion.button>
        )}
      </motion.div>

      <style jsx>{`
        @media (max-width: 720px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
          
          nav ul {
            display: none !important;
          }
          
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </motion.header>
  );
};

export default Header;
