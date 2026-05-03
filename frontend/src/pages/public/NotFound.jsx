import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/public/SEOHead';

const NotFound = () => {
  const [gameState, setGameState] = useState({ won: false, opened: [] });
  const [stampActive, setStampActive] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStampActive(true);
      setIsShaking(true);
      const timer2 = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer2);
    }, 500);
    return () => clearTimeout(timer1);
  }, []);

  const handleBagClick = (index, isWinner) => {
    if (gameState.opened.includes(index) || gameState.won) return;

    if (isWinner) {
      setGameState((prev) => ({ won: true, opened: [...prev.opened, index] }));
    } else {
      setGameState((prev) => ({ ...prev, opened: [...prev.opened, index] }));
      // Optional: Add a brief local shake effect to the specific bag if needed, 
      // but CSS animations can handle that via class toggle if configured.
    }
  };

  const bags = [
    { color: 'bg-amber-600', isWinner: false },
    { color: 'bg-blue-600', isWinner: true },
    { color: 'bg-slate-700', isWinner: false }
  ];

  return (
    <div 
      className="text-gray-800 bg-[#f8f9fa] overflow-hidden min-h-screen flex flex-col"
      style={{ animation: isShaking ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both" : "" }}
    >
      <SEOHead title="404 - Visa Denied | ImmiHire" />

      {/* Embedded CSS for this specific page component if it's not in global CSS */}
      <style>{`
        .passport-bg {
            position: absolute; inset: 0; background-color: #f1f5f9;
            background-image: radial-gradient(#e2e8f0 1px, transparent 1px), radial-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 20px 20px; background-position: 0 0, 10px 10px; z-index: 0;
        }
        .denied-stamp {
            font-family: 'Black Ops One', cursive; color: #ef4444; border: 8px solid #ef4444;
            padding: 1rem 3rem; font-size: 5rem; text-transform: uppercase; border-radius: 16px;
            opacity: 0; mask-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png');
            mask-size: 900px; mix-blend-mode: multiply; line-height: 1; white-space: nowrap;
        }
        .denied-stamp.active { animation: stamp-slam 0.4s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards; }
        .luggage-area { display: flex; gap: 2rem; justify-content: center; margin-top: 3rem; perspective: 1000px; z-index: 10; relative; }
        .suitcase {
            width: 100px; height: 80px; border-radius: 12px; position: relative; cursor: pointer;
            transition: transform 0.3s, background 0.3s, opacity 0.3s; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .suitcase::before {
            content: ''; position: absolute; top: -10px; left: 30%; width: 40%; height: 10px;
            border: 4px solid #1e293b; border-bottom: none; border-radius: 10px 10px 0 0;
        }
        .suitcase:hover { transform: translateY(-10px) rotate(5deg); }
        .suitcase.opened { transform: rotateX(-20deg) translateY(20px); opacity: 0.5; pointer-events: none; }
        .boarding-pass-hidden {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
            background: white; padding: 1rem 2rem; border-radius: 12px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
            text-align: center; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 50;
            width: 300px; border-left: 8px solid #0d5fb7;
        }
        .boarding-pass-hidden.found { transform: translate(-50%, -50%) scale(1); }
        @keyframes stamp-slam { 0% { opacity: 0; transform: scale(5) rotate(-15deg); } 100% { opacity: 1; transform: scale(1) rotate(-5deg); } }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>

      <div className="passport-bg"></div>

      <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 mt-32">
        <div className="text-center mb-8 relative">
          <h1 className="font-heading font-bold text-[10rem] text-gray-200 leading-none select-none">404</h1>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 denied-stamp ${stampActive ? 'active' : ''}`}>
            VISA DENIED
          </div>
        </div>

        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-2xl text-darkBlue mb-4">Destination Unknown</h2>
          <p className="text-gray-500 font-mono text-sm leading-relaxed">
            It seems your flight path has encountered an error. The page you are looking for has been deported or does not exist.
            <br /><br />
            <span className="text-primary font-bold">Mission:</span> Find your missing boarding pass in the luggage below to return home.
          </p>
        </div>

        {/* The Luggage Game */}
        <div className="luggage-area" id="luggage-zone">
          {bags.map((bag, index) => {
            const isOpened = gameState.opened.includes(index);
            const hideBag = gameState.won && !bag.isWinner;
            
            let currentBg = bag.color;
            if (isOpened) {
              currentBg = bag.isWinner ? '!bg-green-500' : '!bg-red-500';
            }

            return (
              <div
                key={index}
                className={`suitcase ${currentBg} ${isOpened ? 'opened' : ''}`}
                style={{
                  opacity: hideBag ? 0 : undefined,
                  pointerEvents: (isOpened || gameState.won) ? 'none' : 'auto'
                }}
                onClick={() => handleBagClick(index, bag.isWinner)}
              ></div>
            );
          })}
        </div>

        {/* Hidden Boarding Pass (Revealed on Win) */}
        <div className={`boarding-pass-hidden ${gameState.won ? 'found' : ''}`}>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
            <span className="text-xs font-mono text-gray-400">FLIGHT: HM-404</span>
            <span className="text-xs font-bold text-green-500">FOUND</span>
          </div>
          <h3 className="font-heading font-bold text-lg text-darkBlue mb-1">Return Ticket</h3>
          <p className="text-xs text-gray-500 mb-4">Passenger: Lost Traveler</p>

          <Link to="/" className="block w-full py-2 bg-primary text-white font-bold rounded text-xs uppercase tracking-widest hover:bg-darkBlue transition-colors">
            Board Plane Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
