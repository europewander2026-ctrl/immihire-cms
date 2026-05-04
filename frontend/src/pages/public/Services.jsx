import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';
import SectionRenderer from '../../components/SectionRenderer';
import ServiceCatalog from '../../components/sections/ServiceCatalog';

const Services = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/pages/services').catch(async () => {
          return await api.get('/api/page?slug=services');
        });
        setPageData(res.data);
      } catch (err) {
        console.error('Failed to fetch services page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServicesData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-xl text-primary flex items-center gap-2 font-bold">
          <i className="fa-solid fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] text-gray-800 overflow-x-hidden min-h-screen">
      <Helmet>
        <title>Our Services | ImmiHire</title>
        <meta name="description" content="Explore our immigration services: Canada PR, Australia Skilled Migration, USA Visit Visas, Germany Opportunity Card, and Schengen Work Permits." />
      </Helmet>

      {pageData && pageData.sections ? (
        <SectionRenderer sections={pageData.sections} />
      ) : (
        <ServiceCatalog />
      )}
    </div>
  );
};

export default Services;
