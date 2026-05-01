import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';

const PillHeader = ({ logoUrl }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header id="header" className={`fixed z-50 pill-header py-3 px-8 flex justify-between items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] left-1/2 -translate-x-1/2 rounded-full border border-white/80 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02),0_20px_40px_-4px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(255,255,255,0.5)] ${scrolled ? 'w-[98%] top-[10px] bg-white/90' : 'w-[90%] max-w-[1200px] top-[24px] bg-white/75 backdrop-blur-[20px] saturate-180'}`}>
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logoUrl || "/assets/images/immihire-logo.webp"} alt="ImmiHire Logo" className="h-10 w-auto object-contain" />
          <span className="font-heading font-bold text-xl text-black tracking-tight">
            Immi<span className="text-primary">Hire</span>
          </span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 text-[0.8rem] font-bold text-gray-700 tracking-widest uppercase">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <div className="relative group cursor-pointer py-[10px]">
            <span className="hover:text-primary transition-colors flex items-center gap-1">
              Services <i className="fa-solid fa-chevron-down text-[0.6rem]"></i>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-5 opacity-0 invisible bg-white/90 backdrop-blur-[16px] border border-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] min-w-[240px] p-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-[100] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <Link to="/service-usa" className="block px-4 py-2.5 rounded-lg text-slate-700 text-[0.85rem] font-semibold transition-all normal-case hover:bg-slate-100 hover:text-[#0d5fb7]">USA Visit Visa</Link>
              <Link to="/service-schengen" className="block px-4 py-2.5 rounded-lg text-slate-700 text-[0.85rem] font-semibold transition-all normal-case hover:bg-slate-100 hover:text-[#0d5fb7]">Schengen Work Permits</Link>
              <Link to="/service-canada" className="block px-4 py-2.5 rounded-lg text-slate-700 text-[0.85rem] font-semibold transition-all normal-case hover:bg-slate-100 hover:text-[#0d5fb7]">Canada Express Entry</Link>
              <Link to="/service-germany" className="block px-4 py-2.5 rounded-lg text-slate-700 text-[0.85rem] font-semibold transition-all normal-case hover:bg-slate-100 hover:text-[#0d5fb7]">Germany Opportunity Card</Link>
              <Link to="/service-australia" className="block px-4 py-2.5 rounded-lg text-slate-700 text-[0.85rem] font-semibold transition-all normal-case hover:bg-slate-100 hover:text-[#0d5fb7]">Australia SkillSelect</Link>
            </div>
          </div>
          <Link to="/insights" className="hover:text-primary transition-colors">Insights</Link>
        </nav>
        
        <div className="hidden md:block">
          <Link to="/contact">
            <MagneticButton className="px-6 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center gap-2 text-xs uppercase tracking-wider">
              <span>Contact Us</span>
              <i className="fa-solid fa-arrow-right text-[0.6rem]"></i>
            </MagneticButton>
          </Link>
        </div>
        
        <button onClick={() => setMenuOpen(true)} className="lg:hidden text-2xl text-black">
          <i className="fa-solid fa-bars"></i>
        </button>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] bg-white/95 backdrop-blur-2xl transform transition-transform duration-500 flex flex-col justify-center px-10 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={closeMenu} className="absolute top-8 right-8 text-3xl text-darkBlue hover:text-primary transition-colors">
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <nav className="flex flex-col items-start gap-6 w-full max-w-md mx-auto">
          <Link to="/" onClick={closeMenu} className="text-3xl font-heading font-bold text-darkBlue hover:text-primary transition-colors">Home</Link>
          <Link to="/about" onClick={closeMenu} className="text-3xl font-heading font-bold text-darkBlue hover:text-primary transition-colors">About</Link>
          
          {/* Services Accordion */}
          <div className="w-full">
            <button 
              onClick={() => setServicesOpen(!servicesOpen)} 
              className="flex justify-between items-center w-full text-3xl font-heading font-bold text-darkBlue hover:text-primary transition-colors focus:outline-none"
            >
              <span>Services</span>
              <i className={`fa-solid fa-chevron-down text-xl transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`${servicesOpen ? 'flex' : 'hidden'} flex-col gap-4 mt-4 pl-4 border-l-2 border-primary/20`}>
              <Link to="/service-usa" onClick={closeMenu} className="text-lg font-medium text-gray-600 hover:text-primary">USA Visit Visa</Link>
              <Link to="/service-schengen" onClick={closeMenu} className="text-lg font-medium text-gray-600 hover:text-primary">Schengen Work Permits</Link>
              <Link to="/service-canada" onClick={closeMenu} className="text-lg font-medium text-gray-600 hover:text-primary">Canada Express Entry</Link>
              <Link to="/service-germany" onClick={closeMenu} className="text-lg font-medium text-gray-600 hover:text-primary">Germany Opportunity Card</Link>
              <Link to="/service-australia" onClick={closeMenu} className="text-lg font-medium text-gray-600 hover:text-primary">Australia SkillSelect</Link>
            </div>
          </div>
          
          <Link to="/insights" onClick={closeMenu} className="text-3xl font-heading font-bold text-darkBlue hover:text-primary transition-colors">Insights</Link>
          <Link to="/contact" onClick={closeMenu} className="text-3xl font-heading font-bold text-primary hover:text-darkBlue transition-colors mt-4">Contact Us</Link>
        </nav>
      </div>
    </>
  );
};

export default PillHeader;
