import React from 'react';
import { Users, Calendar, Activity, Heart } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const features = [
  {
    icon: <Users size={28} />,
    title: "Expert Nutritionists",
    description: "Work one-on-one with certified nutritionists who understand your unique needs and cultural preferences."
  },
  {
    icon: <Calendar size={28} />,
    title: "Personalized Meal Plans",
    description: "Get weekly meal plans tailored to your dietary goals, whether it's weight loss, muscle gain, or managing a condition."
  },
  {
    icon: <Activity size={28} />,
    title: "Progress Tracking",
    description: "Monitor your journey with intuitive charts and logs. Track your meals, water intake, and lab results in one place."
  },
  {
    icon: <Heart size={28} />,
    title: "Holistic Approach",
    description: "We focus on sustainable lifestyle changes, not quick fixes. Build healthy habits that last a lifetime."
  }
];

const Features: React.FC = () => {
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 });
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.1 });

  return (
    <section id="features" className="features">
      <div className="container">
        <div
          ref={headerRef}
          className={`section-header reveal reveal-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <h2>Why Choose NourishLab?</h2>
          <p>We combine science-backed nutrition with personalized care to help you thrive.</p>
        </div>
        <div ref={gridRef} className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`feature-card reveal reveal-up delay-${index + 1} ${gridVisible ? 'is-visible' : ''}`}
            >
              <div className="icon-wrapper">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .features {
          padding: 120px 0;
          background-color: transparent;
          position: relative;
        }
        .section-header {
          text-align: center;
        max-width: 700px;
        margin: 0 auto 72px;
        }
        .section-header h2 {
          font-size: 2rem;
        margin-bottom: 16px;
        color: var(--color-text);
        }
        .section-header p {
          font-size: 1rem;
        color: var(--color-text-light);
        line-height: 1.7;
        }
        .features-grid {
          display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 32px;
        }
        .feature-card {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          padding: 36px 28px;
          border-radius: var(--radius-lg);
          box-shadow: 0 4px 24px rgba(16, 43, 32, 0.06), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: var(--transition-smooth), opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .feature-card:hover {
          transform: translateY(-8px) !important;
          box-shadow: 0 20px 48px rgba(16, 43, 32, 0.12), inset 0 1px 0 rgba(255,255,255,0.9);
          border-color: rgba(29, 168, 81, 0.3);
          background: rgba(255, 255, 255, 0.75);
        }
        .icon-wrapper {
          width: 52px;
        height: 52px;
        border-radius: var(--radius-md);
        background: linear-gradient(135deg, rgba(29,168,81,0.18) 0%, rgba(29,168,81,0.05) 100%);
        color: var(--color-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        transition: var(--transition-smooth);
        }
        .feature-card:hover .icon-wrapper {
          background: var(--color-primary);
        color: var(--color-white);
        transform: scale(1.05);
        }
        .feature-card h3 {
          font-size: 1.1rem;
        margin-bottom: 12px;
        color: var(--color-text);
        }
        .feature-card p {
          color: var(--color-text-light);
        line-height: 1.6;
        margin: 0;
        font-size: 0.9rem;
        }
      `}</style>
    </section>
  );
};

export default Features;
