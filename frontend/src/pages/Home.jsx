import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../components/MagneticButton';
import RevealWrapper from '../components/RevealWrapper';
import api from '../utils/api';

const Home = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    destination: '',
    residence: '',
    education: '',
    occupation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    // 4. Zig-Zag Flight Path Logic
    const processSection = document.getElementById('process-journey');
    const track = document.getElementById('process-track');
    const planeContainer = document.getElementById('plane-container');
    const guidePath = document.getElementById('flight-guide');
    const glowPath = document.getElementById('flight-glow');
    const svg = document.getElementById('flight-svg');

    // Draw the Zig-Zag Path dynamically
    function updateFlightPath() {
        if (!svg) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const startY = height / 2;
        const amp = height * 0.25; // Amplitude

        let d = `M 0 ${startY}`;
        const cycles = 3;
        const cycleWidth = width / 1.5;

        for (let i = 0; i < cycles; i++) {
            const startX = i * cycleWidth;
            d += ` C ${startX + cycleWidth / 2} ${startY - amp}, ${startX + cycleWidth / 2} ${startY + amp}, ${startX + cycleWidth} ${startY}`;
        }

        guidePath.setAttribute('d', d);
        glowPath.setAttribute('d', d);
    }

    window.addEventListener('resize', updateFlightPath);
    updateFlightPath();

    const handleScroll = () => {
        if (!processSection || !track) return;
        const rect = processSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        let scrollPercentage = -rect.top / (rect.height - viewportHeight);
        scrollPercentage = Math.max(0, Math.min(scrollPercentage, 1));

        const trackWidth = track.scrollWidth;
        const windowWidth = window.innerWidth;
        const maxScroll = trackWidth - windowWidth + 100;
        const xMove = scrollPercentage * maxScroll;
        track.style.transform = `translateX(-${xMove}px)`;

        const pathLen = guidePath.getTotalLength();
        const dist = scrollPercentage * (pathLen * 0.8);
        const point = guidePath.getPointAtLength(dist);
        const nextPoint = guidePath.getPointAtLength(dist + 10);
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);

        planeContainer.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`;
        glowPath.style.strokeDasharray = pathLen;
        glowPath.style.strokeDashoffset = pathLen - dist;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('resize', updateFlightPath);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleHomeForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        message: `Destination: ${formData.destination}\nResidence: ${formData.residence}\nEducation: ${formData.education}\nOccupation: ${formData.occupation}`
      };
      await api.post('/api/consultation', payload);
      setSuccessMsg('Consultation requested successfully. We will contact you soon!');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', destination: '', residence: '', education: '', occupation: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to submit consultation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-[120vh] flex flex-col items-center pt-48 pb-20 bg-[#000814] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/70 via-[#000814]/40 to-[#f8f9fa]"></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-6 relative z-10 text-center mb-16">
          <RevealWrapper>
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
          </RevealWrapper>
        </div>

        <div className="container mx-auto px-4 relative z-20 w-full max-w-6xl mt-auto">
          <div className="cloud-form rounded-[3rem] p-10 md:p-14 text-gray-800 animate-float bg-white/75 backdrop-blur-[30px] border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_80px_rgba(255,255,255,0.5)]">
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
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Surname</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Contact</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+971..." required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Destination</label>
                <select name="destination" value={formData.destination} onChange={handleChange} required className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all text-gray-500 shadow-sm appearance-none">
                  <option value="">Select Country</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="UK">UK</option>
                  <option value="Germany">Germany</option>
                  <option value="USA">USA</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Residence</label>
                <input type="text" name="residence" value={formData.residence} onChange={handleChange} placeholder="Country of Residence" className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Education</label>
                <input type="text" name="education" value={formData.education} onChange={handleChange} placeholder="Highest Degree" className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Occupation</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Current Job Title" className="w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm" />
              </div>
              <div className="flex flex-col items-center col-span-1 md:col-span-3">
                <MagneticButton type="submit" disabled={isSubmitting} className={`w-full bg-gradient-to-r from-primary to-blue-700 text-white font-heading font-bold text-lg py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-1 ${isSubmitting ? 'opacity-75' : ''}`}>
                  {isSubmitting ? 'Submitting...' : 'Get Free Consultation'}
                </MagneticButton>
                {successMsg && <p className="text-green-600 font-bold mt-4">{successMsg}</p>}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-32 bg-[#f8f9fa]"></div>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <RevealWrapper className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
                <img src="https://images.unsplash.com/photo-1577415124269-fc1140a69e91?q=80&w=2574&auto=format&fit=crop" className="rounded-3xl shadow-lg relative z-10 w-full transform hover:scale-[1.02] transition-transform duration-500" alt="About Us" />
                <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white z-20 flex items-center gap-4 animate-bounce-slow">
                  <div className="text-4xl font-bold text-primary">10+</div>
                  <div className="text-xs font-bold text-darkBlue uppercase leading-tight">Years of<br />Excellence</div>
                </div>
              </div>
            </RevealWrapper>
            <RevealWrapper className="lg:w-1/2">
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
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* Bento Grid Countries */}
      <section id="countries" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <RevealWrapper className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">Our Countries</h2>
            <p className="text-gray-500 text-lg">Migrate for a better future. Explore your options.</p>
          </RevealWrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-6 h-auto lg:h-[800px]">
            <RevealWrapper className="col-span-1 md:col-span-2 row-span-2 group cursor-pointer relative overflow-hidden rounded-3xl transition-transform hover:scale-[1.02] hover:z-10 shadow-sm border border-black/5 bento-card">
              <img src="https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2565&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Canada" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-heading font-bold text-4xl mb-2">Canada</h3>
                  <p className="text-gray-200 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    The #1 destination for skilled workers. Express Entry, PNP & Study Visas.
                  </p>
                  <span className="inline-block mt-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30">Most Popular</span>
                </div>
              </div>
            </RevealWrapper>
            
            <RevealWrapper className="col-span-1 row-span-1 group cursor-pointer relative overflow-hidden rounded-3xl transition-transform hover:scale-[1.02] hover:z-10 shadow-sm border border-black/5 bento-card" delay={100}>
              <img src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Germany" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-heading font-bold text-2xl mb-1">Germany</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Opportunity Card</p>
              </div>
            </RevealWrapper>
            
            <RevealWrapper className="col-span-1 row-span-2 group cursor-pointer relative overflow-hidden rounded-3xl transition-transform hover:scale-[1.02] hover:z-10 shadow-sm border border-black/5 bento-card" delay={200}>
              <img src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2730&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Australia" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-heading font-bold text-3xl mb-2">Australia</h3>
                  <p className="text-gray-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    SkillSelect & Subclass 189/190. High quality of life.
                  </p>
                </div>
              </div>
            </RevealWrapper>
            
            <RevealWrapper className="col-span-1 row-span-1 group cursor-pointer relative overflow-hidden rounded-3xl transition-transform hover:scale-[1.02] hover:z-10 shadow-sm border border-black/5 bento-card" delay={300}>
              <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="UK" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-white font-heading font-bold text-2xl mb-1">United Kingdom</h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity">Global Talent Visa</p>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* Horizontal Journey */}
      <section id="process-journey" className="relative h-[400vh]">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center bg-[#000814]">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-blue-900/30 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] bg-purple-900/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none">
            <svg id="flight-svg" className="w-full h-full" preserveAspectRatio="none">
              <path id="flight-guide" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="8 4"></path>
              <path id="flight-glow" fill="none" stroke="#0d5fb7" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(13,95,183,0.8)]"></path>
            </svg>
            <div id="plane-container" className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform">
              <i className="fa-solid fa-plane text-3xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)]"></i>
            </div>
          </div>

          <div className="absolute left-10 md:left-20 top-1/2 transform -translate-y-1/2 z-10 w-64 md:w-80">
            <h4 className="text-blue-400 font-bold uppercase tracking-widest mb-4">The Journey</h4>
            <h2 className="text-white font-heading font-bold text-4xl md:text-5xl leading-tight mb-6">How We <br /><span className="text-primary">Make It Happen</span></h2>
            <div className="flex items-center gap-2 text-white/50 text-sm"><i className="fa-solid fa-arrow-right animate-bounce-horizontal"></i> Scroll to fly</div>
          </div>

          <div id="process-track" className="flex gap-[10vw] pl-[10vw] pr-[50vw] w-max will-change-transform transform translate-x-[20vw] md:translate-x-[40vw]">
            <div className="w-[80vw] max-w-[500px] flex-shrink-0 p-12 bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-[2rem] transition-all duration-300 hover:bg-white/10 hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#0d5fb7]/50 text-white group relative">
              <span className="text-[8rem] font-[800] absolute -top-8 -right-4 opacity-10 font-heading bg-gradient-to-b from-white to-transparent bg-clip-text text-transparent">01</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-[0_0_15px_rgba(13,95,183,0.8)]">
                  <i className="fa-solid fa-clipboard-check"></i>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Profile Assessment</h3>
                <p className="text-gray-300 leading-relaxed mb-6">We don't guess. We calculate. Using our proprietary AI-grid, we analyze your eligibility across 50+ streams.</p>
              </div>
            </div>

            <div className="w-[80vw] max-w-[500px] flex-shrink-0 p-12 bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-[2rem] transition-all duration-300 hover:bg-white/10 hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#0d5fb7]/50 text-white group relative">
              <span className="text-[8rem] font-[800] absolute -top-8 -right-4 opacity-10 font-heading bg-gradient-to-b from-white to-transparent bg-clip-text text-transparent">02</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-[0_0_15px_rgba(147,51,234,0.8)]">
                  <i className="fa-solid fa-file-signature"></i>
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">Strategic Filing</h3>
                <p className="text-gray-300 leading-relaxed mb-6">Precision is key. Our legal team prepares your dossier, drafts legal submissions, and ensures your application is error-free.</p>
              </div>
            </div>

            <div className="w-[80vw] max-w-[500px] flex-shrink-0 p-12 bg-white/5 backdrop-blur-[10px] border border-white/10 rounded-[2rem] transition-all duration-300 hover:bg-white/10 hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-[#0d5fb7]/50 text-white group relative">
              <span className="text-[8rem] font-[800] absolute -top-8 -right-4 opacity-10 font-heading bg-gradient-to-b from-white to-transparent bg-clip-text text-transparent">03</span>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-[0_0_15px_rgba(22,163,74,0.8)]">
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
                <Link to="/contact" className="mt-8 inline-block px-8 py-3 bg-primary rounded-full text-white font-bold hover:bg-blue-600 transition-colors">Start Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
