import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const defaultSteps = [
  {
    number: '01',
    iconClass: 'fa-solid fa-clipboard-check',
    iconBg: 'bg-blue-600',
    title: 'Profile Assessment',
    description: "We don't guess. We calculate. Using our proprietary AI-grid, we analyze your eligibility across 50+ streams."
  },
  {
    number: '02',
    iconClass: 'fa-solid fa-file-signature',
    iconBg: 'bg-purple-600',
    title: 'Strategic Filing',
    description: 'Precision is key. Our legal team prepares your dossier, drafts legal submissions, and ensures your application is error-free.'
  },
  {
    number: '03',
    iconClass: 'fa-solid fa-plane-departure',
    iconBg: 'bg-green-600',
    title: 'Approval & Flight',
    description: 'We monitor your application 24/7. Upon approval, we assist with landing formalities and housing in your new country.'
  }
];

const JourneySection = ({
  tagline = 'The Journey',
  titleStandard = 'How We',
  titleHighlight = 'Make It Happen',
  steps = defaultSteps
}) => {
  const renderSteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <>
      <style>{`
        .vertical-journey { 
          position: relative; 
          background-color: #000814; 
          overflow: hidden;
        }
        .process-card {
          padding: 3rem;
          background: rgba(255, 255, 255, 0.05); 
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1); 
          border-radius: 2rem;
          transition: all 0.3s ease;
          position: relative;
        }
        .process-card:hover {
          background: rgba(255, 255, 255, 0.1); 
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); 
          border-color: rgba(13, 95, 183, 0.5);
        }
        .step-number {
          font-size: 6rem; font-weight: 800; position: absolute; top: -1rem; right: 1rem;
          opacity: 0.1; font-family: 'Montserrat', sans-serif;
          background: linear-gradient(to bottom, #fff, transparent);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
      `}</style>

      <section id="process-journey" className="vertical-journey py-24 md:py-32">
        {/* Background Glows */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-blue-900/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] bg-purple-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-16 md:mb-24">
            <h4 className="text-blue-400 font-bold uppercase tracking-widest mb-4">{tagline}</h4>
            <h2 className="text-white font-heading font-bold text-4xl md:text-6xl leading-tight">
              {titleStandard} <span className="text-primary">{titleHighlight}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {renderSteps.map((step, i) => (
              <div key={i} className="process-card text-white group">
                <span className="step-number">{step.number || `0${i+1}`}</span>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${step.iconBg || 'bg-blue-600'} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-glow transition-transform group-hover:scale-110`}>
                    <i className={step.iconClass || 'fa-solid fa-check'}></i>
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-4">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final destination / CTA */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-darkBlue text-3xl shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <i className="fa-solid fa-flag-checkered"></i>
            </div>
            <h3 className="text-white font-bold text-3xl md:text-4xl mb-4">Welcome Home</h3>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">Your new life begins here. Let our experts handle the complexity while you focus on your future.</p>
            <Link
              to="/contact"
              className="inline-block px-10 py-4 bg-primary rounded-full text-white font-bold hover:bg-blue-600 transition-all hover:scale-105 shadow-lg"
            >
              Start Your Process Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default JourneySection;
