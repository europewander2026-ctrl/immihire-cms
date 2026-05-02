import React, { useState } from 'react';
import RevealWrapper from '../RevealWrapper';

const EligibilityPulse = () => {
  const [experience, setExperience] = useState(3);
  const [education, setEducation] = useState("Master's");

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
    <section className="py-24 bg-white overflow-hidden relative">
      <div className="absolute inset-0 bg-lightGray opacity-50"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">

          {/* Left: Controls */}
          <RevealWrapper className="md:w-1/2">
            <h2 className="font-heading font-bold text-4xl text-darkBlue mb-6">What are your odds?</h2>
            <p className="text-gray-600 mb-8">
              Use our interactive eligibility pulse to see how experience impacts your immigration
              probability. <br />
              <span className="text-xs text-gray-400 italic">*For demonstration purposes only.</span>
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
          </RevealWrapper>

          {/* Right: Gauge */}
          <RevealWrapper className="md:w-1/2 flex justify-center">
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
          </RevealWrapper>

        </div>
      </div>
    </section>
  );
};

export default EligibilityPulse;
