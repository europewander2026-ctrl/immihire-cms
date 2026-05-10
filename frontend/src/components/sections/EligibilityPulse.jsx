import React, { useState, useEffect } from 'react';

const EligibilityPulse = ({
  heading = "What are your odds?",
  description = "Use our interactive eligibility pulse to see how experience impacts your immigration probability.",
  disclaimer = "*For demonstration purposes only."
}) => {
  const [experience, setExperience] = useState(3);
  const [education, setEducation] = useState("Master's");

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

  // Simulated Score Logic
  const eduBonus = education === 'PhD' ? 10 : education === "Master's" ? 5 : 0;
  const score = Math.min(100, 50 + (experience * 4) + eduBonus);

  // Gauge Rotation: maps score 50-100 → 0-180 degrees
  const degrees = ((score - 50) / 50) * 180;

  // Color & Status thresholds
  let gaugeColor, statusText;
  if (score < 70) {
    gaugeColor = '#f59e0b'; // Amber
    statusText = 'Moderate Chance';
  } else if (score < 85) {
    gaugeColor = '#3b82f6'; // Blue
    statusText = 'Good Chance';
  } else {
    gaugeColor = '#22c55e'; // Green
    statusText = 'Excellent Chance';
  }

  const educationLevels = ["Bachelor's", "Master's", 'PhD'];

  return (
    <>
      <style>{`
        /* Pulse Calculator CSS */
        .gauge-container {
            width: 200px;
            height: 100px;
            /* Half circle */
            overflow: hidden;
            position: relative;
            margin: 0 auto;
        }

        .gauge-body {
            width: 200px;
            height: 200px;
            background: #e2e8f0;
            border-radius: 50%;
            position: absolute;
            top: 0;
        }

        .gauge-fill {
            width: 200px;
            height: 200px;
            background: #0d5fb7;
            border-radius: 50%;
            position: absolute;
            top: 0;
            clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
            transform-origin: center center;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gauge-cover {
            width: 160px;
            height: 160px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 20px;
            left: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        
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
      `}</style>
      
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-lightGray opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">

            {/* Left: Controls */}
            <div className="md:w-1/2 reveal">
              <h2 className="font-heading font-bold text-4xl text-darkBlue mb-6">{heading}</h2>
              <p className="text-gray-600 mb-8">
                {description} <br />
                <span className="text-xs text-gray-400 italic">{disclaimer}</span>
              </p>

              {/* Experience Slider */}
              <div className="mb-8">
                <label className="block font-bold text-gray-700 mb-2">
                  Years of Experience: <span className="text-primary">{experience}</span> Years
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Fresher</span>
                  <span>Expert</span>
                </div>
              </div>

              {/* Education Level */}
              <div className="mb-8">
                <label className="block font-bold text-gray-700 mb-2">Education Level</label>
                <div className="flex gap-2">
                  {educationLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() => setEducation(level)}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm font-semibold bg-white ${
                        education === level
                          ? 'border-2 border-primary text-primary'
                          : 'border border-gray-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Gauge */}
            <div className="md:w-1/2 flex justify-center reveal delay-200">
              <div className="bg-white p-10 rounded-3xl shadow-2xl text-center w-80 relative">
                <div className="gauge-container">
                  <div className="gauge-body"></div>
                  {/* Rotating fill */}
                  <div
                    className="gauge-fill"
                    style={{
                      transform: `rotate(${degrees}deg)`,
                      background: gaugeColor,
                    }}
                  ></div>
                  <div className="gauge-cover">
                    <span className="text-4xl font-bold text-darkBlue block">{score}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Points</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-bold text-lg text-gray-800">{statusText}</h4>
                  <p className="text-xs text-gray-400 mt-1">Based on simplified CRS grid</p>
                </div>

                {/* Pulse Ring Animation */}
                <div className="absolute inset-0 border-4 border-blue-100 rounded-3xl animate-pulse pointer-events-none"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default EligibilityPulse;
