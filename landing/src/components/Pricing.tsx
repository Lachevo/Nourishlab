import React from 'react';
import { Check } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

const pricingTiers = [
  {
    name: "1 Month Plan",
    price: "10,000",
    period: "ETB / MONTH",
    features: [
      "Full Personalized Assessment",
      "Custom Meal Plan",
      "Weekly Progress Check-ins",
      "Standard Messaging Support",
      "Active Goal Tracking"
    ],
    highlighted: false
  },
  {
    name: "3 Month Plan",
    price: "27,000",
    period: "ETB / QUARTER",
    features: [
      " everything in 1 Month Plan",
      "10% Loyalty Discount",
      "Bi-Weekly 1:1 Coaching",
      "Custom Macro Adjustments",
      "Priority Messaging"
    ],
    highlighted: true,
    badge: "Best Value"
  },
  {
    name: "6 Month Plan",
    price: "48,000",
    period: "ETB / 6 MONTHS",
    features: [
      "Everything in 3 Month Plan",
      "20% Loyalty Discount",
      "Direct Nutritionist Access",
      "Advanced Habit Coaching",
      "Bi-Monthly Progress Reviews"
    ],
    highlighted: false
  },
  {
    name: "12 Month Plan",
    price: "84,000",
    period: "ETB / YEAR",
    features: [
      "Ultimate Longevity Package",
      "30% Loyalty Discount",
      "24/7 Concierge Support",
      "Exclusive Annual Workshops",
      "Family Health Analysis"
    ],
    highlighted: false
  }
];

const Pricing: React.FC = () => {
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.2 });
  const [gridRef, gridVisible] = useScrollReveal({ threshold: 0.08 });

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div
          ref={headerRef}
          className={`pricing-header reveal reveal-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="pricing-badge shimmer-badge">Pricing Overview</span>
          <h2>Transparent Plans for Your<br />Health & Wellness Journey</h2>
        </div>

        <div ref={gridRef} className="pricing-grid">
          {pricingTiers.map((tier, index) => (
            <div
              key={index}
              className={`pricing-card ${tier.highlighted ? 'highlighted' : ''} reveal reveal-up delay-${index + 1} ${gridVisible ? 'is-visible' : ''}`}
            >
              {tier.badge && (
                <div className="tier-badge">{tier.badge}</div>
              )}
              <h3 className="tier-name">{tier.name}</h3>
              <div className="tier-price-container">
                <span className="tier-price">{tier.price}</span>
                <span className="tier-period">{tier.period}</span>
              </div>
              <div className="tier-divider"></div>
              <ul className="tier-features">
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex}>
                    <Check size={16} className="feature-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="tier-action">
                <button className={`btn ${tier.highlighted ? 'btn-accent' : 'btn-outline-dark'}`}>
                  GET A QUOTE <ArrowRightIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .pricing {
          padding: 120px 0;
          background-color: transparent;
          position: relative;
        }

        .pricing::before {
          content: '';
          position: absolute;
          top: 60px;
          left: 10%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-image: radial-gradient(var(--color-accent) 15%, transparent 16%);
          background-size: 10px 10px;
          opacity: 0.2;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 72px;
        }

        .pricing-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .pricing-header h2 {
          font-size: 2.2rem;
          color: var(--color-text);
          line-height: 1.25;
          letter-spacing: -0.04em;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: var(--radius-lg);
          padding: 36px 28px;
          position: relative;
          box-shadow: 0 4px 24px rgba(16, 43, 32, 0.04), inset 0 1px 0 rgba(255,255,255,0.8);
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, background 0.4s ease, border-color 0.4s ease;
        }

        .pricing-card:not(.highlighted):hover {
          transform: translateY(-12px) scale(1.02) !important;
          box-shadow: 0 32px 64px rgba(16, 43, 32, 0.12), inset 0 1px 0 rgba(255,255,255,0.9);
          background: rgba(255, 255, 255, 0.9);
          border-color: var(--color-accent);
        }

        .pricing-card.highlighted {
          background-color: var(--color-primary);
          color: var(--color-white);
          transform: scale(1.05) !important;
          box-shadow: var(--shadow-lg);
          z-index: 2;
          border: 2px solid var(--color-accent);
        }

        .pricing-card.highlighted:hover {
          transform: scale(1.08) translateY(-12px) !important;
          box-shadow: var(--shadow-heavy);
        }

        .tier-badge {
          position: absolute;
          top: -20px;
          right: 32px;
          width: 48px;
          height: 48px;
          background-color: var(--color-accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 12px rgba(29, 168, 81, 0.4);
        }

        .tier-name {
          color: var(--color-accent);
          font-size: 0.9rem;
          margin-bottom: 12px;
          font-family: var(--font-sans);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tier-price-container {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 32px;
        }

        .tier-price {
          font-size: 2.4rem;
          font-weight: 700;
          font-family: var(--font-sans);
          color: inherit;
        }

        .pricing-card:not(.highlighted) .tier-price {
          color: var(--color-text);
        }

        .tier-period {
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0.7;
          letter-spacing: 0.05em;
        }

        .tier-divider {
          height: 1px;
          width: 100%;
          background-color: rgba(0,0,0,0.06);
          margin-bottom: 32px;
        }
        
        .pricing-card.highlighted .tier-divider {
          background-color: rgba(255,255,255,0.1);
        }

        .tier-features {
          list-style: none;
          padding: 0;
          margin: 0;
          margin-bottom: 40px;
        }

        .tier-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.95rem;
          color: var(--color-text-light);
        }

        .pricing-card.highlighted .tier-features li {
          color: rgba(255,255,255,0.85);
        }

        .feature-icon {
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .tier-action {
          display: flex;
          justify-content: flex-start;
        }

        .tier-action .btn {
          padding: 12px 24px;
          font-size: 0.85rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .arrow-icon {
          width: 14px;
          height: 14px;
        }

        @media (max-width: 1100px) {
          .pricing-grid { grid-template-columns: repeat(2, 1fr); gap: 40px 24px; }
          .pricing-card.highlighted { transform: scale(1) !important; }
          .pricing-card.highlighted:hover { transform: translateY(-8px) !important; }
        }

        @media (max-width: 768px) {
          .pricing-grid { grid-template-columns: 1fr; }
          .pricing-header h2 { font-size: 1.8rem; }
        }
      `}</style>
    </section>
  );
};

const ArrowRightIcon = () => (
  <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Pricing;
