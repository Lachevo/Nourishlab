import React, { useState, useEffect, useCallback } from 'react';
import { getAppLink } from '../config';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ── scroll hide/show (desktop) ─────────────────── */
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── lock body scroll when menu is open ──────────── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  /* ── close menu on escape key ───────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ════════════════════════════════════════════════
          HEADER BAR
      ════════════════════════════════════════════════ */}
      <header className={`header ${isVisible ? '' : 'header-hidden'}`}>
        <div className="container header-container">

          {/* Logo ─────────────────────────────────────── */}
          <a href="#home" className="brand-logo" aria-label="NourishLab home">
            <img src="/logo.jpg" alt="NourishLab Logo" className="logo-img" />
          </a>

          {/* Desktop Nav ─────────────────────────────── */}
          <nav className="nav" aria-label="Primary navigation">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} className="nav-link">{label}</a>
            ))}
          </nav>

          {/* Desktop Auth ────────────────────────────── */}
          <div className="auth-buttons">
            <a href={getAppLink('/login')} className="nav-link auth-link">Log In</a>
            <a href={getAppLink('/register')} className="btn btn-primary btn-sm">Sign Up</a>
          </div>

          {/* Hamburger (mobile only) ─────────────────── */}
          <button
            id="hamburger-btn"
            className="hamburger-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {/* Three lines → X animation */}
            <span className={`ham-line ham-top    ${menuOpen ? 'ham-top-open' : ''}`} />
            <span className={`ham-line ham-mid    ${menuOpen ? 'ham-mid-open' : ''}`} />
            <span className={`ham-line ham-bottom ${menuOpen ? 'ham-bottom-open' : ''}`} />
          </button>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          MOBILE MENU OVERLAY
      ════════════════════════════════════════════════ */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        className={`mobile-overlay ${menuOpen ? 'mobile-overlay-open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeMenu(); }}
      >
        <div className={`mobile-panel ${menuOpen ? 'mobile-panel-open' : ''}`}>

          {/* Panel header: logo + close ─────────────── */}
          <div className="mobile-panel-header">
            <a href="#home" onClick={closeMenu} className="brand-logo" aria-label="NourishLab home">
              <img src="/logo.jpg" alt="NourishLab" className="logo-img" />
            </a>
            <button
              className="close-btn"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav links ───────────────────────────────── */}
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ href, label }, i) => (
              <a
                key={href}
                href={href}
                className="mobile-nav-link"
                onClick={closeMenu}
                style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Divider ─────────────────────────────────── */}
          <div className="mobile-divider" role="separator" />

          {/* Auth CTAs ───────────────────────────────── */}
          <div className="mobile-auth">
            <a
              href={getAppLink('/login')}
              className="mobile-login-btn"
              onClick={closeMenu}
            >
              Log In
            </a>
            <a
              href={getAppLink('/register')}
              className="mobile-signup-btn"
              onClick={closeMenu}
            >
              Sign Up — It's Free
            </a>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          STYLES
      ════════════════════════════════════════════════ */}
      <style>{`
        /* ── Header bar ────────────────────────────── */
        .header {
          height: 80px;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(16, 43, 32, 0.08);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9000;
          display: flex;
          align-items: center;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.4s ease,
                      background 0.4s ease;
          box-shadow: 0 4px 24px rgba(16, 43, 32, 0.06);
        }
        .header.header-hidden {
          transform: translateY(-100%);
          box-shadow: none;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Brand logo ─────────────────────────────── */
        .brand-logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .logo-img {
          height: 52px;
          width: 52px;
          object-fit: cover;
          border-radius: 50%;
          mix-blend-mode: multiply;
          filter: contrast(1.1);
          transition: transform 0.3s ease;
          -webkit-mask-image: radial-gradient(circle, black 60%, transparent 95%);
          mask-image: radial-gradient(circle, black 60%, transparent 95%);
        }
        .logo-img:hover { transform: scale(1.05); }

        /* ── Desktop nav ────────────────────────────── */
        .nav {
          display: flex;
          align-items: center;
          gap: 36px;
        }
        .nav-link {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text);
          position: relative;
          padding: 8px 0;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%) scale(0);
          background-color: var(--color-accent);
          transition: transform 0.25s ease;
        }
        .nav-link:hover { color: var(--color-accent); }
        .nav-link:hover::after { transform: translateX(-50%) scale(1); }

        /* ── Desktop auth buttons ─────────────────────*/
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .auth-link {
          padding: 8px 0;
          color: var(--color-text);
        }
        .auth-link::after { display: none; }
        .btn-sm {
          padding: 10px 22px;
          font-size: 0.82rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* ── Hamburger button ───────────────────────── */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 48px;
          height: 48px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          border-radius: 12px;
          transition: background 0.2s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .hamburger-btn:hover {
          background: rgba(16, 43, 32, 0.06);
        }
        .ham-line {
          display: block;
          width: 24px;
          height: 2.5px;
          background: var(--color-primary);
          border-radius: 99px;
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity   0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Animate to X */
        .ham-top-open    { transform: translateY(7.5px) rotate(45deg); }
        .ham-mid-open    { opacity: 0; transform: scaleX(0); }
        .ham-bottom-open { transform: translateY(-7.5px) rotate(-45deg); }

        /* ── Mobile overlay ─────────────────────────── */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 8999;
          background: rgba(16, 43, 32, 0.45);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .mobile-overlay-open {
          opacity: 1;
          pointer-events: all;
        }

        /* ── Mobile panel ───────────────────────────── */
        .mobile-panel {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: 0 0 28px 28px;
          box-shadow: 0 24px 60px rgba(16, 43, 32, 0.22);
          padding: 0 0 36px;
          transform: translateY(-100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .mobile-panel-open {
          transform: translateY(0);
        }

        /* Panel header row */
        .mobile-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(16, 43, 32, 0.08);
          min-height: 72px;
        }

        /* Close × button */
        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: rgba(16, 43, 32, 0.06);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          color: var(--color-primary);
          transition: background 0.2s, transform 0.2s;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .close-btn:hover {
          background: rgba(16, 43, 32, 0.12);
          transform: rotate(90deg);
        }

        /* Mobile nav links */
        .mobile-nav {
          display: flex;
          flex-direction: column;
          padding: 12px 0;
        }
        .mobile-nav-link {
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--color-text);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 14px 28px;
          min-height: 52px;
          display: flex;
          align-items: center;
          transition: background 0.18s, color 0.18s, padding-left 0.18s;
          border-radius: 12px;
          margin: 2px 12px;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link:active {
          background: rgba(29, 168, 81, 0.08);
          color: var(--color-accent);
          padding-left: 36px;
        }

        /* Divider */
        .mobile-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(16, 43, 32, 0.12), transparent);
          margin: 8px 24px 20px;
        }

        /* Auth CTA buttons */
        .mobile-auth {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 0 20px;
        }
        .mobile-login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.04em;
          border-radius: 14px;
          border: 2px solid rgba(16, 43, 32, 0.2);
          color: var(--color-primary);
          background: transparent;
          transition: border-color 0.2s, background 0.2s;
          text-align: center;
        }
        .mobile-login-btn:hover {
          border-color: var(--color-primary);
          background: rgba(16, 43, 32, 0.04);
        }
        .mobile-signup-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.03em;
          border-radius: 14px;
          background: var(--color-accent);
          color: #fff;
          box-shadow: 0 6px 20px rgba(29, 168, 81, 0.35);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          text-align: center;
        }
        .mobile-signup-btn:hover {
          background: #18913f;
          box-shadow: 0 8px 28px rgba(29, 168, 81, 0.45);
          transform: translateY(-2px);
        }
        .mobile-signup-btn:active {
          transform: scale(0.98);
        }

        /* ── Responsive breakpoints ─────────────────── */
        @media (max-width: 960px) {
          .nav { display: none; }
          .auth-buttons { display: none; }
          .hamburger-btn { display: flex; }
          .mobile-overlay { display: block; }
        }

        /* ── Push page content below fixed header ───── */
        /* Apply this class to your <main> or top section wrapper */
        .has-fixed-header {
          padding-top: 80px;
        }
      `}</style>
    </>
  );
};

export default Header;
