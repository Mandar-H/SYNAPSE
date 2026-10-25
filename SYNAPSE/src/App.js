import React, { useState, useEffect } from 'react';
import './components/help_button.css';
import { motion } from 'framer-motion';
import './index.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Tools from './components/Tools';
import HowItWorks from './components/HowItWorks';
// import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';
import DynamicBackground from './components/DynamicBackground';
import Login from './components/Login';
import UploadForm from './components/UploadForm';
// Dynamically load the help_button.js script and initialize the help button
function useHelpButton() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'src/components/help_button.js';
    script.async = true;
    script.onload = () => {
      if (window.initHelpButton) window.initHelpButton();
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
}

function App() {
  useHelpButton();
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Load authentication state from localStorage
    const savedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const savedUser = localStorage.getItem('user');
    if (savedAuth && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setIsLoginOpen(false);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: theme === 'dark' ? '#1e1e1e' : '#f7f9fb',
        color: theme === 'dark' ? '#d4d4d4' : '#101217'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${theme === 'dark' ? '#007acc' : '#18a058'}`,
            borderTop: '3px solid transparent',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <div className={`app ${theme === 'light' ? 'theme-light' : ''}`}>
      <DynamicBackground theme={theme} />
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onLoginClick={() => setIsLoginOpen(true)}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
      <main>
        <Hero theme={theme} onLoginClick={() => setIsLoginOpen(true)} />
  <CTA theme={theme} user={user} />
  <UploadForm theme={theme} user={user} />
  <Tools theme={theme} />
        <HowItWorks theme={theme} />
         {/* <Pricing theme={theme} /> */}
      </main>
      <Footer theme={theme} />
      
      {/* Login Modal */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        theme={theme}
        onLogin={handleLogin}
      />
      
      {/* Floating Help Button */}
      <div className="help-button" style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 100 }}>
        <div style={{ position: 'relative' }}>
          <button id="help-toggle" aria-label="Help"
            onMouseEnter={() => {
              const desc = document.getElementById('help-desc-box');
              if (desc) desc.style.opacity = 1;
            }}
            onMouseLeave={() => {
              const desc = document.getElementById('help-desc-box');
              if (desc) desc.style.opacity = 0;
            }}
          >
            ?
            <div id="particleContainer" className="particle-container"></div>
          </button>
          <div
            id="help-desc-box"
            style={{
              position: 'absolute',
              right: '110%',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(30, 30, 30, 0.85)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 14,
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.2s',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              zIndex: 101,
            }}
          >
            ai_desk
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
