import React, { useRef, useEffect, useState } from 'react'

function NetworkBackground() {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const nodesRef = useRef([])

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const area = window.innerWidth * window.innerHeight
    const targetCount = Math.max(28, Math.min(80, Math.floor(area / 18000)))
    const palette = ['#7c3aed', '#22d3ee', '#3a81f6']
    const nodes = Array.from({ length: targetCount }).map((_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1.2 + Math.random() * 2.0,
      c: palette[i % palette.length],
    }))
    nodesRef.current = nodes

    const velocities = nodes.map(() => ({
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35
    }))

    function draw() {
      const nodes = nodesRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const v = velocities[i]
        n.x += v.vx * 16
        n.y += v.vy * 16
        if (n.x < -20 || n.x > window.innerWidth + 20) v.vx *= -1
        if (n.y < -20 || n.y > window.innerHeight + 20) v.vy *= -1
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 140) {
            const alpha = 1 - dist / 140
            ctx.strokeStyle = `rgba(168, 180, 220, ${alpha * 0.35})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 14)
        grd.addColorStop(0, n.c)
        grd.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(n.x, n.y, 3 + n.r, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} />
}

export default function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Apply page-level styles without external CSS
  useEffect(() => {
    const prevMargin = document.body.style.margin
    const prevFont = document.body.style.fontFamily
    const prevColor = document.body.style.color
    const prevBg = document.body.style.background
    const prevH = document.documentElement.style.height
    const prevBH = document.body.style.height
    document.documentElement.style.height = '100%'
    document.body.style.height = '100%'
    document.body.style.margin = '0'
    document.body.style.fontFamily = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
    document.body.style.color = '#e6e8ee'
    document.body.style.background = 'linear-gradient(180deg, #0b1428 0%, #0a0f1f 100%)'
    return () => {
      document.body.style.margin = prevMargin
      document.body.style.fontFamily = prevFont
      document.body.style.color = prevColor
      document.body.style.background = prevBg
      document.documentElement.style.height = prevH
      document.body.style.height = prevBH
    }
  }, [])

  function handleGoogle() { alert("Google Sign-In is not wired yet. Hook to OAuth here.") }
  function handleGithub() { alert("GitHub Sign-In is not wired yet. Hook to OAuth here.") }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 800))
      alert(`Logged in as ${email}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const pageStyle = { position: 'relative', display: 'grid', placeItems: 'center', minHeight: '100vh', padding: 24 }
  const bgStyle = { position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }
  const glassStyle = {
    width: '100%', maxWidth: 440, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 16, backdropFilter: 'blur(16px)', boxShadow: '0 10px 30px rgba(0,0,0,.35)', padding: 28, position: 'relative', zIndex: 1
  }
  const brandStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }
  const brandImgStyle = { width: 44, height: 44, borderRadius: '50%', objectFit: 'contain' }
  const titleStyle = { textAlign: 'center', margin: '0 0 4px 0', fontSize: 22, fontWeight: 700 }
  const subtitleStyle = { textAlign: 'center', margin: '0 0 20px 0', fontSize: 14, color: '#a9afc3' }
  const buttonStyle = { width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid transparent', fontWeight: 600, fontSize: 15, cursor: 'pointer' }
  const btnGoogle = { ...buttonStyle, background: '#1a73e8', color: '#fff', boxShadow: '0 6px 20px rgba(26,115,232,.35)', marginTop: 0 }
  const btnGithub = { ...buttonStyle, background: '#0d1117', color: '#f0f6fc', borderColor: 'rgba(240,246,252,.16)', boxShadow: '0 6px 20px rgba(0,0,0,.4)', marginTop: 12 }
  const btnSecondary = { ...buttonStyle, background: 'rgba(255,255,255,.06)', color: '#e6e8ee', borderColor: 'rgba(255,255,255,.12)', marginTop: 12 }
  const formStyle = { display: 'grid', gap: 12 }
  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,.06)', color: '#e6e8ee', border: '1px solid rgba(255,255,255,.12)', outline: 'none' }
  const helperStyle = { margin: '10px 0 0 0', textAlign: 'center', color: '#9aa3bd', fontSize: 12 }
  const footerStyle = { textAlign: 'center', marginTop: 16, color: '#8c95b2', fontSize: 12 }
  const dividerRow = { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12, margin: '16px 0 10px', color: '#94a0be', fontSize: 12 }
  const lineStyle = { height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent)' }

  return (
    <div style={pageStyle}>
      <div style={bgStyle} aria-hidden>
        <NetworkBackground />
      </div>
      <div style={glassStyle} role="dialog" aria-labelledby="login-title">
        <div style={brandStyle} aria-hidden>
          <img src="/logo.svg" alt="S.Y.N.A.P.S.E logo" style={brandImgStyle} />
          <strong>S.Y.N.A.P.S.E</strong>
        </div>
        <h1 id="login-title" style={titleStyle}>Welcome to S.Y.N.A.P.S.E</h1>
        <p style={subtitleStyle}>Your private AI to simplify legal documents</p>

        <button style={btnGoogle} onClick={handleGoogle} aria-label="Continue with Google">Continue with Google</button>
        <button style={btnGithub} onClick={handleGithub} aria-label="Continue with GitHub">Continue with GitHub</button>

        <div style={dividerRow}>
          <div style={lineStyle} />
          <div>or continue with email</div>
          <div style={lineStyle} />
        </div>
        <form style={formStyle} onSubmit={handleSubmit}>
          <label>
            <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            <input style={inputStyle} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" minLength={6} />
          </label>
          <button style={btnSecondary} type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Continue with email"}</button>
        </form>

        <p style={helperStyle}>By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy</a>.</p>
        <p style={footerStyle}>© 2025 S.Y.N.A.P.S.E</p>
      </div>
    </div>
  )
}


