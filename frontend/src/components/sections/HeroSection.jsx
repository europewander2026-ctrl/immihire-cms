import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ title, subtitle, bgImage, ctaText, ctaLink, description }) => {
  return (
    <section className="relative min-h-[120vh] flex flex-col items-center pt-48 pb-20 bg-[#000814] text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={bgImage || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop"} className="w-full h-full object-cover opacity-50" alt="Background" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/70 via-[#000814]/40 to-[#f8f9fa]"></div>
      </div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>

      <div className="container mx-auto px-6 relative z-10 text-center mb-16">
        <div className="reveal active">
          {title ? (
            <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-lg" dangerouslySetInnerHTML={{ __html: title }} />
          ) : (
            <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-lg">
              Best Immigration <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">Services in Dubai</span>
            </h1>
          )}
          
          <h2 className="font-medium text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
            {subtitle || "ImmiHire Immigration and Management Consultants"}
          </h2>
          
          <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow">
            {description || "An exclusive premier immigration consultancy with over 10 years of experience. We combine your needs with our expertise."}
          </p>

          {ctaText && ctaLink && (
             <Link to={ctaLink} className="inline-block px-10 py-5 bg-primary text-white font-bold rounded-full hover:bg-blue-600 transition-all shadow-[0_0_30px_rgba(13,95,183,0.3)]">
                {ctaText}
             </Link>
          )}
        </div>
      </div>

      {!ctaLink && (
        <div className="container mx-auto px-4 relative z-20 w-full max-w-6xl mt-auto">
          <div className="cloud-form rounded-[3rem] p-10 md:p-14 text-gray-800 animate-float" style={{ background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1), inset 0 0 80px rgba(255, 255, 255, 0.5)' }}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200/50 pb-6">
              <div>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-darkBlue mb-2">Book Your Free Consultation</h3>
                <p className="text-gray-500 text-sm">Expert advice is just a click away.</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-1 bg-blue-50 text-primary text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100">
                Free Assessment
              </div>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={(e) => { e.preventDefault(); alert('Assessment submitted successfully!'); }}>
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
      )}
    </section>
  );
};

export default HeroSection;
