import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, UserPlus, FileText, MessageSquare, LineChart, Target, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <CreditCard size={32} />,
    title: 'Contact & Secure Payment',
    description: (
      <>
        Contact us first, then pay via CBE (Acct: 1000XXXXXXXXX) or Telebirr (09XXXXXXXX).
        Send your receipt via Telegram (<a href="https://t.me/NourishLabSupport" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: '600', textDecoration: 'underline' }}>@NourishLabSupport</a>) for verification.
      </>
    )
  },
  {
    icon: <UserPlus size={32} />,
    title: 'Sign Up & Create Your Account',
    description: 'Quick profile setup: share your goals, preferences, allergies, and lifestyle in minutes.'
  },
  {
    icon: <FileText size={32} />,
    title: 'Get Your Personalized Plan',
    description: 'Receive a custom meal plan + recommendations designed just for you.'
  },
  {
    icon: <MessageSquare size={32} />,
    title: 'Ongoing Consultations',
    description: 'Chat with your dedicated nutrition consultant via messages, video calls, or voice notes – whenever you need support.'
  },
  {
    icon: <LineChart size={32} />,
    title: 'Track Progress in Your Portal',
    description: 'Log meals, monitor weight/energy/mood, view charts, and celebrate milestones – all in one secure dashboard.'
  },
  {
    icon: <Target size={32} />,
    title: 'Adjust & Succeed',
    description: 'Plans evolve with you – weekly check-ins keep you on track toward lasting results.'
  }
];

const Process: React.FC = () => {
  return (
    <section className="process" id="how-it-works">
      <div className="container process-container">
        <div className="process-header">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="process-badge shimmer-badge">THE JOURNEY</span>
            <h2>How It Works</h2>
            <p className="process-subtitle">
              Your path to a healthier life is simple, personalized, and guided by experts every step of the way.
            </p>
          </motion.div>
        </div>

        <div className="process-steps">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="process-step-card"
              initial={{ x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-icon-wrapper">
                {step.icon}
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="process-footer"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a href="http://localhost:5173/register" className="btn btn-primary btn-lg">
            Start Your Journey Today <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </a>
        </motion.div>
      </div>
      <style>{`
        .process {
          padding: 120px 0;
          background: rgba(255, 255, 255, 0.4);
          position: relative;
        }

        .process-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 80px;
        }

        .process-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .process-header h2 {
          font-size: 2.2rem;
          color: var(--color-text);
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .process-subtitle {
          color: var(--color-text-light);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .process-steps {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 900px;
          margin: 0 auto 80px;
          position: relative;
        }

        .process-steps::before {
          content: '';
          position: absolute;
          top: 0;
          left: 40px;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, transparent, var(--color-accent), transparent);
          z-index: 0;
        }

        .process-step-card {
          display: flex;
          align-items: center;
          gap: 40px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          padding: 32px 48px;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 12px 40px rgba(16, 43, 32, 0.04);
          position: relative;
          z-index: 1;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .process-step-card:hover {
          transform: translateX(10px) scale(1.02);
          border-color: var(--color-accent);
          background: rgba(255, 255, 255, 0.9);
        }

        .step-number {
          position: absolute;
          left: -20px;
          width: 40px;
          height: 40px;
          background: var(--color-accent);
          color: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.2rem;
          box-shadow: 0 4px 12px rgba(184, 156, 93, 0.3);
        }

        .step-icon-wrapper {
          color: var(--color-accent);
          background: rgba(184, 156, 93, 0.1);
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-content h3 {
          font-size: 1.25rem;
          color: var(--color-primary);
          margin-bottom: 12px;
          font-weight: 700;
        }

        .step-content p {
          color: var(--color-text-light);
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0;
        }

        .process-footer {
          text-align: center;
        }

        @media (max-width: 768px) {
          .process-steps::before { left: 50%; transform: translateX(-50%); }
          .process-step-card { flex-direction: column; text-align: center; padding: 40px 24px; }
          .step-number { left: 50%; transform: translateX(-50%); top: -20px; }
          .process-header h2 { font-size: 2.2rem; }
        }
      `}</style>
    </section>
  );
};

export default Process;
