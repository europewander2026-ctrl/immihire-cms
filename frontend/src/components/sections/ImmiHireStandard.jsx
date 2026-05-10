import React from 'react';

const defaultPillars = [
  {
    title: "Transparency",
    description: "No hidden fees. We provide clear eligibility assessments from day one.",
    iconClass: "fa-regular fa-eye"
  },
  {
    title: "Expertise",
    description: "Certified legal experts with over a decade of specialized experience.",
    iconClass: "fa-solid fa-graduation-cap"
  },
  {
    title: "Efficiency",
    description: "Advanced processing protocols to ensure your application moves fast.",
    iconClass: "fa-solid fa-bolt"
  }
];

const ImmiHireStandard = ({
  heading = "The ImmiHire Standard",
  subheading = "Non-negotiable pillars of our service.",
  pillars = defaultPillars
}) => {
  const renderPillars = pillars && pillars.length > 0 ? pillars : defaultPillars;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">{heading}</h2>
          <p className="text-gray-500">{subheading}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {renderPillars.map((pillar, index) => (
            <div key={index} className="bg-gray-50 p-10 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-primary text-2xl shadow-sm mb-6">
                <i className={pillar.iconClass}></i>
              </div>
              <h3 className="font-bold text-xl text-darkBlue mb-3">{pillar.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImmiHireStandard;
