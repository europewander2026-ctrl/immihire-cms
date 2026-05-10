import React, { useState } from 'react';

const defaultCategories = [
  {
    id: 'bg-skilled',
    label: 'Skilled Migration',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    infoTitle: 'Skilled Migration',
    infoText: 'Canada Express Entry, Australia SkillSelect. High demand for IT, Engineering, and Healthcare.',
  },
  {
    id: 'bg-study',
    label: 'Study Abroad',
    bgImage: 'https://plus.unsplash.com/premium_photo-1661909267383-58991abdca51?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    infoTitle: 'Study Abroad',
    infoText: 'Unlock global opportunities with degrees from top universities in UK and USA.',
  },
  {
    id: 'bg-business',
    label: 'Business Investor',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    bgStyle: { filter: 'hue-rotate(200deg) brightness(0.4)' },
    infoTitle: 'Business Investor',
    infoText: 'Expand your empire. Golden Visas, Startup Visas, and Investment pathways.',
  },
  {
    id: 'bg-visit',
    label: 'Visit & Tourist',
    bgImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop',
    infoTitle: 'Visit & Tourist',
    infoText: 'Explore the world with hassle-free tourist visa processing.',
  },
];

const SpotlightCinema = ({ categories = defaultCategories }) => {
  const [activeBg, setActiveBg] = useState('bg-default');
  const activeCategory = categories.find(c => c.id === activeBg);

  return (
    <>
      <style>{`
        /* Spotlight Cinema Styles */
        .cinema-container {
            position: relative;
            height: 100vh;
            background-color: #000814;
            color: white;
            display: flex;
            align-items: center;
            overflow: hidden;
            transition: background-image 0.5s ease-in-out;
        }

        .cinema-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 0.6s ease;
            filter: brightness(0.4);
            z-index: 0;
        }

        .cinema-bg.active {
            opacity: 1;
        }

        /* The List */
        .service-list-item {
            font-family: 'Montserrat', sans-serif;
            font-size: 4rem;
            font-weight: 800;
            color: transparent;
            -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            line-height: 1.1;
        }

        @media (hover: hover) {
          .service-list-item:hover {
              color: white;
              -webkit-text-stroke: 0px;
              padding-left: 20px;
          }
        }
      `}</style>
      <section className="cinema-container" id="cinema-section">
        {/* Default Background */}
        <div
          className={`cinema-bg ${activeBg === 'bg-default' ? 'active' : ''}`}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }}
      ></div>

      {/* Dynamic Backgrounds */}
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`cinema-bg ${activeBg === cat.id ? 'active' : ''}`}
          style={{
            backgroundImage: `url('${cat.bgImage}')`,
            ...(cat.bgStyle || {}),
          }}
        ></div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 flex items-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">Select a Category</p>
          <ul className="space-y-4">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="service-list-item"
                onMouseEnter={() => setActiveBg(cat.id)}
              >
                {cat.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Context Info (Changes with state) */}
        <div className="hidden lg:block w-1/3 text-right">
          <div className="p-8 border-l border-white/20 backdrop-blur-sm bg-white/5 rounded-r-2xl transition-all duration-300">
            <h3 className="text-3xl font-bold mb-2 text-white">
              {activeCategory ? activeCategory.infoTitle : 'Explore'}
            </h3>
            <p className="text-gray-300">
              {activeCategory ? activeCategory.infoText : 'Hover over a category to see where we can take you.'}
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default SpotlightCinema;
