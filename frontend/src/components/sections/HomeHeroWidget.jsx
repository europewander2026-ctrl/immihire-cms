import React, { useState } from 'react';
import api from '../../utils/api';

const HomeHeroWidget = ({
  titlePart1 = 'Best Immigration',
  titleHighlight = 'Services in Dubai',
  subtitle = 'ImmiHire Immigration and Management Consultants',
  description = 'An exclusive premier immigration consultancy with over 10 years of experience. We combine your needs with our expertise.',
  bgImage = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop',
  formTitle = 'Book Your Free Consultation',
  formSubtitle = 'Expert advice is just a click away.'
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    destination: '',
    residence: '',
    education: '',
    occupation: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      // Map form fields to the leads database schema
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        subject: formData.destination || 'General Inquiry',
        message: [
          formData.residence && `Country of Residence: ${formData.residence}`,
          formData.education && `Education: ${formData.education}`,
          formData.occupation && `Occupation: ${formData.occupation}`
        ].filter(Boolean).join(' | ') || 'Homepage lead capture form submission.'
      };

      await api.post('/api/contact', payload);
      setStatus('success');
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        destination: '', residence: '', education: '', occupation: ''
      });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputClasses = "w-full bg-white/60 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm text-gray-800";

  return (
    <>
      <style>{`
        .cloud-form {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), inset 0 0 80px rgba(255, 255, 255, 0.5);
        }
        .reveal { opacity: 0; transform: translateY(30px); filter: blur(5px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); filter: blur(0); }
      `}</style>

      <section className="relative min-h-[120vh] flex flex-col items-center pt-48 pb-20 bg-[#000814] text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            className="w-full h-full object-cover opacity-50"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#000814]/70 via-[#000814]/40 to-[#f8f9fa]"></div>
        </div>

        {/* Animated Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob" style={{ animationDelay: '2s' }}></div>

        {/* Hero Text */}
        <div className="container mx-auto px-6 relative z-10 text-center mb-16">
          <div className="reveal active">
            <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight drop-shadow-lg">
              {titlePart1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-white">
                {titleHighlight}
              </span>
            </h1>
            <h2 className="font-medium text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
              {subtitle}
            </h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow">
              {description}
            </p>
          </div>
        </div>

        {/* Cloud Form */}
        <div className="container mx-auto px-4 relative z-20 w-full max-w-6xl mt-auto">
          <div className="cloud-form rounded-[3rem] p-10 md:p-14 text-gray-800 animate-float">
            {/* Form Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-200/50 pb-6">
              <div>
                <h3 className="font-heading font-bold text-2xl md:text-3xl text-darkBlue mb-2">{formTitle}</h3>
                <p className="text-gray-500 text-sm">{formSubtitle}</p>
              </div>
              <div className="mt-4 md:mt-0 px-4 py-1 bg-blue-50 text-primary text-xs font-bold uppercase tracking-widest rounded-full border border-blue-100">
                Free Assessment
              </div>
            </div>

            {/* Success Banner */}
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-bold text-sm flex items-center gap-3">
                <i className="fa-solid fa-circle-check text-lg"></i>
                Thank you! Our team will contact you within 24 hours.
              </div>
            )}

            {/* Error Banner */}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold text-sm flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-lg"></i>
                {errorMsg}
              </div>
            )}

            {/* Form Grid */}
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6" onSubmit={handleSubmit}>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                  disabled={status === 'loading'}
                  className={inputClasses}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Surname</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                  disabled={status === 'loading'}
                  className={inputClasses}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Contact</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  disabled={status === 'loading'}
                  className={inputClasses}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+971..."
                  required
                  disabled={status === 'loading'}
                  className={inputClasses}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Destination</label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  disabled={status === 'loading'}
                  className={`${inputClasses} text-gray-500 appearance-none`}
                >
                  <option value="">Select Country</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>UK</option>
                  <option>Germany</option>
                  <option>USA</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Residence</label>
                <input
                  type="text"
                  name="residence"
                  value={formData.residence}
                  onChange={handleChange}
                  placeholder="Country of Residence"
                  disabled={status === 'loading'}
                  className={inputClasses}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="Highest Degree"
                  disabled={status === 'loading'}
                  className={inputClasses}
                />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-2">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Current Job Title"
                  disabled={status === 'loading'}
                  className={inputClasses}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-primary to-blue-700 text-white font-heading font-bold text-lg py-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === 'loading' ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    'Get Free Consultation'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div className="h-32 bg-[#f8f9fa]"></div>
    </>
  );
};

export default HomeHeroWidget;
