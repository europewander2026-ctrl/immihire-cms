import React from 'react';
import SpotlightCinema from './sections/SpotlightCinema';
import EligibilityPulse from './sections/EligibilityPulse';
import KineticAccordion from './sections/KineticAccordion';

const SectionRenderer = ({ sections }) => {
  if (!sections || !Array.isArray(sections)) return null;

  return sections.map((section, index) => {
    // Some CMS structures use 'data', some use 'content'
    const sectionContent = section.data?.text || section.content?.text || section.content || '';

    switch (section.type) {
      case 'standard':
      case 'standard-text':
        return (
          <div key={index} className="article-content mb-8" 
               dangerouslySetInnerHTML={{ __html: sectionContent }} />
        );
      
      case 'heading':
        return (
          <h2 key={index} className="font-heading font-bold text-3xl md:text-4xl text-darkBlue mb-6 mt-12">
            {section.heading || sectionContent}
          </h2>
        );
        
      case 'quote':
        return (
          <div key={index} className="my-12 p-8 bg-blue-50 border-l-4 border-primary rounded-r-xl italic text-darkBlue font-serif text-lg">
             <div dangerouslySetInnerHTML={{ __html: sectionContent }} />
          </div>
        );
        
      case 'dropcap':
        return (
          <p key={index} className="drop-cap" dangerouslySetInnerHTML={{ __html: sectionContent }} />
        );
        
      case 'verdict':
        return (
          <div className="mt-20 pt-10 border-t border-gray-200 text-center verdict-section" key={index}>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">ImmiHire Official Analysis</p>
            <div className="verdict-stamp">{section.data?.text || section.content?.text || sectionContent || "VERDICT"}</div>
            <p className="mt-6 text-gray-600 max-w-lg mx-auto">{section.data?.description || section.content?.description}</p>
          </div>
        );
        
      case 'counter':
        return (
          <p key={index} className="text-xl font-medium text-gray-800 text-center my-10">
            {section.heading}: <span className="live-counter">{section.subheading}</span>
          </p>
        );
        
      case 'feature_list':
      case 'featureList':
        return (
          <div key={index} className="my-8">
            <ul className="space-y-4">
              {(section.items || []).map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <i className="fa-solid fa-check text-green-500 mt-1"></i>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
        
      case 'hero':
        return (
          <section key={index} className="relative pt-48 pb-24 bg-[#000814] text-white overflow-hidden -mt-20 mb-20 rounded-b-[3rem]">
            {section.image && (
              <>
                <div className="absolute inset-0 opacity-40">
                  <img src={section.image} alt={section.heading} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/80 to-transparent"></div>
              </>
            )}
            <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
              {section.subheading && (
                <span className="bg-primary/20 text-blue-300 border border-primary/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                  {section.subheading}
                </span>
              )}
              <h1 className="font-heading font-bold text-4xl md:text-6xl leading-tight mb-8">
                {section.heading}
              </h1>
              {sectionContent && (
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  {typeof sectionContent === 'string' ? sectionContent.replace(/<[^>]*>?/gm, '') : ''}
                </p>
              )}
            </div>
          </section>
        );

      case 'spotlight-cinema':
      case 'spotlight_cinema':
        return <SpotlightCinema key={index} {...(section.data || section.content || {})} categories={section.content?.categories} />;
        
      case 'eligibility-pulse':
      case 'eligibility_pulse':
        return <EligibilityPulse key={index} {...(section.data || section.content || {})} />;
        
      case 'kinetic-accordion':
        return <KineticAccordion key={index} panels={section.data?.panels || section.content?.panels || section.panels} heading={section.heading} subtitle={section.subheading} />;
        
      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  });
};

export default SectionRenderer;
