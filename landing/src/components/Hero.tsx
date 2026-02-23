import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="container hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge-container"
          >
            <span className="hero-badge-text">Personalized Health Journey</span>
          </motion.div>
          <motion.h1
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
          >
            Transform Your Health with <span className="highlight">Personalized Nutrition</span> – From Anywhere
          </motion.h1>
          <motion.p
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            Get custom meal plans, expert consultations, and real-time progress tracking in your private online portal.
            Science-backed guidance tailored to your goals, lifestyle, and body – no guesswork, just results.
          </motion.p>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hero-actions"
          >
            <div className="hero-cta-group">
              <a href="http://localhost:5173/register" className="btn btn-primary btn-lg">
                Create Your Free Account & Get Started <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </a>
              <a href="#consultation" className="btn btn-outline-white btn-lg">
                <Calendar size={20} style={{ marginRight: '8px' }} /> Book a Free Discovery Call
              </a>
            </div>

            <div className="hero-trust-boosters">
              <span>100% online</span>
              <span className="separator">•</span>
              <span>No gym required</span>
              <span className="separator">•</span>
              <span>Backed by certified nutrition experts</span>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        .hero {
          position: relative;
          min-height: 95vh;
          display: flex;
          align-items: center;
          background-image: url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          overflow: hidden;
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(16, 43, 32, 0.95) 0%, rgba(16, 43, 32, 0.7) 50%, rgba(0,0,0,0.2) 100%);
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          padding-top: 100px;
          padding-bottom: 100px;
        }
        
        .hero-content {
          max-width: 900px;
        }

        .hero-badge-container {
          margin-bottom: 24px;
        }

        .hero-badge-text {
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-left: 3px solid var(--color-accent);
          padding-left: 12px;
        }

        .hero-title {
          font-size: 3.2rem;
          line-height: 1.05;
          margin-bottom: 24px;
          letter-spacing: -0.05em;
          color: var(--color-white);
          font-weight: 800;
        }
        
        .hero-title .highlight {
          color: var(--color-accent);
          background: none;
          -webkit-text-fill-color: initial;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 48px;
          max-width: 700px;
          font-weight: 400;
        }
        
        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .btn-lg {
          padding: 18px 36px;
          font-size: 1rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-outline-white {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: var(--color-white);
          backdrop-filter: blur(10px);
          transition: var(--transition-smooth);
        }

        .btn-outline-white:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--color-white);
          transform: translateY(-2px);
        }

        .hero-trust-boosters {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .hero-trust-boosters .separator {
          color: var(--color-accent);
          font-weight: 900;
        }

        @media (max-width: 960px) {
          .hero-title { font-size: 3rem; }
          .hero-subtitle { font-size: 1.1rem; }
        }

        @media (max-width: 768px) {
           .hero-title { font-size: 2.5rem; }
           .hero-cta-group { flex-direction: column; align-items: stretch; }
           .hero-trust-boosters { flex-direction: column; gap: 8px; align-items: flex-start; }
           .hero-trust-boosters .separator { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
