import React, { useEffect } from 'react';

const defaultCountries = [
  {
    name: 'Canada',
    image: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?q=80&w=2565&auto=format&fit=crop',
    description: 'The #1 destination for skilled workers. Express Entry, PNP & Study Visas.',
    badgeText: 'Most Popular',
    spanClasses: 'col-span-1 md:col-span-2 row-span-2'
  },
  {
    name: 'Germany',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2670&auto=format&fit=crop',
    description: 'Opportunity Card',
    spanClasses: 'col-span-1 row-span-1'
  },
  {
    name: 'Australia',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2730&auto=format&fit=crop',
    description: 'SkillSelect & Subclass 189/190. High quality of life.',
    spanClasses: 'col-span-1 row-span-2'
  },
  {
    name: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop',
    description: 'Global Talent Visa',
    spanClasses: 'col-span-1 row-span-1'
  }
];

const CountriesBentoGrid = ({
  title = 'Our Countries',
  subtitle = 'Migrate for a better future. Explore your options.',
  countries = defaultCountries
}) => {
  useEffect(() => {
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
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  // Determine if a card is "large" (spans 2 cols or 2 rows) for text sizing
  const isLarge = (span) => span && (span.includes('col-span-2') || span.includes('row-span-2'));

  return (
    <>
      <style>{`
        .bento-card {
          background: white; border-radius: 24px; overflow: hidden; position: relative;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .bento-card:hover { transform: scale(1.02); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); z-index: 10; }
        .bento-card img { transition: transform 0.7s ease; }
        .bento-card:hover img { transform: scale(1.1); }
        .reveal { opacity: 0; transform: translateY(30px); filter: blur(5px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); filter: blur(0); }
      `}</style>

      <section id="countries" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">{title}</h2>
            <p className="text-gray-500 text-lg">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-2 gap-6 h-auto lg:h-[800px]">
            {(countries || defaultCountries).map((country, i) => (
              <div
                key={i}
                className={`bento-card ${country.spanClasses || 'col-span-1 row-span-1'} group cursor-pointer reveal`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <img
                  src={country.image}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={country.name}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isLarge(country.spanClasses) ? 'from-black/80 via-black/20' : 'from-black/80'} to-transparent flex flex-col justify-end ${isLarge(country.spanClasses) ? 'p-10' : 'p-8'}`}>
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className={`text-white font-heading font-bold ${isLarge(country.spanClasses) ? 'text-4xl' : 'text-2xl'} mb-2`}>
                      {country.name}
                    </h3>
                    <p className={`text-gray-200 ${isLarge(country.spanClasses) ? 'text-lg' : 'text-sm'} opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100`}>
                      {country.description}
                    </p>
                    {country.badgeText && (
                      <span className="inline-block mt-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/30">
                        {country.badgeText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CountriesBentoGrid;
