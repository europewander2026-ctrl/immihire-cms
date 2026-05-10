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
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const planeRef = useRef(null);
  const guidePathRef = useRef(null);
  const glowPathRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const plane = planeRef.current;
    const guidePath = guidePathRef.current;
    const glowPath = glowPathRef.current;

    if (!section || !track || !plane || !guidePath || !glowPath) return;

    // Draw the zig-zag flight path
    const updateFlightPath = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const startY = height / 2;
      const amp = height * 0.25;

      let d = `M 0 ${startY}`;
      const cycles = 3;
      const cycleWidth = width / 1.5;

      for (let i = 0; i < cycles; i++) {
        const startX = i * cycleWidth;
        d += ` C ${startX + cycleWidth / 2} ${startY - amp}, ${startX + cycleWidth / 2} ${startY + amp}, ${startX + cycleWidth} ${startY}`;
      }

      guidePath.setAttribute('d', d);
      glowPath.setAttribute('d', d);
    };

    // Handle scroll — translate horizontal track + animate plane along path
    const handleScroll = () => {
      if (!section || !track) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let scrollPercentage = -rect.top / (rect.height - viewportHeight);
      scrollPercentage = Math.max(0, Math.min(scrollPercentage, 1));

      // 1. Move Track horizontally
      const trackWidth = track.scrollWidth;
      const windowWidth = window.innerWidth;
      const maxScroll = trackWidth - windowWidth + 100;
      const xMove = scrollPercentage * maxScroll;
      track.style.transform = `translateX(-${xMove}px)`;

      // 2. Move Plane along SVG Path
      try {
        const pathLen = guidePath.getTotalLength();
        const dist = scrollPercentage * (pathLen * 0.8);
        const point = guidePath.getPointAtLength(dist);
        const nextPoint = guidePath.getPointAtLength(dist + 10);
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

        plane.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`;

        // 3. Animate glow trail
        glowPath.style.strokeDasharray = pathLen;
        glowPath.style.strokeDashoffset = pathLen - dist;
      } catch (e) {
        // Path not ready yet
      }
    };

    updateFlightPath();
    handleScroll();

    window.addEventListener('resize', updateFlightPath);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', updateFlightPath);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderSteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <>
      <style>{`
        .horizontal-section { position: relative; height: 400vh; }
        .sticky-wrapper {
          position: sticky; top: 0; height: 100vh; overflow: hidden;
          display: flex; align-items: center; background-color: #000814;
        }
        .horizontal-track {
          display: flex; gap: 10vw; padding-left: 10vw; padding-right: 10vw;
          width: max-content; will-change: transform;
        }
        .process-card {
          width: 80vw; max-width: 500px; flex-shrink: 0; padding: 3rem;
          background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 2rem;
          transition: all 0.3s ease;
        }
        .process-card:hover {
          background: rgba(255, 255, 255, 0.1); transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); border-color: rgba(13, 95, 183, 0.5);
        }
        .step-number {
          font-size: 8rem; font-weight: 800; position: absolute; top: -2rem; right: -1rem;
          opacity: 0.1; font-family: 'Montserrat', sans-serif;
          background: linear-gradient(to bottom, #fff, transparent);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
      `}</style>

      <section ref={sectionRef} id="process-journey" className="horizontal-section">
        <div className="sticky-wrapper">
          {/* Background Glows */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-blue-900/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] bg-purple-900/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* SVG Flight Path */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              {/* Faint guide path */}
              <path
                ref={guidePathRef}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
              {/* Glowing animated path */}
              <path
                ref={glowPathRef}
                fill="none"
                stroke="#0d5fb7"
                strokeWidth="3"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(13,95,183,0.8)]"
              />
            </svg>

            {/* The Plane */}
            <div
              ref={planeRef}
              className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform"
            >
              <i className="fa-solid fa-plane text-3xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]"></i>
            </div>
          </div>

          {/* Intro Text */}
          <div className="absolute left-10 md:left-20 top-1/2 transform -translate-y-1/2 z-10 w-64 md:w-80">
            <h4 className="text-blue-400 font-bold uppercase tracking-widest mb-4">{tagline}</h4>
            <h2 className="text-white font-heading font-bold text-4xl md:text-5xl leading-tight mb-6">
              {titleStandard} <br />
              <span className="text-primary">{titleHighlight}</span>
            </h2>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <i className="fa-solid fa-arrow-right animate-bounce"></i> Scroll to fly
            </div>
          </div>

          {/* Horizontal Track */}
          <div
            ref={trackRef}
            className="horizontal-track transform translate-x-[20vw] md:translate-x-[40vw]"
          >
            {renderSteps.map((step, i) => (
              <div key={i} className="process-card text-white group">
                <span className="step-number">{step.number}</span>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${step.iconBg || 'bg-blue-600'} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-glow`}>
                    <i className={step.iconClass}></i>
                  </div>
                  <h3 className="text-2xl font-bold font-heading mb-4">{step.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{step.description}</p>
                </div>
              </div>
            ))}

            {/* Final destination card */}
            <div className="flex items-center justify-center h-full w-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse text-darkBlue text-4xl">
                  <i className="fa-solid fa-flag-checkered"></i>
                </div>
                <h3 className="text-white font-bold text-3xl mb-2">Welcome Home</h3>
                <p className="text-gray-400">Your new life begins here.</p>
                <Link
                  to="/contact"
                  className="mt-8 inline-block px-8 py-3 bg-primary rounded-full text-white font-bold hover:bg-blue-600 transition-colors"
                >
                  Start Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default JourneySection;
