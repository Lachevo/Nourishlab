import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
import Benefits from './components/Benefits';
import PortalPreview from './components/PortalPreview';
import Testimonials from './components/Testimonials';
import Coaches from './components/Coaches';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import FooterCTA from './components/FooterCTA';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app">
      {/* Animated background blobs and effects */}
      <div className="bg-animation" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="cursor-glow" />
        <div className="noise-overlay" />
      </div>
      <Header />
      <main>
        <Hero />
        <Process />
        <Benefits />
        <PortalPreview />
        <Testimonials />
        <Coaches />
        <Pricing />
        <FAQ />
        <Contact />
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
