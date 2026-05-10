import React from 'react';
import { Link } from 'react-router-dom';

const defaultArticles = [
  {
    category: "Real Estate",
    date: "Oct 24, 2025",
    readTime: "5 min read",
    title: "Buying Your First Home in Toronto: A Newcomer's Guide",
    excerpt: "Navigating the GTA market as a new Permanent Resident. Understanding the foreign buyer ban exceptions and mortgage stress tests.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
    link: "/blog/housing-toronto"
  },
  {
    category: "Career Advice",
    date: "Oct 20, 2025",
    readTime: "6 min read",
    title: "Ace Your Job Interview in Australia: Cultural Codes",
    excerpt: "Tall Poppy Syndrome, the 'Coffee Test', and why being too formal might cost you the job in Sydney or Melbourne.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2669&auto=format&fit=crop",
    link: "/blog/jobs-australia"
  },
  {
    category: "Education",
    date: "Oct 15, 2025",
    readTime: "4 min read",
    title: "Top 10 Affordable Universities in Europe (2025)",
    excerpt: "Tuition-free options in Germany and low-cost degrees in Poland. How to get a world-class education without the debt.",
    image: "https://plus.unsplash.com/premium_photo-1661909267383-58991abdca51?q=80&w=1740&auto=format&fit=crop",
    link: "/blog/study-europe"
  },
  {
    category: "Immigration Policy",
    date: "Oct 10, 2025",
    readTime: "3 min read",
    title: "The Future of H-1B Visas: 2025 Lottery Shift",
    excerpt: "Breaking down the new beneficiary-centric selection process. What tech workers need to know before the March deadline.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
    link: "/blog/policy-usa"
  }
];

const ArticleGrid = ({
  heading = "Latest Articles",
  articles = defaultArticles
}) => {
  const renderArticles = articles && articles.length > 0 ? articles : defaultArticles;

  return (
    <>
      <style>{`
        .blog-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            border: 1px solid #f1f5f9;
        }

        .blog-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
        }

        .blog-thumb {
            height: 240px;
            overflow: hidden;
            position: relative;
        }

        .blog-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
        }

        .blog-card:hover .blog-thumb img {
            transform: scale(1.05);
        }
      `}</style>
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-heading font-bold text-3xl text-darkBlue">{heading}</h2>
            <div className="hidden md:flex gap-2">
              <button className="px-4 py-2 rounded-full border border-primary text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors">All</button>
              <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-500 text-xs font-bold hover:border-primary hover:text-primary transition-colors">Policy</button>
              <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-500 text-xs font-bold hover:border-primary hover:text-primary transition-colors">Lifestyle</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {renderArticles.map((article, index) => (
              <article key={index} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row h-full">
                <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
                  <img src={article.image} alt={article.category} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold text-darkBlue">
                    {article.category}
                  </div>
                </div>
                <div className="p-8 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 font-mono">
                      <span><i className="fa-regular fa-calendar"></i> {article.date}</span>
                      <span><i className="fa-regular fa-clock"></i> {article.readTime}</span>
                    </div>
                    <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3 group-hover:text-primary transition-colors">
                      <Link to={article.link}>{article.title}</Link>
                    </h3>
                    <p className="text-gray-500 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <Link to={article.link} className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase hover:gap-4 transition-all">
                    Read Article <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ArticleGrid;
