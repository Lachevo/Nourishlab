import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    question: "Do I need special equipment or apps?",
    answer: "No – NourishLab is designed for maximum convenience. Everything from your meal plans to chat and progress tracking is accessible directly in your browser-based portal. No additional downloads required."
  },
  {
    question: "How soon can I start my program?",
    answer: "You can start today! Once you sign up and complete your profile, you will receive your first personalized nutrition plan within 48 hours."
  },
  {
    question: "Is my data private and secure?",
    answer: "Absolutely. We take your privacy seriously. All your health data, meal logs, and communications with your consultant are fully encrypted and securely stored in your private portal."
  },
  {
    question: "What if I have dietary restrictions or allergies?",
    answer: "Our nutritionists specialize in creating plans tailored to your specific needs. During signup, you'll provide details about your allergies and preferences, and your plan will be built accordingly."
  },
  {
    question: "Can I cancel my membership at any time?",
    answer: "Yes, we believe in flexibility. You can manage your membership directly through your portal settings. We want you to stay because you're seeing results, not because you're locked in."
  }
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={onClick} aria-expanded={isOpen}>
        <span>{question}</span>
        <div className={`faq-icon ${isOpen ? 'rotate' : ''}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="faq-answer-wrapper"
          >
            <div className="faq-answer">
              <p>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="faq" id="faq">
      <div className="container faq-container">
        <div className="faq-header">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="faq-badge shimmer-badge">COMMON QUESTIONS</span>
            <h2>Everything You Need to Know</h2>
            <p className="faq-subtitle">
              We're here to help you clear any doubts and start your journey with confidence.
            </p>
          </motion.div>
        </div>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
      <style>{`
        .faq {
          padding: 120px 0;
          background-color: transparent;
        }

        .faq-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 64px;
        }

        .faq-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .faq-header h2 {
          font-size: 2.2rem;
          color: var(--color-text);
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .faq-subtitle {
          color: var(--color-text-light);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: var(--transition-smooth);
        }

        .faq-item:hover {
          background: rgba(255, 255, 255, 0.85);
          border-color: var(--color-accent);
        }

        .faq-question {
          width: 100%;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-primary);
          transition: color 0.3s ease;
        }

        .faq-item.open .faq-question {
          color: var(--color-accent);
        }

        .faq-icon {
          color: var(--color-accent);
          transition: transform 0.3s ease;
        }

        .faq-answer-wrapper {
          overflow: hidden;
        }

        .faq-answer {
          padding: 0 32px 32px;
        }

        .faq-answer p {
          color: var(--color-text-light);
          line-height: 1.7;
          margin: 0;
          font-size: 1.05rem;
        }

        @media (max-width: 640px) {
          .faq-header h2 { font-size: 2.2rem; }
          .faq-question { padding: 20px; font-size: 1.1rem; }
          .faq-answer { padding: 0 20px 20px; }
        }
      `}</style>
    </section>
  );
};

export default FAQ;
