import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import api from '../utils/api';

const BlogDetail = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Assume API has a /api/blogs/:slug route or we fetch all and filter
        // For simplicity, fetching all and finding by slug
        const response = await api.get('/api/blogs');
        const found = response.data.find(b => b.slug === slug);
        
        if (found) {
          setBlog(found);
        } else {
          setError('Blog post not found.');
        }
      } catch (err) {
        setError('Failed to load blog post.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading article...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!blog) return null;

  // Safely sanitize the rich text HTML content
  const cleanHtml = DOMPurify.sanitize(blog.content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'br', 'span', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target']
  });

  return (
    <article className="max-w-4xl mx-auto py-20 px-6">
      {blog.imageUrl && (
        <img 
          src={blog.imageUrl} 
          alt={blog.title} 
          className="w-full h-64 md:h-96 object-cover rounded-3xl mb-10 shadow-lg"
        />
      )}
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        <p className="text-gray-500 text-sm">
          Published on {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </header>

      {/* Render Sanitized HTML safely */}
      <div 
        className="prose prose-lg prose-blue mx-auto"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </article>
  );
};

export default BlogDetail;
