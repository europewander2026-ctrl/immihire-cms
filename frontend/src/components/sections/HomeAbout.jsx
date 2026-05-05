import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomeAbout = ({
  badgeNumber = '10+',
  badgeText = 'Years of\nExcellence',
  image = 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?q=80&w=2574&auto=format&fit=crop',
  tagline = 'Who We Are',
  titleStandard = 'Bridging Talent to',
  titleHighlight = 'Global Opportunity',
  description = "ImmiHire Management Consultancy is Dubai's premier immigration advisory firm, dedicated to simplifying the complex pathways to Canada, Australia, the USA, and Europe. We don't just process applications; we build strategies. From skilled worker visas to business migration, we bridge the gap between your potential and your future destination with transparency, speed, and integrity.",
  features = [
    'Licensed & Certified Consultants',
    'Transparent, Flat-Fee Pricing',
    'End-to-End Resettlement Support'
  ],
  ctaText = 'Read Our Story',
  ctaLink = '/about'
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
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Image Side */}
          <div className="lg:w-1/2 reveal">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
              <img
                src={image}
                className="rounded-3xl shadow-lg relative z-10 w-full transform hover:scale-[1.02] transition-transform duration-500"
                alt="About ImmiHire"
              />
              <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white z-20 flex items-center gap-4 animate-float">
                <div className="text-4xl font-bold text-primary">{badgeNumber}</div>
                <div className="text-xs font-bold text-darkBlue uppercase leading-tight whitespace-pre-line">
                  {badgeText}
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="lg:w-1/2 reveal">
            <h4 className="text-primary font-bold uppercase tracking-widest mb-3 text-sm">{tagline}</h4>
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-6 leading-tight">
              {titleStandard} <span className="text-primary">{titleHighlight}</span>
            </h2>
            <p className="text-gray-500 text-lg mb-6 leading-relaxed">{description}</p>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {(features || []).map((feature, i) => (
                <div key={i} className="text-primary font-bold text-sm uppercase tracking-wider">
                  {feature}
                </div>
              ))}
            </div>

            <Link
              to={ctaLink}
              className="text-primary font-bold hover:gap-3 transition-all inline-flex items-center gap-2"
            >
              {ctaText} <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
