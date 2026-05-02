import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RevealWrapper from '../components/RevealWrapper';
import api from '../utils/api';

const BlogList = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [featuredInsight, setFeaturedInsight] = useState(null);
  const [latestInsights, setLatestInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
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
    fetchInsights();
  }, []);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    try {
      await api.post('/api/subscribe', { email });
      alert('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      if (error.response?.data?.error === 'Already subscribed') {
        alert('You are already subscribed!');
      } else {
        alert('Subscription failed. Please try again later.');
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="text-gray-800">
      {/* Hero Section: Featured Article Spotlight */}
      <section className="pt-40 pb-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px] z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <RevealWrapper className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The ImmiHire Journal
              </div>
              <h1 className="font-heading font-bold text-5xl md:text-7xl text-darkBlue mb-6 leading-tight">
                Navigating <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                  New Horizons.
                </span>
              </h1>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                Expert perspectives on immigration law, global mobility trends, and the stories that define our borders.
              </p>
            </RevealWrapper>

            <RevealWrapper className="lg:w-1/2 relative" delay={100}>
              <div className="absolute -top-6 -right-6 z-20">
                <div className="w-24 h-24 relative animate-spin-slow">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <path id="curve" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                    <text className="text-[10px] font-bold fill-primary uppercase tracking-widest">
                      <textPath href="#curve">Featured Story • Featured Story •</textPath>
                    </text>
                  </svg>
                </div>
              </div>

              {loading ? (
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl h-64 flex items-center justify-center">
                  <span className="text-gray-400">Loading featured insight...</span>
                </div>
              ) : featuredInsight ? (
                <Link to={`/insights/${featuredInsight.slug}`} className="relative group block cursor-pointer">
                  <div className="absolute inset-0 bg-darkBlue rounded-3xl transform rotate-3 transition-transform group-hover:rotate-6"></div>
                  <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-transform group-hover:-translate-y-2">
                    <img src={featuredInsight.featuredImage || "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2669&auto=format&fit=crop"} className="w-full h-64 object-cover" alt="Featured" />
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{featuredInsight.category || 'Article'}</span>
                        <span className="text-gray-400 text-xs">{new Date(featuredInsight.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3 group-hover:text-primary transition-colors">
                        {featuredInsight.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2">
                        {featuredInsight.excerpt}
                      </p>
                      <div className="mt-6 flex items-center text-primary font-bold text-sm">
                        <span className="flex items-center">
                          Read Analysis <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : null}
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* Section 2: Global Pulse Network */}
      <section className="relative h-[700px] overflow-hidden border-b border-white/10 bg-[#000814] flex items-center justify-center map-section">
        <div className="absolute top-10 left-10 z-10 pointer-events-none">
          <h3 className="text-white font-mono uppercase tracking-widest text-sm border-l-4 border-primary pl-4 mb-2">Live Activity Feed</h3>
          <p className="text-gray-400 text-xs pl-4 max-w-xs">Real-time monitoring of immigration policy changes. Hover over the pulsing beacons for intel.</p>
        </div>

        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-no-repeat bg-center bg-[length:80%] opacity-20 filter invert-[1] hue-rotate-[180deg] brightness-[1.5]"></div>

        {/* Beacon 1: Canada */}
        <div className="absolute w-5 h-5 bg-primary/30 border-2 border-primary rounded-full cursor-pointer z-20 shadow-[0_0_15px_rgba(13,95,183,0.8)] animate-[pulse-ring_2s_infinite] flex items-center justify-center hover:z-50 group transition-all" style={{ top: '25%', left: '20%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[0.7rem] font-bold text-white/70 uppercase tracking-[1px] whitespace-nowrap pointer-events-none">Canada</span>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-5 scale-90 w-[320px] bg-slate-900/90 backdrop-blur-[20px] border border-primary/50 border-l-4 p-6 text-white opacity-0 invisible transition-all duration-300 pointer-events-none z-30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-r-xl group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-blue-400 font-mono text-xs">CA-EE-328</span>
              <span className="text-[0.6rem] bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">Active Draw</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-white">Express Entry Update</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[0.6rem] text-gray-400 uppercase">CRS Score</p>
                <p className="font-mono text-xl font-bold text-primary">480</p>
              </div>
              <div>
                <p className="text-[0.6rem] text-gray-400 uppercase">Invitations</p>
                <p className="font-mono text-xl font-bold text-white">3,500</p>
              </div>
            </div>
            <button className="w-full text-center bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary text-xs font-bold py-2 rounded transition-colors pointer-events-auto">Analyze Data</button>
          </div>
        </div>

        {/* Beacon 2: UK */}
        <div className="absolute w-5 h-5 bg-primary/30 border-2 border-primary rounded-full cursor-pointer z-20 shadow-[0_0_15px_rgba(13,95,183,0.8)] animate-[pulse-ring_2s_infinite] flex items-center justify-center hover:z-50 group transition-all" style={{ top: '28%', left: '47%', transform: 'translate(-50%, -50%)' }}>
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[0.7rem] font-bold text-white/70 uppercase tracking-[1px] whitespace-nowrap pointer-events-none">UK</span>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-5 scale-90 w-[320px] bg-slate-900/90 backdrop-blur-[20px] border border-primary/50 border-l-4 p-6 text-white opacity-0 invisible transition-all duration-300 pointer-events-none z-30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-r-xl group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-purple-400 font-mono text-xs">UK-H&C-25</span>
              <span className="text-[0.6rem] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded border border-purple-500/30">Policy Shift</span>
            </div>
            <h4 className="font-bold text-lg mb-2 text-white">Care Worker Visa</h4>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">New salary thresholds announced for 2025 applications. Dependents policy updated.</p>
            <button className="w-full text-center bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 text-purple-300 text-xs font-bold py-2 rounded transition-colors pointer-events-auto">Read Briefing</button>
          </div>
        </div>
      </section>

      {/* Section 3: Latest Insights */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-heading font-bold text-3xl text-darkBlue">Latest Articles</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full border border-primary bg-primary text-white text-xs font-bold transition-colors">All</button>
              <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-500 text-xs font-bold hover:border-primary hover:text-primary transition-colors">Policy</button>
              <button className="px-4 py-2 rounded-full border border-gray-300 text-gray-500 text-xs font-bold hover:border-primary hover:text-primary transition-colors">Lifestyle</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-2 text-center text-gray-400 py-10">Loading insights...</div>
            ) : latestInsights.length > 0 ? (
              latestInsights.map((insight) => (
                <article key={insight.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col md:flex-row h-full">
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img src={insight.featuredImage || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop"} alt={insight.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    {insight.category && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-bold text-darkBlue">{insight.category}</div>
                    )}
                  </div>
                  <div className="p-8 md:w-3/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 font-mono">
                        <span><i className="fa-regular fa-calendar"></i> {new Date(insight.createdAt).toLocaleDateString()}</span>
                        <span><i className="fa-regular fa-clock"></i> 5 min read</span>
                      </div>
                      <h3 className="font-heading font-bold text-2xl text-darkBlue mb-3 group-hover:text-primary transition-colors">
                        <Link to={`/insights/${insight.slug}`}>{insight.title}</Link>
                      </h3>
                      <p className="text-gray-500 line-clamp-3">{insight.excerpt}</p>
                    </div>
                    <Link to={`/insights/${insight.slug}`} className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase hover:gap-4 transition-all">
                      Read Article <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-400 py-10">No latest articles available.</div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Diplomatic Dispatch */}
      <section className="py-24 bg-darkBlue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #002366 25%, transparent 25%, transparent 75%, #002366 75%, #002366), repeating-linear-gradient(45deg, #002366 25%, #000814 25%, #000814 75%, #002366 75%, #002366)',
            backgroundPosition: '0 0, 10px 10px',
            backgroundSize: '20px 20px'
          }}>
            <div className="md:w-1/2">
              <div className="inline-block bg-primary text-white text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1 rounded-sm mb-4">Official Dispatch</div>
              <h2 className="font-heading font-bold text-3xl mb-4">Never Miss an Update</h2>
              <p className="text-gray-400 leading-relaxed">Immigration policies change overnight. Subscribe to our "Diplomatic Dispatch" to get critical updates delivered directly to your secure inbox.</p>
            </div>
            <div className="md:w-1/2 w-full">
              <form className="flex flex-col gap-4" onSubmit={handleNewsletter}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email Address" className="w-full bg-black/30 border border-white/20 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors" required />
                <button type="submit" disabled={isSubscribing} className={`w-full bg-white text-darkBlue font-bold rounded-lg px-6 py-4 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 ${isSubscribing ? 'opacity-80' : ''}`}>
                  <span>{isSubscribing ? 'Subscribing...' : 'Subscribe Securely'}</span>
                  <i className="fa-regular fa-paper-plane"></i>
                </button>
                <p className="text-center text-[0.6rem] text-gray-500 uppercase tracking-widest">No Spam. Only Intel.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Global CSS injected into component */}
      <style>{`
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.9); box-shadow: 0 0 0 0 rgba(13, 95, 183, 0.7); border-color: rgba(13, 95, 183, 1); }
          70% { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 0 15px rgba(13, 95, 183, 0); border-color: rgba(13, 95, 183, 0.5); }
          100% { transform: translate(-50%, -50%) scale(0.9); box-shadow: 0 0 0 0 rgba(13, 95, 183, 0); border-color: rgba(13, 95, 183, 1); }
        }
      `}</style>
    </div>
  );
};

export default BlogList;
