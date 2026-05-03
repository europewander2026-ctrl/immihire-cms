import React, { useEffect } from 'react';
import SEOHead from '../../components/public/SEOHead';

const Terms = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('.policy-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
                sections.forEach(sec => sec.classList.remove('active-focus'));
                entry.target.classList.add('active-focus');
            }
        });
    }, { rootMargin: '-20% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
    
    // Reveal Animation on Load
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

    return () => {
        observer.disconnect();
        window.removeEventListener("scroll", reveal);
    };
  }, []);

  return (
    <div className="text-gray-800 bg-gray-50 min-h-screen overflow-x-hidden">
      <SEOHead title="Terms & Conditions | ImmiHire" />

      <style>{`
        /* Policy Container */
        .policy-wrapper { max-width: 1200px; margin: 0 auto; position: relative; }
        /* Sticky Navigation */
        .sticky-nav { position: sticky; top: 150px; border-left: 2px solid #e2e8f0; padding-left: 2rem; }
        .nav-link { display: block; color: #94a3b8; font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; cursor: pointer; transition: all 0.3s; position: relative; }
        .nav-link:hover { color: #0d5fb7; }
        .nav-link.active { color: #0d5fb7; padding-left: 10px; }
        .nav-link.active::before {
            content: ''; position: absolute; left: -34px; top: 50%; transform: translateY(-50%);
            width: 4px; height: 20px; background: #0d5fb7; border-radius: 4px;
        }
        /* Section Styling */
        .policy-section {
            background: white; border-radius: 16px; padding: 3rem; margin-bottom: 2rem;
            border: 1px solid transparent; transition: all 0.5s ease; opacity: 0.7; transform: scale(0.98);
        }
        .policy-section.active-focus { opacity: 1; transform: scale(1); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05); border-color: #e2e8f0; }
        .policy-text { font-size: 1.05rem; line-height: 1.8; color: #475569; }
        /* Interactive Tooltips */
        .tooltip-term { color: #0d5fb7; font-weight: 600; border-bottom: 1px dashed #0d5fb7; cursor: help; position: relative; }
        .tooltip-term::after {
            content: attr(data-tooltip); position: absolute; bottom: 120%; left: 50%;
            transform: translateX(-50%) translateY(10px); background: #002366; color: white; padding: 0.8rem 1rem;
            border-radius: 8px; width: 250px; font-size: 0.8rem; font-weight: 400; opacity: 0; visibility: hidden;
            transition: all 0.3s; pointer-events: none; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); z-index: 50;
            text-align: center; line-height: 1.4;
        }
        .tooltip-term:hover::after { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
        .tooltip-term:hover::before {
            content: ''; position: absolute; bottom: 110%; left: 50%; transform: translateX(-50%);
            border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #002366; opacity: 1;
        }
        /* Reveal Animation */
        .reveal { opacity: 0; transform: translateY(30px); filter: blur(5px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); filter: blur(0); }
      `}</style>

      {/* Hero Section */}
      <section className="pt-48 pb-16 relative bg-white">
        <div className="container mx-auto px-6 text-center reveal active">
          <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">
            Legal Hub
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-6xl text-darkBlue mb-6">
            Terms & Conditions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Agreement</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Clear guidelines that govern your relationship with ImmiHire. These terms ensure a transparent and fair partnership for all parties involved.
          </p>
          <p className="text-xs text-gray-400 mt-8 font-mono">
            Last Updated: <span id="date-update">October 24, 2025</span>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24 px-6 bg-gray-50 pt-16">
        <div className="policy-wrapper flex flex-col lg:flex-row gap-16">
          {/* Sticky Navigation (Sidebar) */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky-nav">
              <h3 className="font-heading font-bold text-darkBlue mb-6 uppercase text-sm tracking-widest">
                Table of Contents
              </h3>
              <nav id="toc">
                <a href="#acceptance" className="nav-link active">1. Acceptance of Terms</a>
                <a href="#services" className="nav-link">2. Services Description</a>
                <a href="#user-obligations" className="nav-link">3. User Obligations</a>
                <a href="#fees" className="nav-link">4. Fees & Payment</a>
                <a href="#liability" className="nav-link">5. Limitation of Liability</a>
                <a href="#termination" className="nav-link">6. Termination</a>
              </nav>

              <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Need Assistance?</p>
                <a href="mailto:legal@immihire.com" className="text-primary font-bold text-sm hover:underline">
                  legal@immihire.com
                </a>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            {/* Section 1 */}
            <div id="acceptance" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">01</span>
                Acceptance of Terms
              </h2>
              <p className="policy-text">
                By accessing and using ImmiHire's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            {/* Section 2 */}
            <div id="services" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">02</span>
                Services Description
              </h2>
              <p className="policy-text mb-4">
                ImmiHire provides immigration consultation services including but not limited to visa application assistance, eligibility assessment, and document preparation for various immigration programs.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Consultation Services:</strong> Initial assessment and advice on immigration pathways.</li>
                <li><strong>Application Preparation:</strong> Document preparation and submission assistance.</li>
                <li><strong>Legal Support:</strong> Guidance through immigration processes and requirements.</li>
                <li><strong>Follow-up Services:</strong> Monitoring and updates on application status.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="user-obligations" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">03</span>
                User Obligations
              </h2>
              <p className="policy-text">
                As a user of our services, you agree to:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-darkBlue mb-2">Provide Accurate Information</h4>
                  <p className="text-sm text-gray-500">All information provided must be truthful and complete.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-darkBlue mb-2">Timely Communication</h4>
                  <p className="text-sm text-gray-500">Respond to requests for additional information promptly.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-darkBlue mb-2">Compliance with Laws</h4>
                  <p className="text-sm text-gray-500">Abide by all applicable immigration and local laws.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-darkBlue mb-2">Payment Terms</h4>
                  <p className="text-sm text-gray-500">Fulfill payment obligations as agreed upon.</p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="fees" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">04</span>
                Fees & Payment
              </h2>
              <p className="policy-text">
                Service fees are outlined in our consultation agreement. Payment terms are due upon commencement of services unless otherwise specified. Refunds are provided only under specific circumstances as detailed in our refund policy.
              </p>
            </div>

            {/* Section 5 */}
            <div id="liability" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">05</span>
                Limitation of Liability
              </h2>
              <p className="policy-text">
                ImmiHire provides services on a best-effort basis. While we strive for successful outcomes, immigration processes involve government authorities and we cannot guarantee specific results. Our liability is limited to the amount paid for services.
              </p>
            </div>

            {/* Section 6 */}
            <div id="termination" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">06</span>
                Termination
              </h2>
              <p className="policy-text mb-4">
                Either party may terminate services with written notice. Upon termination:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>All outstanding payments become due immediately.</li>
                <li>Services will cease except for processing already submitted applications.</li>
                <li>Confidentiality obligations remain in effect.</li>
                <li>Dispute resolution will follow the governing law provisions.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;
