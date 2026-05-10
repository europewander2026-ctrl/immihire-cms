import React, { useEffect } from 'react';

const defaultPasses = [
  {
    country: "Canada",
    countryTheme: "bg-blue-100 text-primary",
    iconClass: "fa-brands fa-canadian-maple-leaf text-gray-200",
    title: "Express Entry",
    subtitle: "Federal Skilled Worker Program",
    description: "The fastest pathway to Canadian PR for skilled professionals. We optimize your CRS score through strategic profile enhancement.",
    processing: "6-8 Months",
    family: "Included",
    stubTheme: "bg-primary text-white",
    stubIcon: "fa-solid fa-plane-up",
    stubTitle: "Boarding",
    stubSubtitle: "Priority Group 1",
    buttonText: "Apply Now",
    buttonTheme: "bg-white text-primary hover:bg-blue-50"
  },
  {
    country: "Germany",
    countryTheme: "bg-yellow-100 text-yellow-700",
    iconClass: "fa-solid fa-briefcase text-gray-200",
    title: "Chancenkarte",
    subtitle: "Opportunity Card",
    description: "A points-based system allowing skilled workers to enter Germany to look for work. No job offer required initially.",
    processing: "3-4 Months",
    family: "1 Year",
    stubTheme: "bg-gray-900 text-white",
    stubIcon: "fa-solid fa-passport",
    stubTitle: "Job Seeker",
    stubSubtitle: "New Pathway",
    buttonText: "Check Score",
    buttonTheme: "bg-white text-gray-900 hover:bg-gray-100"
  },
  {
    country: "Global",
    countryTheme: "bg-green-100 text-green-700",
    iconClass: "fa-solid fa-graduation-cap text-gray-200",
    title: "Study Abroad",
    subtitle: "UK, USA, Australia, Canada",
    description: "Complete guidance from university selection to SOP writing and visa filing. We partner with 500+ universities globally.",
    processing: "Jan / Sep",
    family: "Available",
    stubTheme: "bg-green-600 text-white",
    stubIcon: "fa-solid fa-book-open",
    stubTitle: "Student",
    stubSubtitle: "Future Leader",
    buttonText: "Learn More",
    buttonTheme: "bg-white text-green-700 hover:bg-green-50"
  }
];

const BoardingPassStack = ({
  heading = "Your Ticket to the Future",
  subheading = "Detailed breakdown of our premium services.",
  passes = defaultPasses
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

  const renderPasses = passes && passes.length > 0 ? passes : defaultPasses;

  return (
    <>
      <style>{`
        /* Boarding Pass Card Styles */
        .pass-stack-container {
            position: relative;
            padding-bottom: 100px;
        }

        .boarding-pass {
            position: sticky;
            top: 120px;
            margin-bottom: 40px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid #e2e8f0;
            transition: transform 0.3s ease;
        }

        @media(min-width: 768px) {
            .boarding-pass {
                flex-direction: row;
                height: 400px;
            }
        }

        .boarding-pass:hover {
            transform: translateY(-10px);
        }

        /* Ticket Rip Effect */
        .pass-rip {
            position: absolute;
            right: 28%;
            top: 0;
            bottom: 0;
            width: 2px;
            border-left: 2px dashed #cbd5e1;
            display: none;
        }

        @media(min-width: 768px) {
            .pass-rip {
                display: block;
            }
        }

        .pass-notch {
            position: absolute;
            right: 28%;
            width: 30px;
            height: 30px;
            background-color: #f8f9fa;
            border-radius: 50%;
            transform: translate(50%, 0);
            z-index: 10;
        }

        .pass-notch-top {
            top: -15px;
        }

        .pass-notch-bottom {
            bottom: -15px;
        }
      `}</style>
      
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 reveal active">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">{heading}</h2>
            <p className="text-gray-500">{subheading}</p>
          </div>

          <div className="pass-stack-container max-w-5xl mx-auto">
            {renderPasses.map((pass, index) => (
              <div key={index} className="boarding-pass reveal">
                {/* Main Content */}
                <div className="flex-grow p-8 md:p-10 flex flex-col justify-between relative">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className={`${pass.countryTheme} px-3 py-1 rounded text-xs font-bold uppercase tracking-widest`}>
                        {pass.country}
                      </span>
                      <i className={`${pass.iconClass} text-6xl absolute top-6 right-10 rotate-12`}></i>
                    </div>
                    <h3 className="font-heading font-bold text-3xl text-darkBlue mb-2">{pass.title}</h3>
                    <p className="text-gray-500 text-sm mb-6">{pass.subtitle}</p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {pass.description}
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs uppercase">Processing</p>
                      <p className="font-bold text-darkBlue font-mono">{pass.processing}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs uppercase">Family / Validity</p>
                      <p className="font-bold text-darkBlue font-mono">{pass.family}</p>
                    </div>
                  </div>
                </div>
                {/* Stub / Right Side */}
                <div className={`w-full md:w-1/3 ${pass.stubTheme} p-8 md:p-10 flex flex-col justify-center items-center relative md:border-l-2 md:border-dashed md:border-white/30`}>
                  <div className="pass-rip"></div>
                  <div className="pass-notch pass-notch-top hidden md:block"></div>
                  <div className="pass-notch pass-notch-bottom hidden md:block"></div>

                  <div className="text-center">
                    <i className={`${pass.stubIcon} text-4xl mb-4`}></i>
                    <h4 className="font-bold text-xl mb-1">{pass.stubTitle}</h4>
                    <p className="text-white/70 text-sm mb-6">{pass.stubSubtitle}</p>
                    <button className={`inline-block px-6 py-2 rounded-full font-bold text-sm transition-colors ${pass.buttonTheme}`}>
                      {pass.buttonText}
                    </button>
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

export default BoardingPassStack;
