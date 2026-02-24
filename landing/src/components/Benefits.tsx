import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, ClipboardCheck, Users, Zap, BarChart3 } from 'lucide-react';

const benefits = [
  {
    icon: <ShieldCheck size={32} />,
    title: 'Truly Personalized',
    description: 'No cookie-cutter diets. Every plan is built from scratch based on your unique body, goals, and lifestyle.'
  },
  {
    icon: <Clock size={32} />,
    title: 'Flexible & Convenient',
    description: 'Fully online and fits your schedule. Access your plans and consultant from anywhere, anytime.'
  },
  {
    icon: <ClipboardCheck size={32} />,
    title: 'Real Accountability',
    description: 'Track everything in your private portal. Your consultant monitors your progress and keeps you on track.'
  },
  {
    icon: <Users size={32} />,
    title: 'Expert Support',
    description: 'Direct access to certified nutrition consultants who listen, adapt, and support your journey.'
  },
  {
    icon: <Zap size={32} />,
    title: 'Sustainable Results',
    description: 'We focus on building lasting habits and a healthy relationship with food, not just quick fixes.'
  },
  {
    icon: <BarChart3 size={32} />,
    title: 'Progress You Can See',
    description: 'Beautiful dashboards, interactive charts, and milestone celebrations to keep you motivated.'
  }
];

const Benefits: React.FC = () => {
  return (
    <section className="benefits" id="services">
      <div className="container benefits-container">
        <div className="benefits-header">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="benefits-badge shimmer-badge">WHY CHOOSE US</span>
            <h2>Sell the Transformation, Not Just Features</h2>
            <p className="benefits-subtitle">
              We provide the tools, expertise, and support you need to achieve the healthy lifestyle you've always wanted.
            </p>
          </motion.div>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="benefit-card"
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="benefit-icon-wrapper">
                {benefit.icon}
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`
        .benefits {
          padding: 120px 0;
          background-color: transparent;
          position: relative;
        }

        .benefits-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 80px;
        }

        .benefits-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .benefits-header h2 {
          font-size: 2.2rem;
          color: var(--color-text);
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .benefits-subtitle {
          color: var(--color-text-light);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .benefit-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          padding: 40px;
          border-radius: var(--radius-lg);
          box-shadow: 0 12px 40px rgba(16, 43, 32, 0.04), inset 0 1px 0 rgba(255,255,255,0.9);
          transition: var(--transition-smooth);
        }

        .benefit-card:hover {
          background: rgba(255, 255, 255, 0.9);
          border-color: var(--color-accent);
          box-shadow: 0 20px 60px rgba(16, 43, 32, 0.1);
        }

        .benefit-icon-wrapper {
          color: var(--color-accent);
          background: rgba(184, 156, 93, 0.1);
          width: 72px;
          height: 72px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 28px;
          transition: var(--transition-fast);
        }

        .benefit-card:hover .benefit-icon-wrapper {
          background: var(--color-accent);
          color: var(--color-white);
          transform: scale(1.1);
        }

        .benefit-card h3 {
          font-size: 1.25rem;
          color: var(--color-primary);
          margin-bottom: 16px;
          font-weight: 700;
        }

        .benefit-card p {
          color: var(--color-text-light);
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 960px) {
          .benefits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .benefits-grid {
            grid-template-columns: 1fr;
          }
          .benefits-header h2 {
            font-size: 2.2rem;
          }
          .benefit-card {
            padding: 32px;
          }
        }
      `}</style>
    </section>
  );
};

export default Benefits;
