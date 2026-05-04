import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../utils/api';
import SectionRenderer from '../../components/SectionRenderer';
import ContactWidget from '../../components/sections/ContactWidget';
import LocationCards from '../../components/sections/LocationCards';

const Contact = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/pages/contact').catch(async () => {
          return await api.get('/api/page?slug=contact');
        });
        setPageData(res.data);
      } catch (err) {
        console.error('Failed to fetch contact page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContactData();
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
    <div className="text-gray-800 overflow-x-hidden min-h-screen relative">
      <Helmet>
        <title>Contact Us | ImmiHire</title>
        <meta name="description" content="Contact ImmiHire for a free consultation. Locate our offices in Dubai and Toronto. Call +971 50 752 6626 or email info@immihire.com." />
      </Helmet>

      {pageData && pageData.sections ? (
        <SectionRenderer sections={pageData.sections} />
      ) : (
        <>
          <ContactWidget />
          <LocationCards />
        </>
      )}
    </div>
  );
};

export default Contact;
