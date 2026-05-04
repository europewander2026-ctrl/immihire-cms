import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import KineticAccordion from '../../components/sections/KineticAccordion';

const About = () => {
  useEffect(() => {
    // Reveal Animation
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

    // DNA Scroll
    const dnaMarker = document.getElementById('dna-marker');
    const handleScroll = () => {
      if (!dnaMarker) return;
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      dnaMarker.style.top = `${scrollPercent * 100}%`;
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener("scroll", reveal);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const coreValues = [
    {
      title: "Integrity First",
      content: "Honest counsel is our currency. We never over-promise. We provide transparent assessments, clear fee structures, and realistic timelines."
    },
    {
      title: "Human Centric",
      content: "You are not a file number. We understand the hopes and fears behind every application. Your dream is our dedicated mission."
    },
    {
      title: "Precision",
      content: "98% success rate isn't luck. It's engineering. Our legal team meticulously reviews every document to ensure zero-error filings."
    },
    {
      title: "Future Ready",
      content: "Leveraging AI and data analytics to predict immigration trends and find the absolute best pathway for your unique profile."
    }
  ];

  return (
    <div className="text-gray-800 bg-[#f8f9fa] min-h-screen overflow-x-hidden">
      <Helmet>
        <title>About Us | ImmiHire</title>
        <meta name="description" content="Learn about ImmiHire, the trusted immigration experts in Dubai. With 10+ years of experience and a 98% success rate, we bridge talent to global opportunities." />
      </Helmet>

      <style>{`
        .dna-strand {
            position: absolute; right: 5%; top: 20%; height: 60%; width: 2px;
            background: rgba(13, 95, 183, 0.1); z-index: 0;
        }
        .dna-node {
            position: absolute; width: 12px; height: 12px; border-radius: 50%;
            background: #0d5fb7; left: -5px; transition: top 0.1s linear;
        }
        .reveal { opacity: 0; transform: translateY(30px); filter: blur(5px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); filter: blur(0); }
      `}</style>

      {/* Section 1: Hero - The Vision */}
      <section className="relative pt-48 pb-32 bg-white overflow-hidden">
        <div className="dna-strand">
          <div className="dna-node" id="dna-marker"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 reveal active">
              <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">Our Story</span>
              <h1 className="font-heading font-bold text-5xl lg:text-7xl text-darkBlue mb-6 leading-tight">
                Architects of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  New Beginnings
                </span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Founded on the belief that geography should not dictate destiny. ImmiHire isn't just a
                consultancy; it's a launchpad for human potential. We combine legal expertise with genuine
                empathy to navigate the complex world of global immigration.
              </p>

              <div className="flex gap-12 border-t border-gray-100 pt-8">
                <div>
                  <h3 className="text-4xl font-bold text-darkBlue">10+</h3>
                  <p className="text-sm text-gray-400 font-medium">Years Experience</p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-darkBlue">98%</h3>
                  <p className="text-sm text-gray-400 font-medium">Success Rate</p>
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-darkBlue">5k+</h3>
                  <p className="text-sm text-gray-400 font-medium">Visas Granted</p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 reveal relative">
              <div className="relative w-full aspect-[4/5]">
                <div className="absolute inset-0 bg-blue-100 rounded-tr-[100px] rounded-bl-[100px] transform rotate-3 scale-95"></div>
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                  className="absolute inset-0 w-full h-full object-cover rounded-tr-[100px] rounded-bl-[100px] shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-700"
                  alt="Team Collaboration"
                />
                <div className="absolute bottom-10 -left-6 bg-white p-6 rounded-2xl shadow-xl animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <i className="fa-solid fa-award text-xl"></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Certified</p>
                      <p className="font-bold text-darkBlue">CICC & MARA</p>
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
          <h2 className="font-heading font-bold text-3xl text-darkBlue mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            "To demystify the immigration process. We strive to provide honest, accurate, and strategic counsel that
            eliminates uncertainty. Whether you are a skilled professional or a business investor, our goal is to
            provide a clear roadmap from your initial assessment to your final landing."
          </p>
        </div>
      </section>

      {/* Core Values - Interactive Component */}
      <section className="py-24 bg-[#000814] text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="font-heading font-bold text-4xl mb-4">Our Core Values</h2>
            <p className="text-blue-200">The principles that drive every decision we make.</p>
          </div>
          
          <KineticAccordion panels={coreValues} />
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">The ImmiHire Standard</h2>
            <p className="text-gray-500">Non-negotiable pillars of our service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-10 rounded-2xl hover:-translate-y-2 transition-transform duration-300 reveal">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl shadow-sm mb-6">
                <i className="fa-regular fa-eye"></i>
              </div>
              <h3 className="font-bold text-xl text-darkBlue mb-3">Transparency</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                No hidden fees. We provide clear eligibility assessments from day one.
              </p>
            </div>
            <div className="bg-gray-50 p-10 rounded-2xl hover:-translate-y-2 transition-transform duration-300 reveal" style={{ transitionDelay: '100ms' }}>
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl shadow-sm mb-6">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h3 className="font-bold text-xl text-darkBlue mb-3">Expertise</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Certified legal experts with over a decade of specialized experience.
              </p>
            </div>
            <div className="bg-gray-50 p-10 rounded-2xl hover:-translate-y-2 transition-transform duration-300 reveal" style={{ transitionDelay: '200ms' }}>
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl shadow-sm mb-6">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="font-bold text-xl text-darkBlue mb-3">Efficiency</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Advanced processing protocols to ensure your application moves fast.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
