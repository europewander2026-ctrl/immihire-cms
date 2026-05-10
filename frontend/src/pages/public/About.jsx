import React, { useEffect } from 'react';
import AboutHero from '../../components/sections/AboutHero';
import CoreValuesKinetic from '../../components/sections/CoreValuesKinetic';
import ImmiHireStandard from '../../components/sections/ImmiHireStandard';

const About = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="text-gray-800">
      <AboutHero />
      <CoreValuesKinetic />
      <ImmiHireStandard />
      
      {/* WhatsApp Button */}
      <a href="https://wa.me/971585281090" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group">
        <i className="fa-brands fa-whatsapp text-3xl"></i>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap ml-0 group-hover:ml-3 font-bold">Chat with us</span>
      </a>
    </div>
  );
};

export default About;
