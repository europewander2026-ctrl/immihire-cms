import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const FloatingWidget = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/api/settings/global');
        setSettings(res.data);
      } catch (err) {
        console.error('Failed to load global settings for floating widget:', err);
      }
    };
    fetchSettings();
  }, []);

  if (!settings) return null;

  const whatsappNumber = settings.whatsappNumber;
  let socialIcons = [];
  try {
    if (settings.floatingSocialIcons) {
      socialIcons = typeof settings.floatingSocialIcons === 'string' ? JSON.parse(settings.floatingSocialIcons) : settings.floatingSocialIcons;
    }
  } catch (e) {
    console.error('Failed to parse floating social icons', e);
  }

  if (!whatsappNumber && socialIcons.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {socialIcons.map((social, index) => (
        <a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110 hover:shadow-xl ${social.color || 'bg-gray-800'}`}
          title={social.label || 'Social Link'}
        >
          <i className={`${social.icon || 'fa-solid fa-link'} text-xl`}></i>
        </a>
      ))}

      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110 hover:shadow-xl"
          title="Chat with us on WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-3xl"></i>
        </a>
      )}
    </div>
  );
};

export default FloatingWidget;
