import React from 'react';
import { motion } from 'framer-motion';

const Coaches: React.FC = () => {
   return (
      <section className="coaches bg-surface-dark" id="about">
         <div className="container coaches-container">
            <div className="coaches-content">
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
               >
                  <span className="coaches-badge">MEET OUR TEAM</span>
                  <h2>Expert Guidance You Can Trust</h2>
                  <p>
                     We're a team of certified nutrition consultants passionate about making healthy eating simple, enjoyable, and effective. We help busy people build lasting habits through personalized online guidance.
                  </p>
                  <a href="#booking" className="btn btn-accent mt-4">
                     BOOK A FREE DISCOVERY CALL
                  </a>
               </motion.div>
            </div>
            <div className="coaches-images">
               <div className="coaches-image-wrapper image-left">
                  <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop" alt="Wellness Coach 1" />
               </div>
               <div className="coaches-image-wrapper image-right">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" alt="Wellness Coach 2" />
               </div>
            </div>
         </div>
         <style>{`
        .bg-surface-dark {
          background-color: var(--color-surface-dark);
          position: relative;
        }

        .bg-surface-dark::before {
           content: '';
           position: absolute;
           top: 100px;
           left: 50%;
           transform: translateX(-50%);
           width: 120px;
           height: 120px;
           background-image: radial-gradient(rgba(255,255,255,0.15) 15%, transparent 16%);
           background-size: 10px 10px;
           border-radius: 50%;
        }

        .coaches {
          padding: 120px 0;
          position: relative;
          background: rgba(16, 43, 32, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: none;
          border-bottom: none;
          color: var(--color-white);
          overflow: hidden;
        }

        .coaches-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }

        .coaches-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .coaches-content h2 {
          font-size: 2.2rem;
          color: var(--color-white);
          line-height: 1.25;
          margin-bottom: 20px;
        }

        .coaches-content p {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          margin-bottom: 36px;
          line-height: 1.7;
          max-width: 480px;
        }

        .btn-accent {
           border-radius: var(--radius-full);
           padding: 16px 36px;
           font-size: 0.95rem;
        }

        .coaches-images {
           display: flex;
           gap: 24px;
           justify-content: flex-end;
           position: relative;
           z-index: 1;
        }

        .coaches-image-wrapper {
           width: calc(50% - 12px);
           aspect-ratio: 3/4;
           border-radius: var(--radius-lg);
           overflow: hidden;
           border: 6px solid var(--color-white);
           box-shadow: var(--shadow-lg);
           transform: translateY(0);
           transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .coaches-image-wrapper:hover {
           transform: translateY(-10px);
        }

        .coaches-image-wrapper img {
           width: 100%;
           height: 100%;
           object-fit: cover;
           display: block;
        }

        .image-right {
           transform: translateY(40px);
        }

        .image-right:hover {
           transform: translateY(30px);
        }

        @media (max-width: 960px) {
          .coaches-container {
             grid-template-columns: 1fr;
             text-align: center;
          }

          .coaches-content {
             display: flex;
             flex-direction: column;
             align-items: center;
          }

          .coaches-content h2 { font-size: 1.9rem; }
          .coaches-content p { margin: 0 auto 40px; }

          .coaches-images {
             justify-content: center;
             margin-top: 24px;
          }
        }

        @media (max-width: 600px) {
           .coaches-images {
              flex-direction: column;
           }

           .coaches-image-wrapper {
              width: 100%;
              max-width: 320px;
              margin: 0 auto;
           }

           .image-right {
              transform: translateY(0);
              margin-top: 24px;
           }
        }
      `}</style>
      </section>
   );
};

export default Coaches;
