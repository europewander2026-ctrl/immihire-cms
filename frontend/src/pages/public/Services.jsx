import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SpotlightCinema from '../../components/sections/SpotlightCinema';
import EligibilityPulse from '../../components/sections/EligibilityPulse';
import SEOHead from '../../components/public/SEOHead';

const faqData = [
  {
    question: "What is the difference between a Work Permit and Permanent Residency?",
    answer: "A <strong>Work Permit</strong> is a temporary authorization tied to a specific employer or time frame (e.g., Schengen Work Permit). <strong>Permanent Residency (PR)</strong>, like Canada Express Entry or Australia Subclass 189, grants you the right to live, work, and study anywhere in the country indefinitely, with access to healthcare and social benefits."
  },
  {
    question: "How can I improve my Canada CRS score if it is too low?",
    answer: "The most effective ways to boost your CRS score are: 1) Retaking IELTS to achieve CLB 9+ (8777), 2) Learning French (TEF exam), 3) Obtaining a Provincial Nomination (PNP) which adds 600 points, or 4) Gaining more skilled work experience. ImmiHire provides dedicated strategies for each."
  },
  {
    question: "Is German language proficiency mandatory for the Opportunity Card?",
    answer: "While high-level German is not strictly required for the visa application itself (English A2 or German A1 is often sufficient for points), knowing German significantly improves your job prospects. For the <strong>Chancenkarte</strong>, you need 6 points total, and language skills are a key contributor to this score."
  },
  {
    question: "What occupations are currently in demand for Australia?",
    answer: "Australia's 2025 migration strategy prioritizes <strong>Healthcare</strong> (Nurses, GPs), <strong>Construction/Trades</strong> (Electricians, Carpenters), <strong>Teaching</strong>, and <strong>IT/Cybersecurity</strong>. If your occupation is on the Medium and Long-term Strategic Skills List (MLTSSL), you have a higher chance of invitation."
  },
  {
    question: "How long is a US B1/B2 Visit Visa valid for?",
    answer: "For many nationalities, the US B1/B2 visa is issued for **10 years** as a multiple-entry visa. However, the maximum duration of stay per visit is determined by the CBP officer at the port of entry, typically up to 6 months. ImmiHire assists with DS-160 filing and interview preparation."
  },
  {
    question: "Which European countries offer the easiest work permits?",
    answer: "Currently, <strong>Poland</strong>, <strong>Lithuania</strong>, and <strong>Czech Republic</strong> have more accessible work permit routes for non-EU citizens due to labor shortages in logistics, manufacturing, and construction. Processing times can be as fast as 3-4 months."
  },
  {
    question: "Do you provide job placement services upon arrival?",
    answer: "We are an immigration legal advisory, not a recruitment agency. However, we provide extensive <strong>career readiness support</strong>. This includes revamping your resume to local standards (e.g., Europass format), optimizing your LinkedIn profile, and providing a database of verified recruiters in your destination country."
  },
  {
    question: "Can I include my family in my application?",
    answer: "Yes. For Permanent Residency programs (Canada, Australia), you can include your spouse and dependent children (usually under 22). Your spouse's education and language skills can even add valuable points to your total score."
  },
  {
    question: "Do my documents need to be attested or apostilled?",
    answer: "Almost always. For Canada, you need an <strong>ECA (Educational Credential Assessment)</strong>. For UAE or Europe, degree attestation/apostille is mandatory for visa stamping. ImmiHire handles the entire document clearing and attestation process as part of our full-service package."
  },
  {
    question: "What happens if my visa application gets rejected?",
    answer: "We operate on a strict <strong>Pre-Assessment Protocol</strong> to minimize this risk. We only take cases with a high probability of success. However, in the unlikely event of a rejection, we offer a re-filing service free of professional fees or a partial refund depending on the specific terms of your service agreement."
  }
];

