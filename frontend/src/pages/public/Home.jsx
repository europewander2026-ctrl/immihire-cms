import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import SpotlightCinema from '../../components/sections/SpotlightCinema';
import EligibilityPulse from '../../components/sections/EligibilityPulse';
import KineticAccordion from '../../components/sections/KineticAccordion';

const Home = () => {
  const [latestInsights, setLatestInsights] = useState([]);
  
  const processSectionRef = useRef(null);
  const trackRef = useRef(null);
  const planeContainerRef = useRef(null);
  const guidePathRef = useRef(null);
  const glowPathRef = useRef(null);
  const svgRef = useRef(null);

  // Fetch Insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/api/insights');
        if (res.data && Array.isArray(res.data)) {
          // Get top 3 most recent
          setLatestInsights(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch latest insights:', err);
      }
    };
    fetchInsights();
  }, []);

  // Zig-Zag Flight Path Logic
  useEffect(() => {
    const updateFlightPath = () => {
      if (!svgRef.current || !guidePathRef.current || !glowPathRef.current) return;
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

      guidePathRef.current.setAttribute('d', d);
      glowPathRef.current.setAttribute('d', d);
    };

    window.addEventListener('resize', updateFlightPath);
    updateFlightPath(); 

    const handleScroll = () => {
      if (!processSectionRef.current || !trackRef.current || !guidePathRef.current || !glowPathRef.current || !planeContainerRef.current) return;

      const rect = processSectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      let scrollPercentage = -rect.top / (rect.height - viewportHeight);
      scrollPercentage = Math.max(0, Math.min(scrollPercentage, 1));

      // 1. Move Track
      const trackWidth = trackRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      const maxScroll = trackWidth - windowWidth + 100;
      const xMove = scrollPercentage * maxScroll;
      trackRef.current.style.transform = `translateX(-${xMove}px)`;

      // 2. Move Plane
      const pathLen = guidePathRef.current.getTotalLength();
      if(pathLen === 0) return; // safeguard if path not yet calculated

      const dist = scrollPercentage * (pathLen * 0.8); 
      const point = guidePathRef.current.getPointAtLength(dist);
      
      // Calculate angle by looking slightly ahead
      let nextPoint = point;
      if (dist + 10 <= pathLen) {
        nextPoint = guidePathRef.current.getPointAtLength(dist + 10); 
      }
      const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

      planeContainerRef.current.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`;

      // 3. Draw Glow Path
      glowPathRef.current.style.strokeDasharray = pathLen;
      glowPathRef.current.style.strokeDashoffset = pathLen - dist;
    };

    window.addEventListener('scroll', handleScroll);
    
    // Reveal Animation
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
    reveal(); // Trigger on mount

    return () => {
      window.removeEventListener('resize', updateFlightPath);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener("scroll", reveal);
    };
  }, []);

  const handleHomeForm = (e) => {
    e.preventDefault();
    alert('Assessment submitted successfully!');
  };

  const homePanels = [
    {
      title: "What is your success rate?",
      content: "We maintain an exceptional success rate of over 95% across all our major visa categories, thanks to our rigorous initial eligibility screening."
    },
    {
      title: "How long does the process take?",
      content: "Processing times vary significantly by country and visa type. Canada Express Entry typically takes 6-8 months, while Schengen work permits can be processed in 4-8 weeks."
    },
    {
      title: "Do you guarantee a visa?",
      content: "While no consultancy can legally guarantee a visa (as final decisions rest with the respective immigration authorities), our expertise ensures your application has the absolute highest probability of success."
    }
  ];

  return (
    <div className="text-gray-800 overflow-x-hidden min-h-screen bg-[#f8f9fa]">
      <SEOHead 
        title="ImmiHire | Best Immigration Services in Dubai"
        description="ImmiHire is Dubai's premier immigration consultancy. We specialize in Canada Express Entry, Australia SkillSelect, USA Business Visas, and European Work Permits."
      />

      <style>{`
        .cloud-form {
            background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
            border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), inset 0 0 80px rgba(255, 255, 255, 0.5);
        }
        .bento-card {
            background: white; border-radius: 24px; overflow: hidden; position: relative;
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
            border: 1px solid rgba(0, 0, 0, 0.03);
        }
        .bento-card:hover { transform: scale(1.02); box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1); z-index: 10; }
        .bento-card img { transition: transform 0.7s ease; }
        .bento-card:hover img { transform: scale(1.1); }
        .horizontal-section { position: relative; height: 400vh; }
        .sticky-wrapper { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; align-items: center; background-color: #000814; }
        .horizontal-track { display: flex; gap: 10vw; padding-left: 10vw; padding-right: 50vw; width: max-content; will-change: transform; }
        .process-card {
            width: 80vw; max-width: 500px; flex-shrink: 0; padding: 3rem; background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 2rem; transition: all 0.3s ease;
        }
        .process-card:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); border-color: rgba(13, 95, 183, 0.5); }
        .step-number {
            font-size: 8rem; font-weight: 800; position: absolute; top: -2rem; right: -1rem; opacity: 0.1;
            font-family: 'Montserrat', sans-serif; background: linear-gradient(to bottom, #fff, transparent); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .reveal { opacity: 0; transform: translateY(30px); filter: blur(5px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); filter: blur(0); }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-[120vh] flex flex-col items-center pt-48 pb-20 bg-[#000814] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/70 via-[#000814]/40 to-[#f8f9fa]"></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-6 relative z-10 text-center mb-16">
          <div className="reveal active">
            <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-lg">
              Best Immigration <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Services in Dubai</span>
            </h1>
            <h2 className="font-medium text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
              ImmiHire Immigration and Management Consultants
            </h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow">
              An exclusive premier immigration consultancy with over 10 years of experience. We combine your needs with our expertise.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-20 w-full max-w-6xl mt-auto">
          <div className="cloud-form rounded-[3rem] p-10 md:p-14 text-gray-800 animate-float">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200/50 pb-6">
              <div>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-darkBlue mb-2">Book Your Free Consultation</h3>
                <p className="text-gray-500 text-sm">Expert advice is just a click away.</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-1 bg-blue-50 text-primary text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100">
                Free Assessment
              </div>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleHomeForm}>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Name</label>
                <input type="text" placeholder="First Name" required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Surname</label>
                <input type="text" placeholder="Last Name" required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Contact</label>
                <input type="email" placeholder="Email Address" required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Phone</label>
                <input type="tel" placeholder="+971..." required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Destination</label>
                <select required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all text-gray-500 shadow-sm appearance-none">
                  <option value="">Select Country</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>UK</option>
                  <option>Germany</option>
                  <option>USA</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Residence</label>
                <input type="text" placeholder="Country of Residence" className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Education</label>
                <input type="text" placeholder="Highest Degree" className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Occupation</label>
                <input type="text" placeholder="Current Job Title" className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="magnetic-btn w-full bg-gradient-to-r from-primary to-blue-700 text-white font-heading font-bold text-lg py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-1">
                  Get Free Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 reveal">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                <img src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?q=80&w=2574&auto=format&fit=crop" className="rounded-3xl shadow-lg relative z-10 w-full transform hover:scale-[1.02] transition-transform duration-500" alt="About Us" />
                <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white z-20 flex items-center gap-4 animate-bounce-slow">
                  <div className="text-4xl font-bold text-primary">10+</div>
                  <div className="text-xs font-bold text-darkBlue uppercase leading-tight">Years of<br />Excellence</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 reveal">
              <h4 className="text-primary font-bold uppercase tracking-widest mb-3 text-sm">Who We Are</h4>
              <h2 className="font-heading font-bold text-4xl text-darkBlue mb-6 leading-tight">
                Bridging Talent to <span className="text-primary">Global Opportunity</span>
              </h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                ImmiHire Management Consultancy is Dubai's premier immigration advisory firm, dedicated to simplifying the complex pathways to Canada, Australia, the USA, and Europe. We don't just process applications; we build strategies. From skilled worker visas to business migration, we bridge the gap between your potential and your future destination with transparency, speed, and integrity.
              </p>
              <div className="grid grid-cols-1 gap-4 mb-8">
                <div className="text-primary font-bold text-sm uppercase tracking-wider">Licensed & Certified Consultants</div>
                <div className="text-primary font-bold text-sm uppercase tracking-wider">Transparent, Flat-Fee Pricing</div>
                <div className="text-primary font-bold text-sm uppercase tracking-wider">End-to-End Resettlement Support</div>
              </div>
              <Link to="/about" className="text-primary font-bold hover:gap-3 transition-all inline-flex items-center gap-2">
                Read Our Story <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic React Components Integration */}
      <EligibilityPulse />

      {/* Bento Grid Countries */}
      <section id="countries" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">Our Countries</h2>
            <p className="text-gray-500 text-lg">Migrate for a better future. Explore your options.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-6 h-auto lg:h-[800px]">
            <Link to="/services/canada-express-entry" className="bento-card col-span-1 md:col-span-2 row-span-2 group cursor-pointer reveal">
              <img src="https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2565&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Canada" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-heading font-bold text-4xl mb-2">Canada</h3>
                  <p className="text-gray-200 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">The #1 destination for skilled workers. Express Entry, PNP & Study Visas.</p>
                  <span className="inline-block mt-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30">Most Popular</span>
                </div>
              </div>
            </Link>
            <Link to="/services/germany-opportunity-card" className="bento-card col-span-1 row-span-1 group cursor-pointer reveal" style={{ transitionDelay: '100ms' }}>
              <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Germany" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-heading font-bold text-2xl mb-1">Germany</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Opportunity Card</p>
              </div>
            </Link>
            <Link to="/services/australia-skillselect" className="bento-card col-span-1 row-span-2 group cursor-pointer reveal" style={{ transitionDelay: '200ms' }}>
              <img src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2730&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Australia" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-heading font-bold text-3xl mb-2">Australia</h3>
                  <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">SkillSelect & Subclass 189/190. High quality of life.</p>
                </div>
              </div>
            </Link>
            <Link to="/services/uk-global-talent" className="bento-card col-span-1 row-span-1 group cursor-pointer reveal" style={{ transitionDelay: '300ms' }}>
              <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="United Kingdom" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-heading font-bold text-2xl mb-1">United Kingdom</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Global Talent Visa</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <SpotlightCinema />

      {/* Horizontal Journey with Zig-Zag Flight Path */}
      <section id="process-journey" className="horizontal-section" ref={processSectionRef}>
        <div className="sticky-wrapper">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-blue-900/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] bg-purple-900/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg ref={svgRef} className="w-full h-full" preserveAspectRatio="none">
              <path ref={guidePathRef} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="8 4"></path>
              <path ref={glowPathRef} fill="none" stroke="#0d5fb7" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(13,95,183,0.8)]"></path>
            </svg>
            <div ref={planeContainerRef} className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform">
              <i className="fa-solid fa-plane text-3xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]"></i>
            </div>
          </div>

          <div className="absolute left-10 md:left-20 top-1/2 transform -translate-y-1/2 z-10 w-64 md:w-80">
            <h4 className="text-blue-400 font-bold uppercase tracking-widest mb-4">The Journey</h4>
            <h2 className="text-white font-heading font-bold text-4xl md:text-5xl leading-tight mb-6">
              How We <br /><span className="text-primary">Make It Happen</span>
            </h2>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <i className="fa-solid fa-arrow-right animate-bounce-horizontal"></i> Scroll to fly
            </div>
          </div>

          <div ref={trackRef} className="horizontal-track transform translate-x-[20vw] md:translate-x-[40vw]">
            <div className="process-card text-white group">
              <span className="step-number">01</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-glow">
                  <i className="fa-solid fa-clipboard-check"></i>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Profile Assessment</h3>
                <p className="text-gray-300 leading-relaxed mb-6">We don't guess. We calculate. Using our proprietary AI-grid, we analyze your eligibility across 50+ streams.</p>
              </div>
            </div>
            <div className="process-card text-white group">
              <span className="step-number">02</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-glow">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Strategic Filing</h3>
                <p className="text-gray-300 leading-relaxed mb-6">Precision is key. Our legal team prepares your dossier, drafts legal submissions, and ensures your application is error-free.</p>
              </div>
            </div>
            <div className="process-card text-white group">
              <span className="step-number">03</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-glow">
                  <i className="fa-solid fa-plane-departure"></i>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Approval & Flight</h3>
                <p className="text-gray-300 leading-relaxed mb-6">We monitor your application 24/7. Upon approval, we assist with landing formalities and housing in your new country.</p>
              </div>
            </div>
            <div className="flex items-center justify-center h-full w-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse text-darkBlue text-4xl">
                  <i className="fa-solid fa-flag-checkered"></i>
                </div>
                <h3 className="text-white font-bold text-3xl mb-2">Welcome Home</h3>
                <p className="text-gray-400">Your new life begins here.</p>
                <Link to="/contact" className="mt-8 inline-block px-8 py-3 bg-primary rounded-full text-white font-bold hover:bg-blue-600 transition-colors">
                  Start Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KineticAccordion panels={homePanels} />

      {/* Latest Insights Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-between items-end mb-12">
            <div className="reveal">
              <h4 className="text-primary font-bold uppercase tracking-widest mb-2 text-sm">Stay Updated</h4>
              <h2 className="font-heading font-bold text-4xl text-darkBlue">Latest Insights</h2>
            </div>
            <Link to="/insights" className="hidden md:inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all reveal">
              View All Articles <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {latestInsights.length > 0 ? (
              latestInsights.map((insight) => (
                <Link to={`/insights/${insight.slug}`} key={insight.id} className="group reveal cursor-pointer block">
                  <div className="rounded-2xl overflow-hidden mb-6 relative aspect-video">
                    <img 
                      src={insight.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop'} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                      alt={insight.title}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                      {insight.category || 'News'}
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs font-mono mb-2">
                    {new Date(insight.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <h3 className="font-heading font-bold text-xl text-darkBlue mb-3 group-hover:text-primary transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {insight.excerpt || insight.content?.substring(0, 100).replace(/<[^>]+>/g, '') + '...'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 italic py-10">
                Loading insights...
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center md:hidden reveal">
            <Link to="/insights" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
              View All Articles <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
