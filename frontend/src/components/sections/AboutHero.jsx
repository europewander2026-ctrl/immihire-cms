import React, { useEffect } from 'react';

const AboutHero = ({
  tagline = "Our Story",
  headingPart1 = "Architects of",
  headingPart2 = "New Beginnings",
  description = "Founded on the belief that geography should not dictate destiny. ImmiHire isn't just a consultancy; it's a launchpad for human potential. We combine legal expertise with genuine empathy to navigate the complex world of global immigration.",
  metrics = [
    { value: "10+", label: "Years Experience" },
    { value: "98%", label: "Success Rate" },
    { value: "5k+", label: "Visas Granted" }
  ],
  imageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
  badgeSubtitle = "Certified",
  badgeTitle = "CICC & MARA",
  missionTitle = "Our Mission",
  missionText = "\"To demystify the immigration process. We strive to provide honest, accurate, and strategic counsel that eliminates uncertainty. Whether you are a skilled professional or a business investor, our goal is to provide a clear roadmap from your initial assessment to your final landing.\""
}) => {

  useEffect(() => {
    const dnaMarker = document.getElementById('dna-marker');
    const handleScroll = () => {
      if (!dnaMarker) return;
      // Subtracting arbitrary height to ensure it moves noticeably
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      dnaMarker.style.top = `${scrollPercent * 100}%`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        /* 3. DNA Animation */
        .dna-strand {
            position: absolute;
            right: 5%;
            top: 20%;
            height: 60%;
            width: 2px;
            background: rgba(13, 95, 183, 0.1);
            z-index: 0;
        }

        .dna-node {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #0d5fb7;
            left: -5px;
            transition: top 0.1s linear;
        }

        /* Reveal Animation */
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
      
      <section className="relative pt-48 pb-32 bg-white overflow-hidden">
        {/* DNA Decorative Element */}
        <div className="dna-strand">
          <div className="dna-node" id="dna-marker"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 reveal active">
              <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">{tagline}</span>
              <h1 className="font-heading font-bold text-5xl lg:text-7xl text-darkBlue mb-6 leading-tight">
                {headingPart1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  {headingPart2}
                </span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                {description}
              </p>

              <div className="flex gap-12 border-t border-gray-100 pt-8">
                {metrics.map((metric, index) => (
                  <div key={index}>
                    <h3 className="text-4xl font-bold text-darkBlue">{metric.value}</h3>
                    <p className="text-sm text-gray-400 font-medium">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 reveal relative">
              {/* Abstract Image Composition */}
              <div className="relative w-full aspect-[4/5]">
                <div className="absolute inset-0 bg-blue-100 rounded-tr-[100px] rounded-bl-[100px] transform rotate-3 scale-95">
                </div>
                <img src={imageUrl}
                  className="absolute inset-0 w-full h-full object-cover rounded-tr-[100px] rounded-bl-[100px] shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-700" alt="About Hero" />

                {/* Floating Badge */}
                <div className="absolute bottom-10 -left-6 bg-white p-6 rounded-2xl shadow-xl animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <i className="fa-solid fa-award text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">{badgeSubtitle}</p>
                      <p className="font-bold text-darkBlue">{badgeTitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl text-center reveal">
          <i className="fa-solid fa-quote-left text-4xl text-primary/20 mb-6"></i>
          <h2 className="font-heading font-bold text-3xl text-darkBlue mb-6">{missionTitle}</h2>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            {missionText}
          </p>
        </div>
      </section>
    </>
  );
};

export default AboutHero;
