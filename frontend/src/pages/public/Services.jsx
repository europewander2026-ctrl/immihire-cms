import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import SectionRenderer from '../../components/SectionRenderer';

import ServicesHero from '../../components/sections/ServicesHero';
import ServicesGrid from '../../components/sections/ServicesGrid';
import SpotlightCinema from '../../components/sections/SpotlightCinema';
import BoardingPassStack from '../../components/sections/BoardingPassStack';
import EligibilityPulse from '../../components/sections/EligibilityPulse';
import FaqAccordion from '../../components/sections/FaqAccordion';

const Services = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const fetchPage = async () => {
      try {
        const res = await api.get('/api/pages/services');
        setPageData(res.data);
      } catch (err) {
        console.error('Failed to fetch services page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, []);

  const sections = pageData?.sections || [];

  return (
    <div className="text-gray-800 min-h-screen">
      {loading ? (
        <div className="pt-40 pb-20 text-center">
          <i className="fa-solid fa-spinner fa-spin text-primary text-2xl"></i>
        </div>
      ) : sections.length > 0 ? (
        <SectionRenderer sections={sections} />
      ) : (
        <>
          <ServicesHero />
          <ServicesGrid />
          <SpotlightCinema />
          <BoardingPassStack />
          <EligibilityPulse />
          <FaqAccordion />
        </>
      )}
    </div>
  );
};

export default Services;
