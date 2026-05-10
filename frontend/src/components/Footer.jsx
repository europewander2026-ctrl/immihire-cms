import React from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from './MagneticButton';

const Footer = () => {
  return (
    <footer className="bg-[#000814] text-white pt-12 pb-12 rounded-t-[3rem] mt-[-3rem] relative z-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
          <div className="md:w-1/2">
            <h2 className="font-heading font-bold text-5xl md:text-7xl mb-6 leading-none tracking-tight">
              Ready to <br/><span className="text-primary">Fly?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md mb-8">
              Your global future is just one click away. Book your consultation today and let's get started.
            </p>
            <Link to="/contact">
              <MagneticButton className="px-8 py-4 bg-white text-darkBlue font-bold rounded-full text-lg hover:bg-gray-200 transition-colors">
                Book Consultation
              </MagneticButton>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:w-1/3">
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary">Explore</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/insights" className="hover:text-white transition-colors">Insights</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-primary">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Dubai, UAE</li>
                <li>+971 50 752 6626</li>
                <li>info@immihire.com</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2025 ImmiHire Consultants. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="https://www.facebook.com/profile.php?id=61560909444669&sk=about" className="hover:text-white transition-colors" aria-label="Facebook"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://ae.linkedin.com/company/immihire-management-consultancy" className="hover:text-white transition-colors" aria-label="LinkedIn"><i className="fa-brands fa-linkedin"></i></a>
            <a href="https://www.instagram.com/immihire/" className="hover:text-white transition-colors" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
