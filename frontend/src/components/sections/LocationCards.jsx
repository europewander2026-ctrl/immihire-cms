import React, { useEffect } from 'react';

const defaultOffices = [
  {
    city: 'dubai',
    label: 'Dubai HQ',
    timezone: 'Asia/Dubai',
    flag: '🇦🇪',
    address: 'Office 402, Business Bay',
    addressLine2: 'Dubai, United Arab Emirates'
  },
  {
    city: 'toronto',
    label: 'Toronto',
    timezone: 'America/Toronto',
    flag: '🇨🇦',
    address: 'King Street West, Suite 300',
    addressLine2: 'Toronto, ON, Canada'
  }
];

const LocationCards = ({
  title = 'Global Offices',
  offices = defaultOffices
}) => {
  useEffect(() => {
    const updateCardDisplay = (city, hour, dateObj) => {
      const sky = document.getElementById(`sky-${city}`);
      const timeText = document.getElementById(`time-${city}`);
      if (!sky || !timeText) return;

      const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const isOpen = hour >= 9 && hour < 18;
      const statusHtml = isOpen
        ? `<span class="text-green-600 ml-2">● Open Now</span>`
        : `<span class="text-red-500 ml-2">● Closed</span>`;
      timeText.innerHTML = `${formattedTime} ${statusHtml}`;

      let skyContent = '';
      if (hour >= 6 && hour < 18) {
        sky.className = 'sky-header sky-day';
        skyContent = '<div class="sun"></div>';
      } else {
        sky.className = 'sky-header sky-night';
        skyContent = '<div class="moon"></div>';
        for (let i = 0; i < 15; i++) {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = Math.random() * 2;
          skyContent += `<div class="star" style="top:${top}%; left:${left}%; animation-delay:${delay}s"></div>`;
        }
      }
      sky.innerHTML = skyContent;
    };

    const updateOfficeStatus = () => {
      const now = new Date();
      (offices || defaultOffices).forEach(office => {
        const localDate = new Date(now.toLocaleString("en-US", { timeZone: office.timezone }));
        updateCardDisplay(office.city, localDate.getHours(), localDate);
      });
    };

    const interval = setInterval(updateOfficeStatus, 1000);
    updateOfficeStatus();

    return () => clearInterval(interval);
  }, [offices]);

  return (
    <>
      <style>{`
        .location-card {
          border-radius: 24px; overflow: hidden; position: relative; transition: transform 0.3s ease;
          height: 100%; background: white; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }
        .location-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
        .sky-header { height: 120px; position: relative; overflow: hidden; transition: background 1s ease; }
        .sky-day { background: linear-gradient(to bottom, #60a5fa, #bfdbfe); }
        .sun { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; background: #fbbf24; border-radius: 50%; box-shadow: 0 0 20px #fbbf24; }
        .sky-night { background: linear-gradient(to bottom, #0f172a, #1e293b); }
        .moon { position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; background: #e2e8f0; border-radius: 50%; box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
        .star { position: absolute; background: white; width: 2px; height: 2px; border-radius: 50%; animation: twinkle 2s infinite ease-in-out; }
        @keyframes twinkle { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>

      <section id="offices" className="py-24 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <h2 className="font-heading font-bold text-3xl text-center text-darkBlue mb-16">{title}</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {(offices || defaultOffices).map((office, i) => (
              <div key={i} className="location-card group">
                <div className="sky-header" id={`sky-${office.city}`}></div>
                <div className="p-8 relative">
                  <div className="absolute -top-8 right-8 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl border border-gray-100">
                    {office.flag}
                  </div>
                  <h3 className="font-heading font-bold text-2xl text-darkBlue mb-1">{office.label}</h3>
                  <p className="text-primary font-bold text-sm mb-4" id={`time-${office.city}`}>--:--</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {office.address}<br />{office.addressLine2}
                  </p>
                  <a href="#" className="inline-flex items-center text-sm font-bold text-darkBlue hover:text-primary gap-2">
                    <i className="fa-solid fa-diamond-turn-right"></i> Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default LocationCards;
