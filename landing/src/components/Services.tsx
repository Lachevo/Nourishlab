import React from 'react';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
    return (
        <section className="services" id="services">
            <div className="container services-container">
                <div className="services-images">
                    <div className="main-image-wrapper">
                        <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop" alt="Healthy Meal" />
                    </div>
                    <div className="floating-contact">
                        <div className="contact-icon">📞</div>
                        <div className="contact-info">
                            <span className="contact-label">Lets Consultation</span>
                            <span className="contact-number">+02 123 456 789</span>
                        </div>
                    </div>
                </div>

                <div className="services-content">
                    <motion.div
                        initial={{ x: 30 }}
                        whileInView={{ x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="services-badge">OUR VALUE</span>
                        <h2>Our Nutrition Experts Will Create A Customized Meal Plan That Is Tailored To Your Individual Needs</h2>
                        <p className="services-description">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut a tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
                        </p>

                        <div className="services-list">
                            <div className="service-item">
                                <div className="service-icon-wrapper">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 22S4 18 4 11V5l8-3 8 3v6c0 7-8 11-8 11z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="service-text">
                                    <h4>Free Consultation 24 Hours</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>

                            <div className="service-item">
                                <div className="service-icon-wrapper">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="service-text">
                                    <h4>Nutrition Legal Certificate</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>

                            <div className="service-item">
                                <div className="service-icon-wrapper">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="service-text">
                                    <h4>Organic Nutrition Expertise</h4>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <style>{`
        .services {
          padding: 120px 0;
          background-color: transparent;
          overflow: hidden;
        }

        .services-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .services-images {
           position: relative;
        }

        .main-image-wrapper {
           border-radius: var(--radius-xl);
           overflow: hidden;
           box-shadow: var(--shadow-lg);
           aspect-ratio: 4/5;
           max-width: 90%;
        }

        .main-image-wrapper img {
           width: 100%;
           height: 100%;
           object-fit: cover;
           display: block;
        }

        .floating-contact {
           position: absolute;
           bottom: -20px;
           right: 0;
           background: rgba(255, 255, 255, 0.65);
           backdrop-filter: blur(20px);
           -webkit-backdrop-filter: blur(20px);
           border: 1px solid rgba(255, 255, 255, 0.7);
           padding: 20px 28px;
           border-radius: var(--radius-md);
           box-shadow: 0 12px 40px rgba(16,43,32,0.1), inset 0 1px 0 rgba(255,255,255,0.9);
           display: flex;
           align-items: center;
           gap: 16px;
           z-index: 2;
        }

        .contact-icon {
           font-size: 1.8rem;
           color: var(--color-accent);
           background-color: rgba(184, 156, 93, 0.1);
           width: 56px;
           height: 56px;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: 50%;
        }

        .contact-info {
           display: flex;
           flex-direction: column;
        }

        .contact-label {
           font-size: 0.85rem;
           color: var(--color-text-light);
           font-weight: 600;
           text-transform: uppercase;
           letter-spacing: 0.05em;
        }

        .contact-number {
           color: var(--color-primary);
           font-weight: 700;
           font-size: 1.1rem;
           font-family: var(--font-sans);
        }

        .services-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .services-content h2 {
          font-size: 2rem;
          color: var(--color-text);
          line-height: 1.3;
          margin-bottom: 20px;
        }

        .services-description {
          color: var(--color-text-light);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .services-list {
           display: flex;
           flex-direction: column;
           gap: 32px;
        }

        .service-item {
           display: flex;
           align-items: flex-start;
           gap: 20px;
        }

        .service-icon-wrapper {
           color: var(--color-accent);
           background-color: rgba(184, 156, 93, 0.1);
           width: 64px;
           height: 64px;
           border-radius: var(--radius-md);
           display: flex;
           align-items: center;
           justify-content: center;
           flex-shrink: 0;
           transition: var(--transition-fast);
        }

        .service-item:hover .service-icon-wrapper {
           background-color: var(--color-accent);
           color: var(--color-white);
           transform: translateY(-4px);
        }

        .service-text h4 {
           margin: 0;
           margin-bottom: 8px;
           font-size: 1rem;
           color: var(--color-text);
           font-family: var(--font-sans);
           font-weight: 600;
        }

        .service-text p {
           margin: 0;
           color: var(--color-text-light);
           font-size: 0.95rem;
           line-height: 1.6;
        }

        @media (max-width: 960px) {
           .services-container {
              grid-template-columns: 1fr;
              gap: 64px;
           }

           .services-images {
              max-width: 600px;
              margin: 0 auto;
           }

           .main-image-wrapper { max-width: 100%; aspect-ratio: 16/9; }

           .floating-contact { right: auto; left: 50%; transform: translateX(-50%); bottom: -30px; }

           .services-content {
              text-align: center;
           }

           .services-content h2 { font-size: 1.8rem; }

           .service-item {
              text-align: left;
           }
        }
        
        @media (max-width: 600px) {
           .floating-contact { width: 90%; padding: 16px 24px; flex-direction: column; text-align: center; }
           .service-item { flex-direction: column; align-items: center; text-align: center; }
        }
      `}</style>
        </section>
    );
};

export default Services;
