import React, { useState, useEffect } from 'react';
import RevealWrapper from '../components/RevealWrapper';
import ThreeGlobe from '../components/ThreeGlobe';
import MagneticButton from '../components/MagneticButton';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const [dubaiTime, setDubaiTime] = useState({ time: '--:--', isOpen: false, sky: 'sky-day' });
  const [torontoTime, setTorontoTime] = useState({ time: '--:--', isOpen: false, sky: 'sky-night' });

  useEffect(() => {
    const updateOfficeStatus = () => {
      const now = new Date();
      
      const dubaiDate = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dubai" }));
      const dubaiHour = dubaiDate.getHours();
      setDubaiTime({
        time: dubaiDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isOpen: dubaiHour >= 9 && dubaiHour < 18,
        sky: (dubaiHour >= 6 && dubaiHour < 18) ? 'sky-day' : 'sky-night'
      });

      const torontoDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
      const torontoHour = torontoDate.getHours();
      setTorontoTime({
        time: torontoDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isOpen: torontoHour >= 9 && torontoHour < 18,
        sky: (torontoHour >= 6 && torontoHour < 18) ? 'sky-day' : 'sky-night'
      });
    };

    const interval = setInterval(updateOfficeStatus, 1000);
    updateOfficeStatus();
    return () => clearInterval(interval);
  }, []);

  const handleContactForm = (e) => {
    e.preventDefault();
    setIsSending(true);
    // Simulate sending logic
    setTimeout(() => {
      setIsSending(false);
      setSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const renderSky = (sky) => {
    if (sky === 'sky-day') {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#60a5fa] to-[#bfdbfe]">
          <div className="absolute top-5 right-5 w-10 h-10 bg-[#fbbf24] rounded-full shadow-[0_0_20px_#fbbf24]"></div>
        </div>
      );
    } else {
      const stars = Array.from({ length: 15 }).map((_, i) => (
        <div 
          key={i} 
          className="absolute bg-white w-0.5 h-0.5 rounded-full animate-pulse"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}
        />
      ));
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
          <div className="absolute top-5 right-5 w-8 h-8 bg-[#e2e8f0] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          {stars}
        </div>
      );
    }
  };

  return (
    <div className="text-gray-800">
      {/* 3D Background Canvas */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 bg-[#000814]">
        <ThreeGlobe />
      </div>

      {/* Hero Overlay */}
      <section className="relative min-h-screen flex items-center justify-center text-white pointer-events-none">
        <div className="container mx-auto px-6 relative z-10 text-center pointer-events-auto">
          <RevealWrapper>
            <div className="inline-block px-4 py-1 rounded-full border border-blue-500/50 bg-blue-900/30 text-blue-400 font-mono text-xs uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
              ● Live Global Network
            </div>
            <h1 className="font-heading font-bold text-5xl md:text-8xl mb-8 leading-tight drop-shadow-[0_0_15px_rgba(13,95,183,0.5)]">
              Connect Across <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">
                Borders.
              </span>
            </h1>
          </RevealWrapper>

          <RevealWrapper delay={200}>
            <p className="text-blue-100/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Visualize your journey. Our team is ready to guide you from any point on the map to your dream destination.
            </p>
          </RevealWrapper>

          <RevealWrapper delay={300}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="#form" className="px-10 py-5 bg-white text-darkBlue font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Start a Conversation
              </a>
              <a href="#offices" className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm">
                Locate Offices
              </a>
            </div>
          </RevealWrapper>
        </div>

        {/* Gradient fade to content */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#f8f9fa] to-transparent z-0"></div>
      </section>

      {/* Section 2: Contact Form */}
      <section id="form" className="py-24 bg-gray-50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row -mt-20">
            {/* Info Side */}
            <div className="lg:w-1/3 bg-darkBlue p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl mb-6">Contact Information</h3>
                <p className="text-blue-200 mb-12 text-sm leading-relaxed">Fill up the form and our Team will get back to you within 24 hours.</p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="font-bold text-lg">+971 50 752 6626</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold text-lg">info@immihire.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Location</p>
                      <p className="font-bold text-lg">Dubai, UAE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:w-2/3 p-12 lg:p-16">
              <form className="space-y-8" onSubmit={handleContactForm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="John" required />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Doe" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="john@example.com" required />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="+971..." />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all" placeholder="Write your message..."></textarea>
                </div>

                <div className="flex justify-end relative">
                  <button type="submit" disabled={isSending} className={`bg-primary text-white font-bold rounded-xl px-10 py-4 shadow-lg hover:shadow-primary/40 transition-all flex items-center gap-3 overflow-hidden ${isSending ? 'opacity-80' : ''}`}>
                    <span className={`transition-opacity ${isSending ? 'opacity-0' : 'opacity-100'}`}>Send Message</span>
                    <i className={`fa-solid fa-paper-plane text-lg transition-transform ${isSending ? 'translate-x-[500px] -translate-y-[500px] scale-0' : ''}`}></i>
                  </button>
                  {success && (
                    <div className="absolute right-[200px] top-1/2 transform -translate-y-1/2 text-green-600 font-bold">
                      <i className="fa-solid fa-check-circle mr-2"></i> Message Sent!
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Office Status */}
      <section id="offices" className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl text-center text-darkBlue mb-16">Global Offices</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl overflow-hidden relative transition-transform duration-300 hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] group">
              <div className="relative h-[120px] overflow-hidden transition-all duration-1000">
                {renderSky(dubaiTime.sky)}
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-8 right-8 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl border border-gray-100">🇦🇪</div>
                <h3 className="font-heading font-bold text-2xl text-darkBlue mb-1">Dubai HQ</h3>
                <p className="text-primary font-bold text-sm mb-4">
                  {dubaiTime.time} 
                  <span className={dubaiTime.isOpen ? "text-green-600 ml-2" : "text-red-500 ml-2"}>
                    ● {dubaiTime.isOpen ? "Open Now" : "Closed"}
                  </span>
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">Office 402, Business Bay<br />Dubai, United Arab Emirates</p>
                <a href="#" className="inline-flex items-center text-sm font-bold text-darkBlue hover:text-primary gap-2">
                  <i className="fa-solid fa-diamond-turn-right"></i> Get Directions
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl overflow-hidden relative transition-transform duration-300 hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] group">
              <div className="relative h-[120px] overflow-hidden transition-all duration-1000">
                {renderSky(torontoTime.sky)}
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-8 right-8 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl border border-gray-100">🇨🇦</div>
                <h3 className="font-heading font-bold text-2xl text-darkBlue mb-1">Toronto</h3>
                <p className="text-primary font-bold text-sm mb-4">
                  {torontoTime.time} 
                  <span className={torontoTime.isOpen ? "text-green-600 ml-2" : "text-red-500 ml-2"}>
                    ● {torontoTime.isOpen ? "Open Now" : "Closed"}
                  </span>
                </p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">King Street West, Suite 300<br />Toronto, ON, Canada</p>
                <a href="#" className="inline-flex items-center text-sm font-bold text-darkBlue hover:text-primary gap-2">
                  <i className="fa-solid fa-diamond-turn-right"></i> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
