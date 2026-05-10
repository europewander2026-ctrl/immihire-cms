import React, { useEffect } from 'react';

const ServicesHero = ({
  tagline = "Our Expertise",
  heading = "Pathways to",
  titleHighlight = "The World",
  description = "Comprehensive immigration solutions tailored to your unique profile. Explore our specialized services designed to make your global dreams a reality."
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

  return (
    <>
      <style>{`
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(5px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
      `}</style>
      <section className="pt-48 pb-20 bg-white text-center">
        <div className="container mx-auto px-6 reveal active">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">{tagline}</span>
          <h1 className="font-heading font-bold text-5xl md:text-7xl text-darkBlue mb-6">
            {heading} <br />
            {titleHighlight && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                {titleHighlight}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </section>
    </>
  );
};

export default ServicesHero;
