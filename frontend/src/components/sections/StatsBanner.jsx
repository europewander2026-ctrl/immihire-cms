import React from 'react';

const StatsBanner = ({ years, visas, successRate, title, subtitle }) => {
  return (
    <section className="py-16 bg-white border-y border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 opacity-50"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Optional Text Context */}
          {(title || subtitle) && (
             <div className="md:w-1/3 text-center md:text-left mb-8 md:mb-0">
               {title && <h3 className="font-heading font-bold text-3xl text-darkBlue mb-2">{title}</h3>}
               {subtitle && <p className="text-gray-500">{subtitle}</p>}
             </div>
          )}

          {/* Stats Flexbox */}
          <div className={`flex flex-wrap justify-center md:justify-around gap-12 ${title ? 'md:w-2/3' : 'w-full'}`}>
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <h4 className="text-4xl font-bold font-heading text-darkBlue mb-1">{years || '10+'}</h4>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Years Experience</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-chart-line"></i>
              </div>
              <h4 className="text-4xl font-bold font-heading text-darkBlue mb-1">{successRate || '98%'}</h4>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Success Rate</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <i className="fa-solid fa-passport"></i>
              </div>
              <h4 className="text-4xl font-bold font-heading text-darkBlue mb-1">{visas || '5k+'}</h4>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Visas Granted</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsBanner;
