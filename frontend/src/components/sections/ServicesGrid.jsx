import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const defaultServices = [
  {
    title: "Canada Express Entry",
    description: "The fastest pathway to Canadian Permanent Residence. Comprehensive CRS score analysis and profile optimization.",
    link: "/services/canada",
    iconClass: "fa-brands fa-canadian-maple-leaf",
    colorTheme: "red"
  },
  {
    title: "USA Visit Visas",
    description: "Expert guidance for B1/B2 tourist and business visas. Interview preparation and documentation support.",
    link: "/services/usa",
    iconClass: "fa-solid fa-flag-usa",
    colorTheme: "blue"
  },
  {
    title: "Schengen Work Permits",
    description: "Secure your right to work across 27 European countries. Poland, Lithuania, and Czech Republic pathways.",
    link: "/services/schengen",
    iconClass: "fa-solid fa-earth-europe",
    colorTheme: "yellow"
  },
  {
    title: "Germany Opportunity Card",
    description: "The new 'Chancenkarte' points-based system. Enter Germany to look for work without a prior job offer.",
    link: "/services/germany",
    iconClass: "fa-solid fa-passport",
    colorTheme: "gray"
  },
  {
    title: "Australia SkillSelect",
    description: "Subclass 189 & 190 Visa assistance. Points calculation and Expression of Interest (EOI) filing.",
    link: "/services/australia",
    iconClass: "fa-solid fa-koala",
    colorTheme: "green"
  }
];

const ServicesGrid = ({ services = defaultServices }) => {
  const renderServices = services && services.length > 0 ? services : defaultServices;

  const colorStyles = {
    red: { bg: "bg-red-50", text: "text-red-600", light: "bg-red-100", hoverBg: "group-hover:bg-red-600" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", light: "bg-blue-100", hoverBg: "group-hover:bg-blue-600" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", light: "bg-yellow-100", hoverBg: "group-hover:bg-yellow-600" },
    gray: { bg: "bg-gray-100", text: "text-gray-700", light: "bg-gray-200", hoverBg: "group-hover:bg-gray-800" },
    green: { bg: "bg-green-50", text: "text-green-600", light: "bg-green-100", hoverBg: "group-hover:bg-green-600" }
  };

  return (
    <section className="py-20 bg-gray-50 relative z-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderServices.map((service, index) => {
            const theme = colorStyles[service.colorTheme] || colorStyles.blue;
            return (
              <Link key={index} to={service.link} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
                <div className={`absolute top-0 right-0 ${theme.light} w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform`}></div>
                <div className={`w-14 h-14 ${theme.bg} ${theme.text} rounded-2xl flex items-center justify-center text-2xl mb-6 ${theme.hoverBg} group-hover:text-white transition-colors`}>
                  <i className={service.iconClass}></i>
                </div>
                <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3">{service.title}</h3>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">{service.description}</p>
                <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  Explore Program <i className="fa-solid fa-arrow-right"></i>
                </span>
              </Link>
            );
          })}
          
          <Link to="/contact" className="group bg-primary rounded-3xl p-8 shadow-lg hover:shadow-primary/50 hover:-translate-y-2 transition-all duration-300 border border-primary relative overflow-hidden flex flex-col justify-center items-center text-center">
            <div className="absolute top-0 right-0 bg-white/10 w-40 h-40 rounded-full -mr-10 -mt-10 animate-pulse"></div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-6 text-white">
              <i className="fa-solid fa-headset"></i>
            </div>
            <h3 className="font-heading font-bold text-2xl text-white mb-3">Not Sure?</h3>
            <p className="text-blue-100 mb-6 text-sm leading-relaxed">Book a general consultation with our experts to find the right pathway for you.</p>
            <span className="bg-white text-primary px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider">
              Contact Us
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
