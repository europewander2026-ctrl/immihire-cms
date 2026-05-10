import React from 'react';
import SpotlightCinema from './sections/SpotlightCinema';
import EligibilityPulse from './sections/EligibilityPulse';
import KineticAccordion from './sections/KineticAccordion';
import HeroSection from './sections/HeroSection';
import ServicesGrid from './sections/ServicesGrid';
import StatsBanner from './sections/StatsBanner';
import MissionVision from './sections/MissionVision';
import TeamGrid from './sections/TeamGrid';
import ContactWidget from './sections/ContactWidget';
import LocationCards from './sections/LocationCards';
import ServiceCatalog from './sections/ServiceCatalog';
import HomeHeroWidget from './sections/HomeHeroWidget';
import HomeAbout from './sections/HomeAbout';
import CountriesBentoGrid from './sections/CountriesBentoGrid';
import JourneySection from './sections/JourneySection';

// Newly added components
import AboutHero from './sections/AboutHero';
import CoreValuesKinetic from './sections/CoreValuesKinetic';
import ImmiHireStandard from './sections/ImmiHireStandard';
import ServicesHero from './sections/ServicesHero';
import BoardingPassStack from './sections/BoardingPassStack';
import FaqAccordion from './sections/FaqAccordion';
import ContactHero from './sections/ContactHero';
import ContactFormSection from './sections/ContactFormSection';
import GlobalOffices from './sections/GlobalOffices';
import BlogHero from './sections/BlogHero';
import GlobalPulseMap from './sections/GlobalPulseMap';
import ArticleGrid from './sections/ArticleGrid';
import DiplomaticDispatch from './sections/DiplomaticDispatch';

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
        return <HeroSection key={index} {...(section.data || section.content || {})} />;
        
      case 'services-grid':
      case 'services_grid':
        return <ServicesGrid key={index} {...(section.data || section.content || {})} />;
        
      case 'stats-banner':
      case 'stats_banner':
        return <StatsBanner key={index} {...(section.data || section.content || {})} />;

      case 'spotlight-cinema':
      case 'spotlight_cinema':
        return <SpotlightCinema key={index} {...(section.data || section.content || {})} categories={section.content?.categories} />;
        
      case 'eligibility-pulse':
      case 'eligibility_pulse':
        return <EligibilityPulse key={index} {...(section.data || section.content || {})} />;
        
      case 'kinetic-accordion':
        return <KineticAccordion key={index} panels={section.data?.panels || section.content?.panels || section.panels} heading={section.heading} subtitle={section.subheading} />;

      case 'mission-vision':
        return <MissionVision key={index} {...(section.data || section.content || {})} />;

      case 'team-grid':
        return <TeamGrid key={index} {...(section.data || section.content || {})} />;

      case 'contact-widget':
        return <ContactWidget key={index} {...(section.data || section.content || {})} />;

      case 'location-cards':
        return <LocationCards key={index} {...(section.data || section.content || {})} />;

      case 'service-catalog':
        return <ServiceCatalog key={index} {...(section.data || section.content || {})} />;

      case 'home-hero':
        return <HomeHeroWidget key={index} {...(section.data || section.content || {})} />;

      case 'home-about':
        return <HomeAbout key={index} {...(section.data || section.content || {})} />;

      case 'countries-bento':
        return <CountriesBentoGrid key={index} {...(section.data || section.content || {})} />;

      case 'journey-section':
        return <JourneySection key={index} {...(section.data || section.content || {})} />;

      // New Components added in the latest update
      case 'about-hero':
        return <AboutHero key={index} {...(section.data || section.content || {})} />;
      case 'core-values':
        return <CoreValuesKinetic key={index} {...(section.data || section.content || {})} />;
      case 'immihire-standard':
        return <ImmiHireStandard key={index} {...(section.data || section.content || {})} />;
      case 'services-hero':
        return <ServicesHero key={index} {...(section.data || section.content || {})} />;
      case 'boarding-pass':
        return <BoardingPassStack key={index} {...(section.data || section.content || {})} />;
      case 'faq-accordion':
        return <FaqAccordion key={index} {...(section.data || section.content || {})} />;
      case 'contact-hero':
        return <ContactHero key={index} {...(section.data || section.content || {})} />;
      case 'contact-info':
        return <ContactFormSection key={index} {...(section.data || section.content || {})} />;
      case 'global-offices':
        return <GlobalOffices key={index} {...(section.data || section.content || {})} />;
      case 'blog-hero':
        return <BlogHero key={index} {...(section.data || section.content || {})} />;
      case 'global-pulse':
        return <GlobalPulseMap key={index} {...(section.data || section.content || {})} />;
      case 'latest-articles':
        return <ArticleGrid key={index} {...(section.data || section.content || {})} />;
      case 'newsletter-dispatch':
        return <DiplomaticDispatch key={index} {...(section.data || section.content || {})} />;
        
      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  });
};

export default SectionRenderer;
