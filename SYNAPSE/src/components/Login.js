import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function NetworkBackground() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const nodesRef = useRef([]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const area = window.innerWidth * window.innerHeight;
    const targetCount = Math.max(28, Math.min(80, Math.floor(area / 18000)));
    const palette = ['#7c3aed', '#22d3ee', '#3a81f6'];
    const nodes = Array.from({ length: targetCount }).map((_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1.2 + Math.random() * 2.0,
      c: palette[i % palette.length],
    }));
    nodesRef.current = nodes;

    const velocities = nodes.map(() => ({
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    }));

    function draw() {
      const nodes = nodesRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const v = velocities[i];
        n.x += v.vx * 16;
        n.y += v.vy * 16;
        if (n.x < -20 || n.x > window.innerWidth + 20) v.vx *= -1;
        if (n.y < -20 || n.y > window.innerHeight + 20) v.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 140) {
            const alpha = 1 - dist / 140;
            ctx.strokeStyle = `rgba(168, 180, 220, ${alpha * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 14);
        grd.addColorStop(0, n.c);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3 + n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

const Login = ({ isOpen, onClose, theme, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleGoogle() { 
    alert("Google Sign-In is not wired yet. Hook to OAuth here."); 
  }
  
  function handleGithub() { 
    alert("GitHub Sign-In is not wired yet. Hook to OAuth here."); 
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      
      // Create user data object
      const userData = {
        email: email,
        name: email.split('@')[0], // Use email prefix as name
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=007acc&color=fff&size=128`
      };
      
      // Call the onLogin function passed from parent
      onLogin(userData);
    } finally {
      setIsSubmitting(false);
    }
  }

  const pageStyle = { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    display: 'grid', 
    placeItems: 'center', 
    padding: 24,
    zIndex: 1000,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)'
  };
  
  const bgStyle = { 
    position: 'absolute', 
    inset: 0, 
    overflow: 'hidden', 
    zIndex: 0 
  };
  
  const glassStyle = {
    width: '100%', 
    maxWidth: 440, 
    background: 'rgba(255,255,255,.06)', 
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 16, 
    backdropFilter: 'blur(16px)', 
    boxShadow: '0 10px 30px rgba(0,0,0,.35)', 
    padding: 28, 
    position: 'relative', 
    zIndex: 1
  };
  
  const brandStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    marginBottom: 16 
  };
  
  const brandImgStyle = { 
    width: 44, 
    height: 44, 
    borderRadius: '50%', 
    objectFit: 'contain' 
  };
  
  const titleStyle = { 
    textAlign: 'center', 
    margin: '0 0 4px 0', 
    fontSize: 22, 
    fontWeight: 700,
    color: '#e6e8ee'
  };
  
  const subtitleStyle = { 
    textAlign: 'center', 
    margin: '0 0 20px 0', 
    fontSize: 14, 
    color: '#a9afc3' 
  };
  
  const buttonStyle = { 
    width: '100%', 
    padding: '14px 16px', 
    borderRadius: 12, 
    border: '1px solid transparent', 
    fontWeight: 600, 
    fontSize: 15, 
    cursor: 'pointer' 
  };
  
  const btnGoogle = { 
    ...buttonStyle, 
    background: '#1a73e8', 
    color: '#fff', 
    boxShadow: '0 6px 20px rgba(26,115,232,.35)', 
    marginTop: 0 
  };
  
  const btnGithub = { 
    ...buttonStyle, 
    background: '#0d1117', 
    color: '#f0f6fc', 
    borderColor: 'rgba(240,246,252,.16)', 
    boxShadow: '0 6px 20px rgba(0,0,0,.4)', 
    marginTop: 12 
  };
  
  const btnSecondary = { 
    ...buttonStyle, 
    background: 'rgba(255,255,255,.06)', 
    color: '#e6e8ee', 
    borderColor: 'rgba(255,255,255,.12)', 
    marginTop: 12 
  };
  
  const formStyle = { 
    display: 'grid', 
    gap: 12 
  };
  
  const inputStyle = { 
    width: '100%', 
    padding: '12px 14px', 
    borderRadius: 10, 
    background: 'rgba(255,255,255,.06)', 
    color: '#e6e8ee', 
    border: '1px solid rgba(255,255,255,.12)', 
    outline: 'none' 
  };
  
  const helperStyle = { 
    margin: '10px 0 0 0', 
    textAlign: 'center', 
    color: '#9aa3bd', 
    fontSize: 12 
  };
  
  const footerStyle = { 
    textAlign: 'center', 
    marginTop: 16, 
    color: '#8c95b2', 
    fontSize: 12 
  };
  
  const dividerRow = { 
    display: 'grid', 
    gridTemplateColumns: '1fr auto 1fr', 
    alignItems: 'center', 
    gap: 12, 
    margin: '16px 0 10px', 
    color: '#94a0be', 
    fontSize: 12 
  };
  
  const lineStyle = { 
    height: 1, 
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)' 
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'transparent',
    border: 'none',
    color: '#e6e8ee',
    fontSize: 24,
    cursor: 'pointer',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    transition: 'background 0.2s ease'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={pageStyle}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <div style={bgStyle} aria-hidden>
            <NetworkBackground />
          </div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={glassStyle}
            role="dialog"
            aria-labelledby="login-title"
          >
            <button
              style={closeButtonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
              aria-label="Close login modal"
            >
              ×
            </button>
            
            <div style={brandStyle} aria-hidden>
              <img src={process.env.PUBLIC_URL + '/logo.svg'} alt="S.Y.N.A.P.S.E logo" style={brandImgStyle} />
              <strong style={{ color: '#e6e8ee' }}>S.Y.N.A.P.S.E</strong>
            </div>
            
            <h1 id="login-title" style={titleStyle}>Welcome to S.Y.N.A.P.S.E</h1>
            <p style={subtitleStyle}>Your private AI to simplify legal documents</p>

            <button style={btnGoogle} onClick={handleGoogle} aria-label="Continue with Google">
              Continue with Google
            </button>
            <button style={btnGithub} onClick={handleGithub} aria-label="Continue with GitHub">
              Continue with GitHub
            </button>

            <div style={dividerRow}>
              <div style={lineStyle} />
              <div>or continue with email</div>
              <div style={lineStyle} />
            </div>
            
            <form style={formStyle} onSubmit={handleSubmit}>
              <label>
                <input 
                  style={inputStyle} 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  autoComplete="email" 
                />
              </label>
              <label>
                <input 
                  style={inputStyle} 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  autoComplete="current-password" 
                  minLength={6} 
                />
              </label>
              <button 
                style={btnSecondary} 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in…" : "Continue with email"}
              </button>
            </form>

            <p style={helperStyle}>
              By continuing you agree to our <a href="#" style={{ color: '#007acc' }}>Terms</a> and <a href="#" style={{ color: '#007acc' }}>Privacy</a>.
            </p>
            <p style={footerStyle}>© 2025 S.Y.N.A.P.S.E</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;
