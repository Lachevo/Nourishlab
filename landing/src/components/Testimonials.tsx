import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Abeba Kebede',
    role: '35, Client',
    content: 'I finally have a plan that fits my busy life in Addis – the portal makes tracking effortless!',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Dawit Mengistu',
    role: 'Client',
    content: 'My consultant actually listens and adjusts – down 8 kg and feeling amazing. Science-backed guidance that really works.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Selam Haile',
    role: 'Health Transformation',
    content: 'I used to struggle with constant fatigue and bloating. After following the experts\' advice, my digestion has never been better. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?q=80&w=400&auto=format&fit=crop'
  },
  {
    name: 'Yonas Tesfaye',
    role: 'Muscle Building',
    content: 'The level of detail in the nutrition plans is incredible. I\'ve seen significant progress in my fitness goals while feeling much better overall.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <section className="testimonials" id="testimonials">
      <div className="container testimonials-container">
        <div className="testimonials-header">
          <motion.div
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="testimonials-badge">SUCCESS STORIES</span>
            <h2>Loved by Our Community</h2>
          </motion.div>
        </div>

        <div className="slider-wrapper">
          <button className="slider-nav-btn prev" onClick={prevSlide} aria-label="Previous testimonial">
            <ChevronLeft size={24} />
          </button>

          <div className="slider-content-area">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.3 }
                }}
                className="testimonial-card-xl"
              >
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                  ))}
                </div>

                <p className="testimonial-text-xl">
                  "{testimonials[currentIndex].content}"
                </p>

                <div className="testimonial-profile">
                  <div className="profile-img-wrapper">
                    <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
                  </div>
                  <div className="profile-info">
                    <h4 className="profile-name">{testimonials[currentIndex].name}</h4>
                    <span className="profile-role">{testimonials[currentIndex].role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="slider-nav-btn next" onClick={nextSlide} aria-label="Next testimonial">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="slider-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .testimonials {
          padding: 140px 0;
          background-color: transparent;
          position: relative;
          overflow: hidden;
        }

        .testimonials-header {
          text-align: center;
          margin-bottom: 64px;
        }

        .testimonials-badge {
          display: inline-block;
          color: var(--color-accent);
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .testimonials-header h2 {
          font-size: 2.8rem;
          color: var(--color-text);
          letter-spacing: -0.02em;
          font-weight: 700;
        }

        .slider-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .slider-content-area {
          flex: 1;
          max-width: 800px;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .testimonial-card-xl {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          padding: 60px 80px;
          border-radius: 40px;
          box-shadow: 0 20px 60px rgba(16, 43, 32, 0.08), inset 0 1px 0 rgba(255,255,255,1);
          text-align: left;
          width: 100%;
        }

        .rating-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 32px;
          color: #FFD700;
        }

        .testimonial-text-xl {
          font-size: 1.5rem;
          line-height: 1.6;
          color: var(--color-primary);
          margin-bottom: 40px;
          font-weight: 400;
          font-style: italic;
          font-family: var(--font-serif, serif);
        }

        .testimonial-profile {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .profile-img-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--color-accent);
          box-shadow: 0 4px 12px rgba(184, 156, 93, 0.2);
        }

        .profile-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-name {
          margin: 0;
          font-size: 1.25rem;
          color: var(--color-primary);
          font-weight: 700;
        }

        .profile-role {
          font-size: 0.9rem;
          color: var(--color-text-light);
          font-weight: 500;
          opacity: 0.8;
        }

        .slider-nav-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 1px solid rgba(16, 43, 32, 0.1);
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(12px);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex-shrink: 0;
        }

        .slider-nav-btn:hover {
          background: var(--color-primary);
          color: var(--color-white);
          transform: scale(1.1);
          border-color: var(--color-primary);
        }

        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 48px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(16, 43, 32, 0.1);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot.active {
          background: var(--color-accent);
          width: 32px;
          border-radius: 6px;
        }

        @media (max-width: 960px) {
          .testimonial-card-xl {
            padding: 40px;
          }
          .testimonial-text-xl {
            font-size: 1.2rem;
          }
          .slider-wrapper {
            gap: 20px;
          }
          .slider-nav-btn {
            width: 48px;
            height: 48px;
          }
        }

        @media (max-width: 768px) {
          .slider-nav-btn {
            display: none;
          }
          .testimonial-card-xl {
            padding: 30px 20px;
            border-radius: 24px;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
