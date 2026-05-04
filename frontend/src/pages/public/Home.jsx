import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Helmet } from 'react-helmet-async';
import SectionRenderer from '../../components/SectionRenderer';

const Home = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Using the api utility for consistency, falling back to /api/pages if /api/page is not the exact endpoint
        const res = await api.get('/api/pages/home').catch(async () => {
             return await api.get('/api/page?slug=home');
        });
        setPageData(res.data);
      } catch (err) {
        console.error('Failed to fetch home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
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
    <div className="text-gray-800 overflow-x-hidden min-h-screen bg-[#f8f9fa]">
      <Helmet>
        <title>{pageData?.title || 'ImmiHire'} | Best Immigration Services in Dubai</title>
        <meta name="description" content={`Welcome to ImmiHire.`} />
      </Helmet>
      <main>
        {pageData && pageData.sections ? (
          <SectionRenderer sections={pageData.sections} />
        ) : (
          <div className="text-center py-20">Homepage content not found.</div>
        )}
      </main>
    </div>
  );
};

export default Home;
