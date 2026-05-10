import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SectionRenderer from '../components/SectionRenderer';
import BlogHero from '../components/sections/BlogHero';
import GlobalPulseMap from '../components/sections/GlobalPulseMap';
import ArticleGrid from '../components/sections/ArticleGrid';
import DiplomaticDispatch from '../components/sections/DiplomaticDispatch';

const BlogList = () => {
  const [pageData, setPageData] = useState(null);
  const [featuredInsight, setFeaturedInsight] = useState(null);
  const [latestInsights, setLatestInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch page content
        const pageRes = await api.get('/api/pages/insights').catch(() => null);
        if (pageRes) setPageData(pageRes.data);

        // Fetch insights for the grid
        const res = await api.get('/api/insights');
        const published = res.data.filter(i => i.isPublished);
        const featured = published.find(i => i.featured) || published[0];
        const latest = published.filter(i => i.id !== featured?.id);
        
        setFeaturedInsight(featured);
        setLatestInsights(latest);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
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
          <BlogHero 
            featuredArticle={featuredInsight ? {
              tag: featuredInsight.category || 'Article',
              date: new Date(featuredInsight.createdAt).toLocaleDateString(),
              title: featuredInsight.title,
              excerpt: featuredInsight.excerpt,
              image: featuredInsight.featuredImage || "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2669&auto=format&fit=crop",
              link: `/insights/${featuredInsight.slug}`
            } : undefined}
          />
          
          <GlobalPulseMap />
          
          <ArticleGrid 
            articles={latestInsights.map(insight => ({
              category: insight.category || 'General',
              date: new Date(insight.createdAt).toLocaleDateString(),
              readTime: "5 min read",
              title: insight.title,
              excerpt: insight.excerpt,
              image: insight.featuredImage || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
              link: `/insights/${insight.slug}`
            }))}
          />
          
          <DiplomaticDispatch />
        </>
      )}
    </div>
  );
};

export default BlogList;
