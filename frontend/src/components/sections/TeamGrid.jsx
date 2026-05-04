import React from 'react';

const TeamGrid = ({
  title = 'Meet The Team',
  subtitle = 'The people behind your immigration journey.',
  members = []
}) => {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl text-darkBlue mb-4">{title}</h2>
          <p className="text-gray-500">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {members.map((member, i) => (
            <div
              key={i}
              className="group bg-gray-50 rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <i className="fa-solid fa-user text-6xl text-blue-300"></i>
                  </div>
                )}
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#000814] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-blue-700 transition-all"
                    >
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-darkBlue">{member.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
