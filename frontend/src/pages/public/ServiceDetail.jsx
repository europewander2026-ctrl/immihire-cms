import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';
import EligibilityPulse from '../../components/sections/EligibilityPulse';
import SpotlightCinema from '../../components/sections/SpotlightCinema';
import SectionRenderer from '../../components/SectionRenderer';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        // We assume the endpoint is /api/services or /api/pages filtered by category etc.
        // If the backend doesn't have /api/services yet, it might be /api/pages/${slug}
        // I will use /api/services/${slug} as requested.
        const res = await api.get(`/api/services/${slug}`).catch(async (e) => {
             // Fallback to pages if services endpoint doesn't exist
             if(e.response && e.response.status === 404) {
                 return await api.get(`/api/pages/${slug}`);
             }
             throw e;
        });
        setService(res.data);
      } catch (err) {
        console.error('Failed to fetch service:', err);
        setError('Service not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-xl text-primary flex items-center gap-2 font-bold">
          <i className="fa-solid fa-spinner fa-spin"></i> Loading Service Details...
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <h2 className="text-3xl font-bold text-darkBlue mb-4">{error}</h2>
        <Link to="/services" className="text-primary font-bold hover:underline">
          <i className="fa-solid fa-arrow-left mr-2"></i>Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] text-gray-800 overflow-x-hidden min-h-screen">
      <SEOHead 
        title={service.seoTitle || service.title}
        description={service.seoDescription || service.excerpt || service.description}
        keywords={service.seoKeywords}
        image={service.featuredImage || service.heroImage}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {service.featuredImage || service.heroImage ? (
            <img src={service.featuredImage || service.heroImage} alt={service.title} className="w-full h-full object-cover" />
          ) : (
            <img src="https://images.unsplash.com/photo-1485871981521-5b1fd3805b3d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/70 to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          {service.category && (
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 animate-float">
              <i className="fa-solid fa-passport text-blue-300 mr-2"></i> {service.category}
            </div>
          )}
          <h1 className="font-heading font-bold text-5xl md:text-7xl text-white mb-6 reveal active">
            {service.title}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 reveal active delay-100">
            {service.excerpt || service.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal active delay-200">
            <a href="#eligibility" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-blue-600 transition-all">Eligibility Check</a>
            <Link to="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all">Apply Now</Link>
          </div>
        </div>
      </section>

      {/* Dynamic Sections (CMS Integration) */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          {Array.isArray(service.sections) && service.sections.length > 0 ? (
            <SectionRenderer sections={service.sections} />
          ) : (
            <div className="text-center text-gray-500 my-10 italic">More details coming soon.</div>
          )}
        </div>
      </section>

    </div>
  );
};

export default ServiceDetail;
