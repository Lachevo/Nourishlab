import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold -> hide
        setIsVisible(false);
      } else {
        // Scrolling up -> show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`header ${isVisible ? '' : 'header-hidden'}`}>
      <div className="container header-container">
        <div className="brand-logo">
          <img src="/logo.jpg" alt="NourishLab Logo" className="logo-img" />
        </div>

        <nav className="nav">
          <a href="#home" className="nav-link active">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        <div className="auth-buttons">
          <a href="http://localhost:5173/login" className="nav-link auth-link">Log In</a>
          <a href="http://localhost:5173/register" className="btn btn-primary btn-sm">Sign Up</a>
        </div>
      </div>
      <style>{`
        .header {
          height: 100px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(16, 43, 32, 0.1);
          position: sticky;
          top: 24px;
          z-index: 1000;
          display: flex;
          align-items: center;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, background 0.4s ease;
          width: 90%;
          max-width: var(--max-width);
          margin: 24px auto;
          border-radius: var(--radius-full);
          box-shadow: 0 8px 32px rgba(16, 43, 32, 0.08);
          transform: translateY(0);
          overflow: hidden;
        }
        .header.header-hidden {
          transform: translateY(calc(-100% - 24px));
          box-shadow: none;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 16px 0 0;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          color: var(--color-primary);
          margin-left: -4px;
        }
        .logo-img {
          height: 120px;
          width: 120px;
          object-fit: cover;
          border-radius: 50%;
          mix-blend-mode: multiply;
          filter: contrast(1.1);
          transition: transform 0.3s ease;
          -webkit-mask-image: radial-gradient(circle, black 60%, transparent 95%);
          mask-image: radial-gradient(circle, black 60%, transparent 95%);
        }
        .logo-img:hover {
          transform: scale(1.05);
        }
        .logo-l-wrapper {
          display: inline-flex;
          align-items: flex-end;
          margin: 0 1px;
          height: 38px;
        }
        .logo-l-svg {
          display: block;
          margin-bottom: -1px;
        }
        .nav {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .nav-link {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text);
          position: relative;
          padding: 8px 0;
          transition: var(--transition-fast);
        }
        .nav-link.active {
          color: var(--color-accent);
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
          transition: transform 0.3s ease;
        }
        .nav-link:hover {
          color: var(--color-accent);
        }
        .nav-link.active::after,
        .nav-link:hover::after {
          transform: translateX(-50%) scale(1);
        }
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .auth-link {
          padding: 8px 0;
          color: var(--color-text);
        }
        .auth-link::after {
          display: none;
        }
        .btn-sm {
          padding: 10px 24px;
          font-size: 0.85rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        @media (max-width: 960px) {
          .nav { display: none; }
        }
        @media (max-width: 768px) {
          .auth-link { display: none; }
          .auth-buttons { gap: 8px; }
        }
      `}</style>
    </header>
  );
};

export default Header;
