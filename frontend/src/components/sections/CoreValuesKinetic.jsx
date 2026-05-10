import React, { useEffect } from 'react';

const defaultValues = [
  {
    title: "Integrity First",
    label: "Integrity",
    description: "Honest counsel is our currency. We never over-promise. We provide transparent assessments, clear fee structures, and realistic timelines.",
    iconClass: "fa-solid fa-scale-balanced",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Human Centric",
    label: "Empathy",
    description: "You are not a file number. We understand the hopes and fears behind every application. Your dream is our dedicated mission.",
    iconClass: "fa-solid fa-heart",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
  },
  {
    title: "Precision",
    label: "Excellence",
    description: "98% success rate isn't luck. It's engineering. Our legal team meticulously reviews every document to ensure zero-error filings.",
    iconClass: "fa-solid fa-rocket",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Future Ready",
    label: "Innovation",
    description: "Leveraging AI and data analytics to predict immigration trends and find the absolute best pathway for your unique profile.",
    iconClass: "fa-solid fa-lightbulb",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
  }
];

const CoreValuesKinetic = ({
  heading = "Our Core Values",
  subheading = "The principles that drive every decision we make.",
  values = defaultValues
}) => {

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

  const renderValues = values && values.length > 0 ? values : defaultValues;

  return (
    <>
      <style>{`
        /* Kinetic Accordion Styles */
        .kinetic-wrapper {
            display: flex;
            flex-direction: column;
            height: 800px;
            width: 100%;
            overflow: hidden;
            border-radius: 2rem;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 768px) {
            .kinetic-wrapper {
                flex-direction: row;
                height: 600px;
            }
        }

        .kinetic-panel {
            position: relative;
            flex: 1;
            overflow: hidden;
            cursor: pointer;
            transition: flex 0.7s cubic-bezier(0.25, 1, 0.5, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }

        .kinetic-panel:last-child {
            border-right: none;
        }

        .kinetic-panel img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.7s ease, filter 0.7s ease;
            filter: brightness(0.6) grayscale(0.5);
        }

        /* Hover State */
        @media (hover: hover) {
          .kinetic-panel:hover {
              flex: 4;
          }
          .kinetic-panel:hover img {
              filter: brightness(0.9) grayscale(0);
              transform: scale(1.1);
          }
        }

        .kinetic-content {
            position: relative;
            z-index: 10;
            color: white;
            text-align: center;
            opacity: 0.8;
            transition: all 0.5s ease;
            padding: 2rem;
            transform: translateY(20px);
        }

        @media (hover: hover) {
          .kinetic-panel:hover .kinetic-content {
              opacity: 1;
              transform: translateY(0);
          }
        }

        /* Vertical Text for Collapsed State (Desktop) */
        .panel-label {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            font-size: 1.5rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.7);
            white-space: nowrap;
            transition: opacity 0.3s;
        }

        @media (min-width: 768px) {
            .panel-label {
                bottom: auto;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-90deg);
            }
        }

        @media (hover: hover) {
          .kinetic-panel:hover .panel-label {
              opacity: 0;
          }
        }

        /* Large Text inside Expanded State */
        .expanded-text {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s 0.2s;
            max-width: 400px;
            margin: 0 auto;
        }

        @media (hover: hover) {
          .kinetic-panel:hover .expanded-text {
              opacity: 1;
              transform: translateY(0);
          }
        }
      `}</style>

      <section className="py-24 bg-[#000814] text-white overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 reveal">
            <h2 className="font-heading font-bold text-4xl mb-4">{heading}</h2>
            <p className="text-blue-200">{subheading}</p>
          </div>

          {/* Kinetic Wrapper */}
          <div className="kinetic-wrapper reveal">
            {renderValues.map((val, index) => (
              <div key={index} className="kinetic-panel group">
                <img src={val.image} alt={`${val.label} Background`} />
                <div className="panel-label">{val.label}</div>

                <div className="kinetic-content">
                  <div className="expanded-text">
                    <i className={`${val.iconClass} text-5xl mb-6 text-primary drop-shadow-[0_0_10px_rgba(13,95,183,0.8)]`}></i>
                    <h3 className="text-4xl font-bold font-heading mb-4">{val.title}</h3>
                    <p className="text-lg leading-relaxed text-gray-200">
                      {val.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CoreValuesKinetic;
