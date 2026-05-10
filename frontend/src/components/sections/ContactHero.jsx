import React, { useEffect } from 'react';
import ThreeGlobe from '../ThreeGlobe';

const ContactHero = ({
  tagline = "● Live Global Network",
  heading = "Connect Across Borders.",
  description = "Visualize your journey. Our team is ready to guide you from any point on the map to your dream destination.",
  image = null,
  badgeSubtitle = "Certified",
  badgeTitle = "CICC & MARA"
}) => {

  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <>
      <style>{`
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(5px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
      `}</style>

      {/* 3D Background Canvas or Custom Image */}
      {image ? (
        <div className="absolute inset-0 z-0">
          <img src={image} className="w-full h-full object-cover" alt="Hero Background" />
          <div className="absolute inset-0 bg-darkBlue/60 backdrop-blur-[2px]"></div>
        </div>
      ) : (
        <ThreeGlobe />
      )}

      {/* Hero Overlay */}
      <section className="relative min-h-screen flex items-center justify-center text-white pointer-events-none">
        <div className="container mx-auto px-6 relative z-10 text-center pointer-events-auto">
          <div className="inline-block px-4 py-1 rounded-full border border-blue-500/50 bg-blue-900/30 text-blue-400 font-mono text-xs uppercase tracking-[0.2em] mb-6 reveal active backdrop-blur-sm">
            {tagline}
          </div>

          <h1 className="font-heading font-bold text-5xl md:text-8xl mb-8 leading-tight reveal active delay-100 drop-shadow-[0_0_15px_rgba(13,95,183,0.5)]">
            {heading}
          </h1>

          <p className="text-blue-100/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto reveal active delay-200 leading-relaxed font-light">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center reveal active delay-300">
            <a href="#form" className="px-10 py-5 bg-white text-darkBlue font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Start a Conversation
            </a>

            <div className="hidden sm:flex items-center gap-4 text-left border-l border-white/20 pl-6 ml-6">
              <div>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">{badgeSubtitle}</p>
                <p className="text-sm font-bold">{badgeTitle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient fade to content */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#f8f9fa] to-transparent z-0"></div>
      </section>
    </>
  );
};

export default ContactHero;
