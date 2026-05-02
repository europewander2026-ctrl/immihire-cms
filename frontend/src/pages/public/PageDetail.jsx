import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

// Section Components
import KineticAccordion from '../../components/sections/KineticAccordion';
import SpotlightCinema from '../../components/sections/SpotlightCinema';
import EligibilityPulse from '../../components/sections/EligibilityPulse';

const PageDetail = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/pages/${slug}`);
        setPage(res.data);
      } catch (err) {
        console.error('Failed to fetch page:', err);
        setError('Page not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-xl text-primary flex items-center gap-2 font-bold">
          <i className="fa-solid fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <h2 className="text-3xl font-bold text-darkBlue mb-4">{error}</h2>
        <Link to="/" className="text-primary font-bold hover:underline">
          <i className="fa-solid fa-arrow-left mr-2"></i>Back to Home
        </Link>
      </div>
    );
  }

  const sections = Array.isArray(page.sections) ? page.sections : [];

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={index} className="relative pt-48 pb-24 bg-[#000814] text-white overflow-hidden">
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
              {section.content && (
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">{section.content.replace(/<[^>]*>?/gm, '')}</p>
              )}
            </div>
          </section>
        );

      case 'standard':
        return (
          <section key={index} className="py-16">
            <div className="container mx-auto px-6 max-w-4xl">
              {section.heading && (
                <h2 className="font-heading font-bold text-3xl text-darkBlue mb-6">{section.heading}</h2>
              )}
              {section.content && (
                <div className="prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
              )}
            </div>
          </section>
        );

      case 'featureList':
        return (
          <section key={index} className="py-16 bg-gray-50">
            <div className="container mx-auto px-6 max-w-4xl">
              {section.heading && (
                <h2 className="font-heading font-bold text-3xl text-darkBlue mb-6 text-center">{section.heading}</h2>
              )}
              {section.content && (
                <div className="prose max-w-none text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
              )}
            </div>
          </section>
        );

      case 'kinetic-accordion':
        return <KineticAccordion key={index} panels={section.content?.panels} heading={section.heading} subtitle={section.subheading} />;

      case 'spotlight-cinema':
        return <SpotlightCinema key={index} categories={section.content?.categories} />;

      case 'eligibility-pulse':
        return <EligibilityPulse key={index} />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-gray-800 min-h-screen">
      <SEOHead
        title={page.seoTitle || page.title}
        description={page.seoDescription}
        keywords={page.seoKeywords}
      />

      {sections.length > 0 ? (
        sections.map((section, index) => renderSection(section, index))
      ) : (
        <div className="pt-40 pb-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <h1 className="font-heading font-bold text-4xl text-darkBlue mb-6">{page.title}</h1>
            {page.content && (
              <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: page.content }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageDetail;
