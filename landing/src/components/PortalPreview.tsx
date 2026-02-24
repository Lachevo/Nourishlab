import React from 'react';
import { motion } from 'framer-motion';
import { Layout, UtensilsCrossed, TrendingUp, MessageSquareMore, FileText } from 'lucide-react';

const features = [
  {
    icon: <Layout size={20} />,
    title: 'Dashboard Overview',
    img: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?q=80&w=802&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Everything you need at a glance.'
  },
  {
    icon: <UtensilsCrossed size={20} />,
    title: 'Meal Logging',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop',
    caption: 'Easy and intuitive food diary.'
  },
  {
    icon: <TrendingUp size={20} />,
    title: 'Progress Charts',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    caption: 'Visualize your transformation.'
  },
  {
    icon: <MessageSquareMore size={20} />,
    title: 'Direct Chat',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    caption: 'Expert advice, just a message away.'
  }
];

const PortalPreview: React.FC = () => {
  return (
    <section className="portal-preview" id="portal-preview">
      <div className="container portal-container">
        <div className="portal-header">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="portal-badge shimmer-badge">THE EXPERIENCE</span>
            <h2>Your Secure Online Portal</h2>
            <p className="portal-subtitle">
              Meal plans at your fingertips, easy logging, visual progress tracking, and direct access to your consultant.
            </p>
          </motion.div>
        </div>

        <div className="portal-gallery">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="portal-feature-item"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="feature-img-wrapper">
                <img src={feature.img} alt={feature.title} />
                <div className="feature-overlay">
                  <div className="feature-icon">{feature.icon}</div>
                  <p>{feature.caption}</p>
                </div>
              </div>
              <h4>{feature.title}</h4>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="portal-summary"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="summary-card">
            <FileText size={32} className="summary-icon" />
            <p><strong>Your private online portal</strong> – everything is designed to reduce hesitation and build excitement for your new health journey.</p>
          </div>
        </motion.div>
      </div>
      <style>{`
        .portal-preview {
          padding: 120px 0;
          background: #102B20;
          color: white;
          position: relative;
        }

        .portal-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 80px;
        }

        .portal-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .portal-header h2 {
          font-size: 2.2rem;
          color: white;
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .portal-subtitle {
          color: rgba(255, 255, 255, 0.75);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .portal-gallery {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 80px;
        }

        .portal-feature-item h4 {
          margin-top: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
          color: var(--color-accent);
        }

        .feature-img-wrapper {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          aspect-ratio: 16/10;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .feature-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .feature-img-wrapper:hover img {
          transform: scale(1.1);
        }

        .feature-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent, rgba(16, 43, 32, 0.9));
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-img-wrapper:hover .feature-overlay {
          opacity: 1;
        }

        .feature-icon {
          color: var(--color-accent);
          margin-bottom: 8px;
        }

        .feature-overlay p {
          color: white;
          font-size: 0.9rem;
          margin: 0;
          font-weight: 500;
        }

        .portal-summary {
          max-width: 700px;
          margin: 0 auto;
        }

        .summary-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 32px 48px;
          border-radius: var(--radius-xl);
          display: flex;
          align-items: center;
          gap: 24px;
          text-align: left;
        }

        .summary-icon {
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .summary-card p {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 1024px) {
          .portal-gallery { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .portal-gallery { grid-template-columns: 1fr; }
          .portal-header h2 { font-size: 2.2rem; }
          .summary-card { flex-direction: column; text-align: center; padding: 32px 24px; }
        }
      `}</style>
    </section>
  );
};

export default PortalPreview;
