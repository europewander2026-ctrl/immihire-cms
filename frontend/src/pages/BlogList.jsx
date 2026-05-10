import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import BlogHero from '../components/sections/BlogHero';
import GlobalPulseMap from '../components/sections/GlobalPulseMap';
import ArticleGrid from '../components/sections/ArticleGrid';
import DiplomaticDispatch from '../components/sections/DiplomaticDispatch';

const BlogList = () => {
  const [featuredInsight, setFeaturedInsight] = useState(null);
  const [latestInsights, setLatestInsights] = useState([]);
  const [allNonFeatured, setAllNonFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [uniqueCategories, setUniqueCategories] = useState(['All']);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/api/insights');
        const published = res.data.filter(i => i.isPublished);
        const featured = published.find(i => i.featured) || published[0];
        const latest = published.filter(i => i.id !== featured?.id);
        
        const categories = ['All', ...new Set(published.map(i => i.category).filter(Boolean))];
        
        setFeaturedInsight(featured);
        setAllNonFeatured(latest);
        setLatestInsights(latest);
        setUniqueCategories(categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="text-gray-800">
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
          readTime: "5 min read", // Mock read time
          title: insight.title,
          excerpt: insight.excerpt,
          image: insight.featuredImage || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
          link: `/insights/${insight.slug}`
        }))}
      />
      
      <DiplomaticDispatch />
    </div>
  );
};

export default BlogList;
