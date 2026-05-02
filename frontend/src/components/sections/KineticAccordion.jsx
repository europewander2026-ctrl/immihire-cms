import React from 'react';
import RevealWrapper from '../RevealWrapper';

const defaultPanels = [
  {
    label: 'Integrity',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    icon: 'fa-solid fa-scale-balanced',
    title: 'Integrity First',
    description: 'Honest counsel is our currency. We never over-promise. We provide transparent assessments, clear fee structures, and realistic timelines.',
  },
  {
    label: 'Empathy',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop',
    icon: 'fa-solid fa-heart',
    title: 'Human Centric',
    description: 'You are not a file number. We understand the hopes and fears behind every application. Your dream is our dedicated mission.',
  },
  {
    label: 'Excellence',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    icon: 'fa-solid fa-rocket',
    title: 'Precision',
    description: "98% success rate isn't luck. It's engineering. Our legal team meticulously reviews every document to ensure zero-error filings.",
  },
  {
    label: 'Innovation',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    icon: 'fa-solid fa-lightbulb',
    title: 'Future Ready',
    description: 'Leveraging AI and data analytics to predict immigration trends and find the absolute best pathway for your unique profile.',
  },
];

const KineticAccordion = ({ panels = defaultPanels, heading = 'Our Core Values', subtitle = 'The principles that drive every decision we make.' }) => {
  return (
    <section className="py-24 bg-[#000814] text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <RevealWrapper className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl mb-4">{heading}</h2>
          <p className="text-blue-200">{subtitle}</p>
        </RevealWrapper>

        {/* Kinetic Wrapper */}
        <RevealWrapper>
          <div className="kinetic-wrapper">
            {panels.map((panel, index) => (
              <div key={index} className="kinetic-panel group">
                <img src={panel.image} alt={panel.label} />
                {/* Vertical Label (Hidden on Expand) */}
                <div className="panel-label">{panel.label}</div>

                {/* Content (Shown on Expand) */}
                <div className="kinetic-content">
                  <div className="expanded-text">
                    <i className={`${panel.icon} text-5xl mb-6 text-primary drop-shadow-[0_0_10px_rgba(13,95,183,0.8)]`}></i>
                    <h3 className="text-4xl font-bold font-heading mb-4">{panel.title}</h3>
                    <p className="text-lg leading-relaxed text-gray-200">{panel.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RevealWrapper>
      </div>
    </section>
  );
};

export default KineticAccordion;