const Services = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-[#f8f9fa] text-gray-800 overflow-x-hidden min-h-screen">
      <SEOHead 
        title="Our Services | ImmiHire"
        description="Explore our immigration services: Canada PR, Australia Skilled Migration, USA Visit Visas, Germany Opportunity Card, and Schengen Work Permits."
      />

      {/* Section 1: Simple Hero */}
      <section className="pt-48 pb-20 bg-white text-center">
        <div className="container mx-auto px-6 reveal active">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-4 block">Our Expertise</span>
          <h1 className="font-heading font-bold text-5xl md:text-7xl text-darkBlue mb-6">
            Pathways to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">The World</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Comprehensive immigration solutions tailored to your unique profile. Explore our specialized services designed to make your global dreams a reality.
          </p>
        </div>
      </section>

      {/* Section 2: Service Cards Grid */}
      <section className="py-20 bg-gray-50 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link to="/services/canada-express-entry" className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-100 w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <i className="fa-brands fa-canadian-maple-leaf"></i>
              </div>
              <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3">Canada Express Entry</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">The fastest pathway to Canadian Permanent Residence. Comprehensive CRS score analysis and profile optimization.</p>
              <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Explore Program <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>

            <Link to="/services/usa-visit-visas" className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-100 w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-flag-usa"></i>
              </div>
              <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3">USA Visit Visas</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">Expert guidance for B1/B2 tourist and business visas. Interview preparation and documentation support.</p>
              <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Explore Program <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>

            <Link to="/services/schengen-work-permits" className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-100 w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-earth-europe"></i>
              </div>
              <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3">Schengen Work Permits</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">Secure your right to work across 27 European countries. Poland, Lithuania, and Czech Republic pathways.</p>
              <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Explore Program <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>

            <Link to="/services/germany-opportunity-card" className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gray-200 w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-gray-100 text-gray-700 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                <i className="fa-solid fa-passport"></i>
              </div>
              <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3">Germany Opportunity Card</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">The new 'Chancenkarte' points-based system. Enter Germany to look for work without a prior job offer.</p>
              <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Explore Program <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>

            <Link to="/services/australia-skillselect" className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-100 w-24 h-24 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <i className="fa-solid fa-koala"></i>
              </div>
              <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3">Australia SkillSelect</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">Subclass 189 & 190 Visa assistance. Points calculation and Expression of Interest (EOI) filing.</p>
              <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                Explore Program <i className="fa-solid fa-arrow-right"></i>
              </span>
            </Link>

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

      {/* Section 3: Spotlight Cinema (The Twist - Interactive) */}
      <SpotlightCinema />

      {/* Section 4: The Boarding Pass Stack (Sticky Cards) */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">Your Ticket to the Future</h2>
            <p className="text-gray-500">Detailed breakdown of our premium services.</p>
          </div>

          <div className="pass-stack-container max-w-5xl mx-auto relative pb-[100px]">
            {/* Pass 1: Express Entry */}
            <div className="boarding-pass sticky top-[120px] mb-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 transition-transform duration-300 hover:-translate-y-2" style={{height: "400px"}}>
              <div className="flex-grow p-8 md:p-10 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-blue-100 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Canada</span>
                    <i className="fa-brands fa-canadian-maple-leaf text-gray-200 text-6xl absolute top-6 right-10 rotate-12"></i>
                  </div>
                  <h3 className="font-heading font-bold text-3xl text-darkBlue mb-2">Express Entry</h3>
                  <p className="text-gray-500 text-sm mb-6">Federal Skilled Worker Program</p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    The fastest pathway to Canadian PR for skilled professionals. We optimize your CRS score through strategic profile enhancement.
                  </p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Processing</p>
                    <p className="font-bold text-darkBlue font-mono">6-8 Months</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Family</p>
                    <p className="font-bold text-darkBlue font-mono">Included</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-primary p-8 md:p-10 text-white flex flex-col justify-center items-center relative md:border-l-2 md:border-dashed md:border-white/30">
                <div className="pass-rip absolute right-[28%] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                <div className="pass-notch pass-notch-top absolute right-[28%] w-[30px] h-[30px] bg-gray-50 rounded-full translate-x-1/2 top-[-15px] hidden md:block z-10"></div>
                <div className="pass-notch pass-notch-bottom absolute right-[28%] w-[30px] h-[30px] bg-gray-50 rounded-full translate-x-1/2 bottom-[-15px] hidden md:block z-10"></div>

                <div className="text-center">
                  <i className="fa-solid fa-plane-up text-4xl mb-4"></i>
                  <h4 className="font-bold text-xl mb-1">Boarding</h4>
                  <p className="text-blue-200 text-sm mb-6">Priority Group 1</p>
                  <Link to="/contact" className="inline-block bg-white text-primary px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors">Apply Now</Link>
                </div>
              </div>
            </div>

            {/* Pass 2: Opportunity Card */}
            <div className="boarding-pass sticky top-[120px] mb-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 transition-transform duration-300 hover:-translate-y-2" style={{height: "400px"}}>
              <div className="flex-grow p-8 md:p-10 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Germany</span>
                    <i className="fa-solid fa-briefcase text-gray-200 text-6xl absolute top-6 right-10 rotate-12"></i>
                  </div>
                  <h3 className="font-heading font-bold text-3xl text-darkBlue mb-2">Chancenkarte</h3>
                  <p className="text-gray-500 text-sm mb-6">Opportunity Card</p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    A points-based system allowing skilled workers to enter Germany to look for work. No job offer required initially.
                  </p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Processing</p>
                    <p className="font-bold text-darkBlue font-mono">3-4 Months</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Validity</p>
                    <p className="font-bold text-darkBlue font-mono">1 Year</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-gray-900 p-8 md:p-10 text-white flex flex-col justify-center items-center relative md:border-l-2 md:border-dashed md:border-white/30">
                <div className="pass-rip absolute right-[28%] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                <div className="pass-notch pass-notch-top absolute right-[28%] w-[30px] h-[30px] bg-gray-50 rounded-full translate-x-1/2 top-[-15px] hidden md:block z-10"></div>
                <div className="pass-notch pass-notch-bottom absolute right-[28%] w-[30px] h-[30px] bg-gray-50 rounded-full translate-x-1/2 bottom-[-15px] hidden md:block z-10"></div>

                <div className="text-center">
                  <i className="fa-solid fa-passport text-4xl mb-4"></i>
                  <h4 className="font-bold text-xl mb-1">Job Seeker</h4>
                  <p className="text-gray-400 text-sm mb-6">New Pathway</p>
                  <Link to="/contact" className="inline-block bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">Check Score</Link>
                </div>
              </div>
            </div>

            {/* Pass 3: Student Visa */}
            <div className="boarding-pass sticky top-[120px] mb-10 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 transition-transform duration-300 hover:-translate-y-2" style={{height: "400px"}}>
              <div className="flex-grow p-8 md:p-10 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Global</span>
                    <i className="fa-solid fa-graduation-cap text-gray-200 text-6xl absolute top-6 right-10 rotate-12"></i>
                  </div>
                  <h3 className="font-heading font-bold text-3xl text-darkBlue mb-2">Study Abroad</h3>
                  <p className="text-gray-500 text-sm mb-6">UK, USA, Australia, Canada</p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Complete guidance from university selection to SOP writing and visa filing. We partner with 500+ universities globally.
                  </p>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Intakes</p>
                    <p className="font-bold text-darkBlue font-mono">Jan / Sep</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase">Scholarships</p>
                    <p className="font-bold text-darkBlue font-mono">Available</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 bg-green-600 p-8 md:p-10 text-white flex flex-col justify-center items-center relative md:border-l-2 md:border-dashed md:border-white/30">
                <div className="pass-rip absolute right-[28%] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-gray-300 hidden md:block"></div>
                <div className="pass-notch pass-notch-top absolute right-[28%] w-[30px] h-[30px] bg-gray-50 rounded-full translate-x-1/2 top-[-15px] hidden md:block z-10"></div>
                <div className="pass-notch pass-notch-bottom absolute right-[28%] w-[30px] h-[30px] bg-gray-50 rounded-full translate-x-1/2 bottom-[-15px] hidden md:block z-10"></div>

                <div className="text-center">
                  <i className="fa-solid fa-book-open text-4xl mb-4"></i>
                  <h4 className="font-bold text-xl mb-1">Student</h4>
                  <p className="text-green-200 text-sm mb-6">Future Leader</p>
                  <Link to="/contact" className="inline-block bg-white text-green-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-green-50 transition-colors">Learn More</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 5: Eligibility Pulse */}
      <EligibilityPulse />

      {/* Section 6: Comparison Matrix */}
      <section className="py-24 bg-darkBlue text-white">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl text-center mb-16">Visa Comparison Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="text-gray-400 border-b border-white/10 text-xs uppercase tracking-widest">
                  <th className="p-4">Feature</th>
                  <th className="p-4 text-white">Express Entry (CAN)</th>
                  <th className="p-4">Subclass 189 (AUS)</th>
                  <th className="p-4">Skilled Worker (UK)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-blue-300">Job Offer</td>
                  <td className="p-4">Not Required</td>
                  <td className="p-4">Not Required</td>
                  <td className="p-4 text-yellow-400">Mandatory</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-blue-300">Processing</td>
                  <td className="p-4">6 Months</td>
                  <td className="p-4">8-12 Months</td>
                  <td className="p-4">3 Weeks</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-blue-300">IELTS Score</td>
                  <td className="p-4">CLB 7+</td>
                  <td className="p-4">Band 6+</td>
                  <td className="p-4">UKVI 5.5+</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-blue-300">PR Status</td>
                  <td className="p-4 text-green-400">Direct</td>
                  <td className="p-4 text-green-400">Direct</td>
                  <td className="p-4">After 5 Years</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 7: FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="font-heading font-bold text-3xl text-center text-darkBlue mb-12">Common Questions</h2>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full text-left p-6 font-bold text-darkBlue flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {faq.question}
                  <i className={`fa-solid ${openFaq === index ? 'fa-minus' : 'fa-plus'} text-primary`}></i>
                </button>
                {openFaq === index && (
                  <div 
                    className="p-6 pt-0 text-gray-600 leading-relaxed bg-gray-50 text-sm"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
