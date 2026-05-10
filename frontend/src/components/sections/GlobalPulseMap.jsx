import React from 'react';

const defaultBeacons = [
  {
    country: "Canada",
    top: "25%",
    left: "20%",
    code: "CA-EE-328",
    statusBadge: { text: "Active Draw", theme: "bg-green-500/20 text-green-400 border-green-500/30" },
    title: "Express Entry Update",
    stats: [
      { label: "CRS Score", value: "480", valueColor: "text-primary" },
      { label: "Invitations", value: "3,500", valueColor: "text-white" }
    ],
    buttonText: "Analyze Data",
    buttonTheme: "bg-primary/20 hover:bg-primary/40 border-primary/50 text-primary"
  },
  {
    country: "UK",
    top: "28%",
    left: "47%",
    code: "UK-H&C-25",
    statusBadge: { text: "Policy Shift", theme: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    title: "Care Worker Visa",
    description: "New salary thresholds announced for 2025 applications. Dependents policy updated.",
    buttonText: "Read Briefing",
    buttonTheme: "bg-purple-500/20 hover:bg-purple-500/40 border-purple-500/50 text-purple-300"
  },
  {
    country: "Germany",
    top: "30%",
    left: "51%",
    code: "DE-OC-01",
    statusBadge: { text: "High Demand", theme: "bg-red-500/20 text-red-400 border-red-500/30" },
    title: "Chancenkarte",
    description: "Opportunity Card quota increased for IT & Engineering professionals. No German required.",
    buttonText: "Check Eligibility",
    buttonTheme: "bg-red-500/20 hover:bg-red-500/40 border-red-500/50 text-red-300"
  },
  {
    country: "Australia",
    top: "75%",
    left: "85%",
    code: "AU-189-R4",
    statusBadge: { text: "Invitation Round", theme: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    title: "Subclass 189",
    description: "Focus shifting to Healthcare, Teaching, and Infrastructure roles. State nominations open for Victoria.",
    buttonText: "View Occupations",
    buttonTheme: "bg-yellow-500/20 hover:bg-yellow-500/40 border-yellow-500/50 text-yellow-300"
  }
];

const GlobalPulseMap = ({
  heading = "Live Activity Feed",
  subheading = "Real-time monitoring of immigration policy changes. Hover over the pulsing beacons for intel.",
  beacons = defaultBeacons
}) => {
  const renderBeacons = beacons && beacons.length > 0 ? beacons : defaultBeacons;

  return (
    <>
      <style>{`
        /* Global Command Center (Map) */
        .map-section {
            background-color: #000814;
            position: relative;
            height: 700px;
            overflow: hidden;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .map-bg {
            position: absolute;
            inset: 0;
            background-image: url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg');
            background-repeat: no-repeat;
            background-position: center;
            background-size: 80%;
            opacity: 0.2;
            filter: invert(1) hue-rotate(180deg) brightness(1.5);
        }

        .beacon {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(13, 95, 183, 0.3);
            border: 2px solid #0d5fb7;
            border-radius: 50%;
            cursor: pointer;
            z-index: 20;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 15px rgba(13, 95, 183, 0.8);
            animation: pulse-ring 2s infinite;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .beacon::after {
            content: '';
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
        }

        @keyframes pulse-ring {
            0% {
                transform: translate(-50%, -50%) scale(0.9);
                box-shadow: 0 0 0 0 rgba(13, 95, 183, 0.7);
                border-color: rgba(13, 95, 183, 1);
            }
            70% {
                transform: translate(-50%, -50%) scale(1.1);
                box-shadow: 0 0 0 15px rgba(13, 95, 183, 0);
                border-color: rgba(13, 95, 183, 0.5);
            }
            100% {
                transform: translate(-50%, -50%) scale(0.9);
                box-shadow: 0 0 0 0 rgba(13, 95, 183, 0);
                border-color: rgba(13, 95, 183, 1);
            }
        }

        .beacon-label {
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.7rem;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.7);
            text-transform: uppercase;
            letter-spacing: 1px;
            white-space: nowrap;
            pointer-events: none;
        }

        .holo-panel {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(20px) scale(0.9);
            width: 320px;
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(13, 95, 183, 0.5);
            border-left: 4px solid #0d5fb7;
            padding: 1.5rem;
            color: white;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            z-index: 30;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
            border-radius: 0 12px 12px 0;
        }

        .holo-panel::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            height: 10px;
            width: 1px;
            background: #0d5fb7;
            opacity: 0.5;
        }

        .beacon:hover {
            z-index: 50;
        }

        .beacon:hover .holo-panel {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0) scale(1);
        }
      `}</style>

      <section className="map-section relative flex items-center justify-center">
        {/* Legend / Controls */}
        <div className="absolute top-10 left-10 z-10 pointer-events-none">
          <h3 className="text-white font-mono uppercase tracking-widest text-sm border-l-4 border-primary pl-4 mb-2">{heading}</h3>
          <p className="text-gray-400 text-xs pl-4 max-w-xs">{subheading}</p>
        </div>

        <div className="map-bg"></div>

        {renderBeacons.map((beacon, index) => (
          <div key={index} className="beacon" style={{ top: beacon.top, left: beacon.left }}>
            <span className="beacon-label">{beacon.country}</span>
            <div className="holo-panel">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <span className="text-white font-mono text-xs opacity-70">{beacon.code}</span>
                <span className={`text-[0.6rem] px-2 py-0.5 rounded border ${beacon.statusBadge.theme}`}>
                  {beacon.statusBadge.text}
                </span>
              </div>
              <h4 className="font-bold text-lg mb-2 text-white">{beacon.title}</h4>
              
              {beacon.stats ? (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {beacon.stats.map((stat, sIndex) => (
                    <div key={sIndex}>
                      <p className="text-[0.6rem] text-gray-400 uppercase">{stat.label}</p>
                      <p className={`font-mono text-xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">{beacon.description}</p>
              )}

              <button className={`block w-full text-center border text-xs font-bold py-2 rounded transition-colors ${beacon.buttonTheme}`}>
                {beacon.buttonText}
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default GlobalPulseMap;
