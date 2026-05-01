import React, { useEffect, useRef } from 'react';
import RevealWrapper from '../components/RevealWrapper';
import { Link } from 'react-router-dom';

const About = () => {
  const dnaMarkerRef = useRef(null);

  useEffect(() => {
    // Parallax Hover on Kinetic Panels
    const panels = document.querySelectorAll('.kinetic-panel');
    panels.forEach(panel => {
      const handleMouseMove = (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const xPercent = (x / rect.width) - 0.5;
        const img = panel.querySelector('img');
        if (img) {
          img.style.transform = `scale(1.1) translateX(${xPercent * -20}px)`;
        }
      };

      const handleMouseLeave = () => {
        const img = panel.querySelector('img');
        if (img) img.style.transform = '';
      };

      panel.addEventListener('mousemove', handleMouseMove);
      panel.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        panel.removeEventListener('mousemove', handleMouseMove);
        panel.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    // DNA Scroll
    const handleScroll = () => {
      if (!dnaMarkerRef.current) return;
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      dnaMarkerRef.current.style.top = `${scrollPercent * 100}%`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="text-gray-800">
      {/* Section 1: Hero - The Vision */}
      <section className="relative pt-48 pb-32 bg-white overflow-hidden">
        {/* DNA Decorative Element */}
        <div className="absolute right-[5%] top-[20%] h-[60%] w-[2px] bg-[rgba(13,95,183,0.1)] z-0">
          <div ref={dnaMarkerRef} className="absolute w-[12px] h-[12px] rounded-full bg-[#0d5fb7] left-[-5px] transition-[top] duration-100 ease-linear"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <RevealWrapper className="lg:w-1/2">
              <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">Our Story</span>
              <h1 className="font-heading font-bold text-5xl lg:text-7xl text-darkBlue mb-6 leading-tight">
                Architects of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  New Beginnings
                </span>
              </h1>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Founded on the belief that geography should not dictate destiny. ImmiHire isn't just a consultancy; it's a launchpad for human potential. We combine legal expertise with genuine empathy to navigate the complex world of global immigration.
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
            </RevealWrapper>

            <RevealWrapper className="lg:w-1/2 relative" delay={200}>
              <div className="relative w-full aspect-[4/5]">
                <div className="absolute inset-0 bg-blue-100 rounded-tr-[100px] rounded-bl-[100px] transform rotate-3 scale-95"></div>
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
                  className="absolute inset-0 w-full h-full object-cover rounded-tr-[100px] rounded-bl-[100px] shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-700"
                  alt="ImmiHire Team"
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
            </RevealWrapper>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <i className="fa-solid fa-quote-left text-4xl text-primary/20 mb-6"></i>
          <h2 className="font-heading font-bold text-3xl text-darkBlue mb-6">Our Mission</h2>
          <p className="text-xl text-gray-600 leading-relaxed font-light">
            "To demystify the immigration process. We strive to provide honest, accurate, and strategic counsel that eliminates uncertainty. Whether you are a skilled professional or a business investor, our goal is to provide a clear roadmap from your initial assessment to your final landing."
          </p>
        </div>
      </section>

      {/* Section 2: Kinetic Accordion (Core Values) */}
      <section className="py-24 bg-[#000814] text-white overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <RevealWrapper className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl mb-4">Our Core Values</h2>
            <p className="text-blue-200">The principles that drive every decision we make.</p>
          </RevealWrapper>

          {/* Kinetic Wrapper */}
          <RevealWrapper className="flex flex-col md:flex-row h-[800px] md:h-[600px] w-full overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            {/* Panel 1 */}
            <div className="kinetic-panel relative flex-1 overflow-hidden cursor-pointer flex items-center justify-center border-r border-white/10 group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[4]">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" alt="Integrity" className="absolute w-full h-full object-cover transition-transform duration-700 filter brightness-50 grayscale group-hover:brightness-90 group-hover:grayscale-0 group-hover:scale-110" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:-rotate-90 font-heading font-extrabold text-2xl tracking-[0.2em] uppercase text-white/70 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-0">
                Integrity
              </div>
              <div className="relative z-10 text-white text-center opacity-80 transition-all duration-500 p-8 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="opacity-0 translate-y-5 transition-all duration-500 delay-200 max-w-[400px] mx-auto group-hover:opacity-100 group-hover:translate-y-0">
                  <i className="fa-solid fa-scale-balanced text-5xl mb-6 text-primary drop-shadow-[0_0_10px_rgba(13,95,183,0.8)]"></i>
                  <h3 className="text-4xl font-bold font-heading mb-4">Integrity First</h3>
                  <p className="text-lg leading-relaxed text-gray-200">
                    Honest counsel is our currency. We never over-promise. We provide transparent assessments, clear fee structures, and realistic timelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Panel 2 */}
            <div className="kinetic-panel relative flex-1 overflow-hidden cursor-pointer flex items-center justify-center border-r border-white/10 group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[4]">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop" alt="Empathy" className="absolute w-full h-full object-cover transition-transform duration-700 filter brightness-50 grayscale group-hover:brightness-90 group-hover:grayscale-0 group-hover:scale-110" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:-rotate-90 font-heading font-extrabold text-2xl tracking-[0.2em] uppercase text-white/70 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-0">
                Empathy
              </div>
              <div className="relative z-10 text-white text-center opacity-80 transition-all duration-500 p-8 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="opacity-0 translate-y-5 transition-all duration-500 delay-200 max-w-[400px] mx-auto group-hover:opacity-100 group-hover:translate-y-0">
                  <i className="fa-solid fa-heart text-5xl mb-6 text-primary drop-shadow-[0_0_10px_rgba(13,95,183,0.8)]"></i>
                  <h3 className="text-4xl font-bold font-heading mb-4">Human Centric</h3>
                  <p className="text-lg leading-relaxed text-gray-200">
                    You are not a file number. We understand the hopes and fears behind every application. Your dream is our dedicated mission.
                  </p>
                </div>
              </div>
            </div>

            {/* Panel 3 */}
            <div className="kinetic-panel relative flex-1 overflow-hidden cursor-pointer flex items-center justify-center border-r border-white/10 group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[4]">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Excellence" className="absolute w-full h-full object-cover transition-transform duration-700 filter brightness-50 grayscale group-hover:brightness-90 group-hover:grayscale-0 group-hover:scale-110" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:-rotate-90 font-heading font-extrabold text-2xl tracking-[0.2em] uppercase text-white/70 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-0">
                Excellence
              </div>
              <div className="relative z-10 text-white text-center opacity-80 transition-all duration-500 p-8 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="opacity-0 translate-y-5 transition-all duration-500 delay-200 max-w-[400px] mx-auto group-hover:opacity-100 group-hover:translate-y-0">
                  <i className="fa-solid fa-rocket text-5xl mb-6 text-primary drop-shadow-[0_0_10px_rgba(13,95,183,0.8)]"></i>
                  <h3 className="text-4xl font-bold font-heading mb-4">Precision</h3>
                  <p className="text-lg leading-relaxed text-gray-200">
                    98% success rate isn't luck. It's engineering. Our legal team meticulously reviews every document to ensure zero-error filings.
                  </p>
                </div>
              </div>
            </div>

            {/* Panel 4 */}
            <div className="kinetic-panel relative flex-1 overflow-hidden cursor-pointer flex items-center justify-center group transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[4]">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Innovation" className="absolute w-full h-full object-cover transition-transform duration-700 filter brightness-50 grayscale group-hover:brightness-90 group-hover:grayscale-0 group-hover:scale-110" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:-rotate-90 font-heading font-extrabold text-2xl tracking-[0.2em] uppercase text-white/70 whitespace-nowrap transition-opacity duration-300 group-hover:opacity-0">
                Innovation
              </div>
              <div className="relative z-10 text-white text-center opacity-80 transition-all duration-500 p-8 translate-y-5 group-hover:opacity-100 group-hover:translate-y-0">
                <div className="opacity-0 translate-y-5 transition-all duration-500 delay-200 max-w-[400px] mx-auto group-hover:opacity-100 group-hover:translate-y-0">
                  <i className="fa-solid fa-lightbulb text-5xl mb-6 text-primary drop-shadow-[0_0_10px_rgba(13,95,183,0.8)]"></i>
                  <h3 className="text-4xl font-bold font-heading mb-4">Future Ready</h3>
                  <p className="text-lg leading-relaxed text-gray-200">
                    Leveraging AI and data analytics to predict immigration trends and find the absolute best pathway for your unique profile.
                  </p>
                </div>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">The ImmiHire Standard</h2>
            <p className="text-gray-500">Non-negotiable pillars of our service.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-10 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl shadow-sm mb-6">
                <i className="fa-regular fa-eye"></i>
              </div>
              <h3 className="font-bold text-xl text-darkBlue mb-3">Transparency</h3>
              <p className="text-gray-500 text-sm leading-relaxed">No hidden fees. We provide clear eligibility assessments from day one.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl shadow-sm mb-6">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <h3 className="font-bold text-xl text-darkBlue mb-3">Expertise</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Certified legal experts with over a decade of specialized experience.</p>
            </div>
            <div className="bg-gray-50 p-10 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl shadow-sm mb-6">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="font-bold text-xl text-darkBlue mb-3">Efficiency</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Advanced processing protocols to ensure your application moves fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <a href="https://wa.me/971585281090" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group">
        <i className="fa-brands fa-whatsapp text-3xl"></i>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap ml-0 group-hover:ml-3 font-bold">Chat with us</span>
      </a>
    </div>
  );
};

export default About;
