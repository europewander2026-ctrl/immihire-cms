import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';
import SectionRenderer from '../../components/SectionRenderer';
import MissionVision from '../../components/sections/MissionVision';

const About = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/pages/about').catch(async () => {
          return await api.get('/api/page?slug=about');
        });
        setPageData(res.data);
      } catch (err) {
        console.error('Failed to fetch about page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
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
    <div className="text-gray-800 bg-[#f8f9fa] min-h-screen overflow-x-hidden">
      <Helmet>
        <title>About Us | ImmiHire</title>
        <meta name="description" content="Learn about ImmiHire, the trusted immigration experts in Dubai. With 10+ years of experience and a 98% success rate, we bridge talent to global opportunities." />
      </Helmet>

      {pageData && pageData.sections ? (
        <SectionRenderer sections={pageData.sections} />
      ) : (
        <MissionVision />
      )}
    </div>
  );
};

export default About;
