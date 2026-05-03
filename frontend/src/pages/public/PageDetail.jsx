import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

import SectionRenderer from '../../components/SectionRenderer';

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

      {sections.length > 0 ? (
        <SectionRenderer sections={sections} />
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
