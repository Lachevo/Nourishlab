import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo footer-logo">
              <div className="brand-logomark">
                <span className="logo-text-n">Nourish</span>
                <div className="logo-l-wrapper">
                  <svg width="18" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-l-svg">
                    <path d="M45,35 L45,85" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
                    <circle cx="45" cy="15" r="10" fill="currentColor" />
                    <path d="M45,60 Q25,55 20,40" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" />
                    <path d="M45,50 C70,40 85,20 85,20 C85,20 75,15 45,35 Z" fill="var(--color-accent)" />
                  </svg>
                </div>
                <span className="logo-text-ab">ab</span>
              </div>
              <span className="brand-tagline">nutrition counseling</span>
            </div>
            <p>Empowering you to live a healthier, happier life through personalized nutrition.</p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h4>Platform</h4>
              <a href="#">How it Works</a>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
            </div>
            <div className="link-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="link-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NourishLab. All rights reserved.</p>
        </div>
      </div>
      <style>{`
        .footer {
          background: rgba(16, 43, 32, 0.9);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-top: none;
          color: white;
          padding: 100px 0 32px;
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 8%
          );
          mask-image: linear-gradient(
            to bottom,
            transparent 0%,
            black 8%
          );
        }
        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 2fr;
          gap: 60px;
          margin-bottom: 72px;
        }
        .footer-logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          color: var(--color-white);
        }
        .footer-logo .brand-logomark {
          display: flex;
          align-items: baseline;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 2.2rem;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .footer-logo .logo-l-wrapper {
          display: inline-flex;
          align-items: flex-end;
          margin: 0 1px;
          height: 38px;
        }
        .footer-logo .logo-l-svg {
          display: block;
          margin-bottom: -1px;
        }
        .footer-logo .brand-tagline {
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          margin-top: 2px;
          color: var(--color-white);
        }
        .footer-brand p {
          margin-top: 16px;
          opacity: 0.7;
          max-width: 300px;
          line-height: 1.7;
          font-size: 0.875rem;
        }
        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .link-column h4 {
          color: white;
          font-size: 0.75rem;
          margin-bottom: 20px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          opacity: 0.5;
        }
        .link-column a {
          display: block;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 14px;
          transition: var(--transition-fast);
        }
        .link-column a:hover {
          color: var(--color-teff);
          transform: translateX(4px);
        }
        .footer-bottom {
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
        }
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .footer-links {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
