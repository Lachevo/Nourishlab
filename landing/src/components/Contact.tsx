import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Send, Instagram, ArrowRight } from 'lucide-react';

const contactMethods = [
    {
        icon: <Phone size={24} />,
        label: "Phone",
        value: "+251 9XX XXX XXX",
        link: "tel:+251900000000",
        color: "#1da851"
    },
    {
        icon: <Send size={24} />,
        label: "Telegram",
        value: "@NourishLabSupport",
        link: "https://t.me/NourishLabSupport",
        color: "#0088cc"
    },
    {
        icon: <Instagram size={24} />,
        label: "Instagram",
        value: "@nourishlab_et",
        link: "https://instagram.com",
        color: "#e4405f"
    },
    {
        icon: (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
        ),
        label: "TikTok",
        value: "@nourishlab_wellness",
        link: "https://tiktok.com",
        color: "#000000"
    },
    {
        icon: <Mail size={24} />,
        label: "Email",
        value: "support@nourishlab.et",
        link: "mailto:support@nourishlab.et",
        color: "#ea4335"
    }
];

const Contact: React.FC = () => {
    return (
        <section className="contact" id="contact">
            <div className="container contact-container">
                <div className="contact-header">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="contact-badge shimmer-badge">GET IN TOUCH</span>
                        <h2>We're Here to Help</h2>
                        <p className="contact-subtitle">
                            Ready to start your journey or have questions? Reach out to us through any of our channels below.
                        </p>
                    </motion.div>
                </div>

                <div className="contact-grid">
                    {contactMethods.map((method, index) => (
                        <motion.a
                            key={index}
                            href={method.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-card"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="contact-icon-wrapper" style={{ '--hover-color': method.color } as React.CSSProperties}>
                                {method.icon}
                            </div>
                            <div className="contact-info">
                                <span className="contact-label">{method.label}</span>
                                <span className="contact-value">{method.value}</span>
                            </div>
                            <div className="contact-arrow">
                                <ArrowRight size={18} />
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>

            <style>{`
        .contact {
          padding: 120px 0;
          background: rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .contact-container {
          max-width: 1100px;
        }

        .contact-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 80px;
        }

        .contact-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .contact-header h2 {
          font-size: 2.2rem;
          color: var(--color-text);
          margin-bottom: 20px;
          letter-spacing: -0.04em;
        }

        .contact-subtitle {
          color: var(--color-text-light);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin: 0 auto;
        }

        .contact-card {
          display: flex;
          align-items: center;
          gap: 24px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 24px 32px;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 24px rgba(16, 43, 32, 0.04);
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .contact-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.95);
          border-color: var(--color-accent);
          box-shadow: 0 20px 48px rgba(16, 43, 32, 0.08);
        }

        .contact-icon-wrapper {
          width: 56px;
          height: 56px;
          background: rgba(184, 156, 93, 0.05);
          color: var(--color-primary);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .contact-card:hover .contact-icon-wrapper {
          background: var(--hover-color);
          color: white;
          transform: rotate(-8deg) scale(1.1);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .contact-info {
          flex-grow: 1;
        }

        .contact-label {
          display: block;
          font-size: 0.85rem;
          color: var(--color-text-light);
          font-weight: 500;
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .contact-value {
          display: block;
          font-size: 1.1rem;
          color: var(--color-primary);
          font-weight: 700;
          transition: color 0.3s ease;
        }

        .contact-card:hover .contact-value {
          color: var(--color-accent);
        }

        .contact-arrow {
          color: var(--color-text-light);
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s ease;
        }

        .contact-card:hover .contact-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--color-accent);
        }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-header h2 { font-size: 2rem; }
          .contact-card { padding: 20px 24px; }
        }
      `}</style>
        </section>
    );
};

export default Contact;
