import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { getAppLink } from '../config';

const FooterCTA: React.FC = () => {
  return (
    <section className="footer-cta">
      <div className="container">
        <motion.div
          className="cta-card"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cta-content">
            <h2>Ready to Nourish Your Body and Reach Your Goals?</h2>
            <p>Join hundreds of happy clients – create your account in under 2 minutes.</p>

            <div className="cta-actions">
              <a href={getAppLink('/register')} className="btn btn-primary btn-lg">
                Get Started <ArrowRight size={20} style={{ marginLeft: '8px' }} />
              </a>
              <a href="#contact" className="btn btn-outline-white btn-lg">
                <Phone size={20} style={{ marginRight: '8px' }} /> Contact Us
              </a>
            </div>
          </div>

          <div className="cta-decoration">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
          </div>
        </motion.div>
      </div>
      <style>{`
        .footer-cta {
          padding: 80px 0 120px;
          background: transparent;
        }

        .cta-card {
          background: #102B20;
          border-radius: 40px;
          padding: 80px 60px;
          position: relative;
          overflow: hidden;
          text-align: center;
          box-shadow: 0 40px 80px rgba(16, 43, 32, 0.2);
        }

        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 2.6rem;
          color: white;
          margin-bottom: 24px;
          letter-spacing: -0.05em;
          line-height: 1.1;
        }

        .cta-content p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 48px;
        }

        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn-outline-white {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .btn-outline-white:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: white;
          transform: translateY(-2px);
        }

        .cta-decoration .shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 1;
        }

        .shape-1 {
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: rgba(184, 156, 93, 0.2);
        }

        .shape-2 {
          bottom: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          background: rgba(184, 156, 93, 0.1);
        }

        @media (max-width: 768px) {
          .cta-card { padding: 60px 30px; }
          .cta-content h2 { font-size: 2.2rem; }
          .cta-actions { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </section>
  );
};

export default FooterCTA;
