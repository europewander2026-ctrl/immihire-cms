import React, { useState, useEffect } from 'react';

const defaultOffices = [
  {
    id: "dubai",
    city: "Dubai HQ",
    flag: "🇦🇪",
    timeZone: "Asia/Dubai",
    address: "Office 402, Business Bay<br>Dubai, United Arab Emirates",
    mapLink: "#"
  },
  {
    id: "toronto",
    city: "Toronto",
    flag: "🇨🇦",
    timeZone: "America/Toronto",
    address: "King Street West, Suite 300<br>Toronto, ON, Canada",
    mapLink: "#"
  }
];

const OfficeCard = ({ office }) => {
  const [time, setTime] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateObj = new Date(now.toLocaleString("en-US", { timeZone: office.timeZone }));
      const hour = dateObj.getHours();
      
      const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setTime(formattedTime);
      
      // Open between 9 AM and 6 PM local time
      setIsOpen(hour >= 9 && hour < 18);
      
      // Day between 6 AM and 6 PM local time
      setIsDay(hour >= 6 && hour < 18);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [office.timeZone]);

  return (
    <div className="location-card group">
      <div className={`sky-header ${isDay ? 'sky-day' : 'sky-night'}`}>
        {isDay ? (
          <div className="sun"></div>
        ) : (
          <>
            <div className="moon"></div>
            {/* Generate some stars */}
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="star" 
                style={{ 
                  top: `${Math.random() * 100}%`, 
                  left: `${Math.random() * 100}%`, 
                  animationDelay: `${Math.random() * 2}s` 
                }}
              ></div>
            ))}
          </>
        )}
      </div>
      <div className="p-8 relative">
        <div className="absolute -top-8 right-8 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl border border-gray-100">
          {office.flag}
        </div>
        <h3 className="font-heading font-bold text-2xl text-darkBlue mb-1">{office.city}</h3>
        <p className="text-primary font-bold text-sm mb-4">
          {time} 
          {isOpen ? (
            <span className="text-green-600 ml-2">● Open Now</span>
          ) : (
            <span className="text-red-500 ml-2">● Closed</span>
          )}
        </p>
        <p className="text-gray-500 text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: office.address }}></p>
        <a href={office.mapLink} className="inline-flex items-center text-sm font-bold text-darkBlue hover:text-primary gap-2">
          <i className="fa-solid fa-diamond-turn-right"></i> Get Directions
        </a>
      </div>
    </div>
  );
};

const GlobalOffices = ({ 
  heading = "Global Offices",
  offices = defaultOffices 
}) => {
  const renderOffices = offices && offices.length > 0 ? offices : defaultOffices;

  return (
    <>
      <style>{`
        /* Live Location Card Styles */
        .location-card {
            border-radius: 24px;
            overflow: hidden;
            position: relative;
            transition: transform 0.3s ease;
            height: 100%;
            background: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }

        .location-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .sky-header {
            height: 120px;
            position: relative;
            overflow: hidden;
            transition: background 1s ease;
        }

        .sky-day {
            background: linear-gradient(to bottom, #60a5fa, #bfdbfe);
        }

        .sun {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #fbbf24;
            border-radius: 50%;
            box-shadow: 0 0 20px #fbbf24;
        }

        .sky-night {
            background: linear-gradient(to bottom, #0f172a, #1e293b);
        }

        .moon {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 30px;
            height: 30px;
            background: #e2e8f0;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        .star {
            position: absolute;
            background: white;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            animation: twinkle 2s infinite ease-in-out;
        }

        @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
      `}</style>
      <section id="offices" className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl text-center text-darkBlue mb-16">{heading}</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {renderOffices.map((office, index) => (
              <OfficeCard key={index} office={office} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GlobalOffices;
