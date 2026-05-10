import React, { useState } from 'react';

const DiplomaticDispatch = ({
  heading = "Never Miss an Update",
  description = "Immigration policies change overnight. Subscribe to our \"Diplomatic Dispatch\" to get critical updates delivered directly to your secure inbox."
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleNewsletter = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call to subscribe
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <>
      <style>{`
        .dispatch-container {
            background-image: repeating-linear-gradient(45deg, #002366 25%, transparent 25%, transparent 75%, #002366 75%, #002366), 
                              repeating-linear-gradient(45deg, #002366 25%, #000814 25%, #000814 75%, #002366 75%, #002366);
            background-position: 0 0, 10px 10px;
            background-size: 20px 20px;
        }
      `}</style>
      <section className="py-24 bg-darkBlue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 dispatch-container">
            <div className="md:w-1/2">
              <div className="inline-block bg-primary text-white text-[0.6rem] font-bold uppercase tracking-widest px-3 py-1 rounded-sm mb-4">
                Official Dispatch
              </div>
              <h2 className="font-heading font-bold text-3xl mb-4">{heading}</h2>
              <p className="text-gray-400 leading-relaxed">{description}</p>
            </div>
            <div className="md:w-1/2 w-full relative">
              <form className="flex flex-col gap-4" onSubmit={handleNewsletter}>
                <input 
                  type="email" 
                  placeholder="Your Email Address"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-6 py-4 text-white focus:outline-none focus:border-primary transition-colors"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-white text-darkBlue font-bold rounded-lg px-6 py-4 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe Securely'}</span>
                  <i className="fa-regular fa-paper-plane"></i>
                </button>
                <p className="text-center text-[0.6rem] text-gray-500 uppercase tracking-widest">No Spam. Only Intel.</p>
              </form>
              {status === 'success' && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-10">
                  <p className="text-green-400 font-bold flex items-center gap-2">
                    <i className="fa-solid fa-check-circle"></i> Subscribed!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DiplomaticDispatch;
