import React, { useEffect } from 'react';
import SEOHead from '../../components/public/SEOHead';

const Privacy = () => {
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
      <SEOHead title="Privacy Policy | ImmiHire" />

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
            Transparency <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Protocol</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            We believe trust is built on clarity. Here is a comprehensive breakdown of how we protect, process, and respect your data.
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
                <a href="#intro" className="nav-link active">1. Introduction</a>
                <a href="#collection" className="nav-link">2. Data Collection</a>
                <a href="#usage" className="nav-link">3. Usage of Information</a>
                <a href="#protection" className="nav-link">4. Data Protection</a>
                <a href="#cookies" className="nav-link">5. Cookies & Tracking</a>
                <a href="#rights" className="nav-link">6. User Rights</a>
              </nav>

              <div className="mt-10 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Have Questions?</p>
                <a href="mailto:privacy@immihire.com" className="text-primary font-bold text-sm hover:underline">
                  privacy@immihire.com
                </a>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:w-3/4">
            {/* Section 1 */}
            <div id="intro" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">01</span>
                Introduction
              </h2>
              <p className="policy-text">
                Welcome to ImmiHire. Your privacy is paramount to us. This Privacy Policy outlines how ImmiHire
                ("we", "our", or "us") collects, uses, and safeguards your <span className="tooltip-term" data-tooltip="Information that can identify you, such as your name, email, or passport details.">Personal Data</span> when you visit our website or use our immigration services. By accessing our platform, you agree to the terms laid out in this protocol.
              </p>
            </div>

            {/* Section 2 */}
            <div id="collection" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">02</span>
                Data Collection
              </h2>
              <p className="policy-text mb-4">
                To facilitate your global mobility, we collect specific categories of data. This ensures we can accurately assess your eligibility for various visa programs.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Identity Data:</strong> Name, date of birth, passport details, and marital status.</li>
                <li><strong>Contact Data:</strong> Email address, phone number, and residential address.</li>
                <li><strong>Professional Data:</strong> CV/Resume, employment history, and educational qualifications.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device information collected automatically.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="usage" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">03</span>
                Usage of Information
              </h2>
              <p className="policy-text">
                We are not in the business of selling data. Your information is used strictly for:
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-darkBlue mb-2">Service Delivery</h4>
                  <p className="text-sm text-gray-500">Processing visa applications and eligibility assessments.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-darkBlue mb-2">Communication</h4>
                  <p className="text-sm text-gray-500">Sending updates regarding your application status or policy changes.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-darkBlue mb-2">Legal Compliance</h4>
                  <p className="text-sm text-gray-500">Meeting requirements set by government immigration authorities.</p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="protection" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">04</span>
                Data Protection
              </h2>
              <p className="policy-text">
                We implement enterprise-grade security measures. Your data is stored on secure <span className="tooltip-term" data-tooltip="We use AWS and Google Cloud servers encrypted with AES-256 standards.">Encrypted Servers</span> and access is restricted to authorized personnel only. We regularly conduct vulnerability assessments to ensure our defenses remain impenetrable against unauthorized access.
              </p>
            </div>

            {/* Section 5 */}
            <div id="cookies" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">05</span>
                Cookies & Tracking
              </h2>
              <p className="policy-text">
                Our website uses <span className="tooltip-term" data-tooltip="Small text files stored on your device to remember preferences.">Cookies</span> to enhance your browsing experience. These allow us to remember your language preferences and analyze traffic patterns. You can choose to disable cookies through your browser settings, though this may affect site functionality.
              </p>
            </div>

            {/* Section 6 */}
            <div id="rights" className="policy-section">
              <h2 className="font-heading text-2xl font-bold text-darkBlue mb-4 flex items-center gap-3">
                <span className="bg-blue-100 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">06</span>
                User Rights
              </h2>
              <p className="policy-text mb-4">
                Under GDPR and other international privacy laws, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate data.</li>
                <li>Request deletion of your data ("Right to be Forgotten").</li>
                <li>Withdraw consent for marketing communications at any time.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
