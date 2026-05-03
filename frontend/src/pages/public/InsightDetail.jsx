import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import SEOHead from '../../components/public/SEOHead';

const InsightDetail = () => {
  const { slug } = useParams();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/insights/${slug}`);
        setInsight(res.data);
        
        // Fetch all insights for related articles
        const allRes = await api.get('/api/insights');
        const allInsights = allRes.data;
        const related = allInsights.filter(i => i.slug !== slug).slice(0, 3);
        setRelatedArticles(related);
      } catch (err) {
        console.error('Failed to fetch insight:', err);
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchInsight();
  }, [slug]);

  useEffect(() => {
    if (isFocusMode) {
      document.body.classList.add('focus-active');
    } else {
      document.body.classList.remove('focus-active');
    }
    return () => document.body.classList.remove('focus-active');
  }, [isFocusMode]);

  useEffect(() => {
    const handleScroll = () => {
      const paragraphs = document.querySelectorAll('.article-content p');
      const triggerBottom = window.innerHeight * 0.6; // Middle/lower part of viewport

      paragraphs.forEach(p => {
        const pTop = p.getBoundingClientRect().top;
        if (pTop < triggerBottom) {
          p.classList.add('in-view');
        } else {
          p.classList.remove('in-view');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [insight]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stamp = entry.target.querySelector('.verdict-stamp');
          if (stamp) stamp.classList.add('stamped');
        }
      });
    }, { threshold: 0.5 });

    const verdictSections = document.querySelectorAll('.verdict-section');
    verdictSections.forEach(section => observer.observe(section));

    return () => {
      verdictSections.forEach(section => observer.unobserve(section));
    };
  }, [insight]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-xl text-primary flex items-center gap-2 font-bold">
          <i className="fa-solid fa-spinner fa-spin"></i> Loading Article...
        </div>
      </div>
    );
  }

  if (error || !insight) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <h2 className="text-3xl font-bold text-darkBlue mb-4">{error}</h2>
        <Link to="/insights" className="text-primary font-bold hover:underline">
          <i className="fa-solid fa-arrow-left mr-2"></i>Back to Insights
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(insight.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate read time roughly based on length of sections
  const readTime = Math.max(1, Math.ceil(JSON.stringify(insight.sections || []).length / 1000)) + " Min Read";

  return (
    <div className="bg-[#f8f9fa] text-gray-800 overflow-x-hidden min-h-screen">
      <SEOHead 
        title={insight.seoTitle || insight.title}
        description={insight.seoDescription || insight.excerpt}
        keywords={insight.seoKeywords}
        image={insight.featuredImage}
      />

      {/* Hero Section */}
      <section className="hero-section relative pt-48 pb-24 bg-[#000814] text-white overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-40">
          {insight.featuredImage ? (
            <img src={insight.featuredImage} alt={insight.title} className="w-full h-full object-cover" />
          ) : (
            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-[#000814]/80 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="bg-primary/20 text-blue-300 border border-primary/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {insight.category || 'News'}
            </span>
            <span className="text-gray-400 text-xs font-mono">{formattedDate}</span>
            <span className="text-gray-400 text-xs font-mono">&bull; {readTime}</span>
          </div>
          <h1 className="font-heading font-bold text-4xl md:text-6xl leading-tight mb-8">
            {insight.title}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5 bg-gray-800 flex items-center justify-center overflow-hidden">
              <i className="fa-solid fa-user text-gray-400 text-xl"></i>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{insight.author || 'Immihire Team'}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Author</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">

            {/* Left: Sticky Sidebar & Tools */}
            <div className="lg:w-1/4 hidden lg:block">
              <div className="sticky top-[150px] space-y-8">
                {/* Reading Tools Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h4 className="font-heading font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Reading Tools</h4>
                  {/* Focus Mode Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Focus Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isFocusMode}
                        onChange={(e) => setIsFocusMode(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-gray-400 text-right">Scroll to read</p>
                </div>

                {/* Share */}
                <div className="flex gap-4 justify-center">
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all"><i className="fa-brands fa-twitter"></i></a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-blue-800 hover:text-white hover:border-transparent transition-all"><i className="fa-brands fa-linkedin-in"></i></a>
                  <a href={`https://api.whatsapp.com/send?text=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-green-500 hover:text-white hover:border-transparent transition-all"><i className="fa-brands fa-whatsapp"></i></a>
                </div>

                {/* Author Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    <i className="fa-solid fa-user text-gray-400 text-2xl"></i>
                  </div>
                  <p className="font-heading font-bold text-darkBlue">{insight.author || 'Immihire Team'}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Author</p>
                </div>
              </div>
            </div>

            {/* Center: Article Body */}
            <div className="lg:w-2/3 article-content">
              {Array.isArray(insight.sections) && insight.sections.length > 0 ? (
                insight.sections.map((section, index) => {
                  switch (section.type) {
                    case 'standard':
                      return (
                        <div key={index} dangerouslySetInnerHTML={{ __html: section.content }} />
                      );
                    case 'dropcap':
                      return (
                        <div key={index} className="drop-cap" dangerouslySetInnerHTML={{ __html: section.content }} />
                      );
                    case 'heading':
                      return (
                        <h2 key={index}>{section.heading}</h2>
                      );
                    case 'quote':
                      return (
                        <div key={index} className="my-12 p-8 bg-blue-50 border-l-4 border-primary rounded-r-xl italic text-darkBlue font-serif text-lg">
                          "{section.content}"
                        </div>
                      );
                    case 'verdict':
                      return (
                        <div className="mt-20 pt-10 border-t border-gray-200 text-center verdict-section" key={index}>
                          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">ImmiHire Official Analysis</p>
                          <div className="verdict-stamp">{section.content?.text || "VERDICT"}</div>
                          <p className="mt-6 text-gray-600 max-w-lg mx-auto">{section.content?.description}</p>
                        </div>
                      );
                    case 'counter':
                      return (
                        <p key={index} className="text-xl font-medium text-gray-800 text-center my-10">
                          {section.heading}: <span className="live-counter">{section.subheading}</span>
                        </p>
                      );
                    default:
                      return null;
                  }
                })
              ) : (
                <div className="text-center text-gray-500 my-10 italic">This insight currently has no content.</div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Continue Reading Section */}
      {relatedArticles.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-5xl">
            <h3 className="font-heading font-bold text-3xl text-darkBlue mb-10 text-center">Continue Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((article, idx) => (
                <Link to={`/insights/${article.slug}`} key={idx} className="group block">
                  <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative">
                    <img src={article.featuredImage || "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider">{article.category || 'News'}</span>
                    <span className="text-gray-400 text-xs">&bull; {Math.max(1, Math.ceil(JSON.stringify(article.sections || []).length / 1000))} Min Read</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-darkBlue group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default InsightDetail;
