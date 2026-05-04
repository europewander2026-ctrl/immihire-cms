import React from 'react';
import { Link } from 'react-router-dom';

const ServicesGrid = ({ title, subtitle, limit }) => {
  const defaultServices = [
    {
      id: 1,
      title: "Canada",
      subtitle: "The #1 destination for skilled workers. Express Entry, PNP & Study Visas.",
      image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2565&auto=format&fit=crop",
      link: "/services/canada-express-entry",
      colSpan: "md:col-span-2",
      rowSpan: "row-span-2",
      badge: "Most Popular",
      delay: "0ms"
    },
    {
      id: 2,
      title: "Germany",
      subtitle: "Opportunity Card",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670&auto=format&fit=crop",
      link: "/services/germany-opportunity-card",
      colSpan: "col-span-1",
      rowSpan: "row-span-1",
      delay: "100ms"
    },
    {
      id: 3,
      title: "Australia",
      subtitle: "SkillSelect & Subclass 189/190. High quality of life.",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2730&auto=format&fit=crop",
      link: "/services/australia-skillselect",
      colSpan: "col-span-1",
      rowSpan: "row-span-2",
      delay: "200ms"
    },
    {
      id: 4,
      title: "United Kingdom",
      subtitle: "Global Talent Visa",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop",
      link: "/services/uk-global-talent",
      colSpan: "col-span-1",
      rowSpan: "row-span-1",
      delay: "300ms"
    }
  ];

  const servicesToRender = limit ? defaultServices.slice(0, limit) : defaultServices;

  return (
    <section id="countries" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 reveal active">
          <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">{title || "Our Countries"}</h2>
          <p className="text-gray-500 text-lg">{subtitle || "Migrate for a better future. Explore your options."}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-6 h-auto lg:h-[800px]">
          {servicesToRender.map((service) => (
            <Link 
              key={service.id} 
              to={service.link} 
              className={`bento-card ${service.colSpan} ${service.rowSpan} group cursor-pointer reveal active`} 
              style={{ transitionDelay: service.delay }}
            >
              <img src={service.image} className="absolute inset-0 w-full h-full object-cover" alt={service.title} />
              <div className={`absolute inset-0 bg-gradient-to-t ${service.rowSpan === 'row-span-2' ? 'from-black/80 via-black/20' : 'from-black/80'} to-transparent flex flex-col justify-end ${service.rowSpan === 'row-span-2' ? 'p-10' : 'p-8'}`}>
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className={`text-white font-heading font-bold ${service.rowSpan === 'row-span-2' ? 'text-3xl md:text-4xl' : 'text-2xl'} mb-2`}>
                    {service.title}
                  </h3>
                  <p className={`text-gray-200 ${service.rowSpan === 'row-span-2' ? 'text-lg' : 'text-sm'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`}>
                    {service.subtitle}
                  </p>
                  {service.badge && (
                    <span className="inline-block mt-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30">
                      {service.badge}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
