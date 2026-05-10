import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogHero = ({
  badgeText = "The ImmiHire Journal",
  headingPart1 = "Navigating",
  headingPart2 = "New Horizons.",
  description = "Expert perspectives on immigration law, global mobility trends, and the stories that define our borders.",
  featuredArticle = {
    tag: "Policy Shift",
    date: "Today",
    title: "The 2025 Global Talent Strategy: What Changes for Applicants?",
    excerpt: "An in-depth look at how major economies are reshaping their skilled worker programs to attract top tier talent in the post-digital age.",
    image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2669&auto=format&fit=crop",
    link: "/blog/talent-strategy"
  }
}) => {

  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };
    window.addEventListener("scroll", reveal);
    reveal();
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    <>
      <style>{`
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(5px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
        }
        
        .animate-spin-slow {
            animation: spin 12s linear infinite;
        }
        
        @keyframes spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
      `}</style>
      
      <section className="pt-40 pb-20 bg-white relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px] z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Text */}
            <div className="lg:w-1/2 reveal active">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {badgeText}
              </div>
              <h1 className="font-heading font-bold text-5xl md:text-7xl text-darkBlue mb-6 leading-tight">
                {headingPart1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  {headingPart2}
                </span>
              </h1>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Right: Featured Card (The Twist) */}
            <div className="lg:w-1/2 relative reveal delay-100">
              {/* Rotating 'Featured' Badge */}
              <div className="absolute -top-6 -right-6 z-20">
                <div className="w-24 h-24 relative animate-spin-slow">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                    <text className="text-[10px] font-bold fill-primary uppercase tracking-widest">
                      <textPath href="#curve">
                        Featured Story • Featured Story •
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>

              {/* The Card */}
              <div className="relative group cursor-pointer">
                <Link to={featuredArticle.link} className="block">
                  <div className="absolute inset-0 bg-darkBlue rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-2">
                    <img src={featuredArticle.image} className="w-full h-64 object-cover" alt={featuredArticle.title} />
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{featuredArticle.tag}</span>
                        <span className="text-gray-400 text-xs">{featuredArticle.date}</span>
                      </div>
                      <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3 group-hover:text-primary transition-colors">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="mt-6 flex items-center text-primary font-bold text-sm">
                        <span className="flex items-center">
                          Read Analysis <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogHero;
