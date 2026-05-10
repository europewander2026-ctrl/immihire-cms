import React, { useState } from 'react';

const ContactFormSection = ({ title, description, phone, email, location, facebook, instagram, linkedin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    // Map IDs to state keys
    const keyMap = {
      'contact-fname': 'firstName',
      'contact-lname': 'lastName',
      'contact-email': 'email',
      'contact-phone': 'phone',
      'contact-message': 'message'
    };
    if (keyMap[id]) {
      setFormData({ ...formData, [keyMap[id]]: value });
    }
  };

  const handleContactForm = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setIsSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <style>{`
        /* Contact Form Inputs */
        .contact-input {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1rem;
            width: 100%;
            transition: all 0.3s ease;
        }

        .contact-input:focus {
            background: white;
            border-color: #0d5fb7;
            box-shadow: 0 0 0 4px rgba(13, 95, 183, 0.1);
            outline: none;
        }

        .plane-btn {
            overflow: hidden;
            transition: all 0.3s ease;
            position: relative;
        }

        .plane-btn.flying .btn-text {
            opacity: 0;
        }

        @keyframes flyAway {
            0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
            20% { transform: translate(-20px, 20px) rotate(-10deg) scale(0.9); opacity: 1; }
            40% { transform: translate(20px, -20px) rotate(10deg) scale(0.9); opacity: 1; }
            100% { transform: translate(500px, -500px) rotate(45deg) scale(0); opacity: 0; }
        }

        .plane-btn.flying .fa-paper-plane {
            animation: flyAway 1s ease-in-out forwards;
        }
      `}</style>

      <section id="form" className="py-24 bg-gray-50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row -mt-20">

            {/* Info Side */}
            <div className="lg:w-1/3 bg-darkBlue p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl mb-6">{title || 'Contact Information'}</h3>
                <p className="text-blue-200 mb-12 text-sm leading-relaxed">{description || 'Fill up the form and our Team will get back to you within 24 hours.'}</p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="font-bold text-lg">{phone || '+971 50 752 6626'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold text-lg">{email || 'info@immihire.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Location</p>
                      <p className="font-bold text-lg">{location || 'Dubai, UAE'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex gap-4">
                  <a href={facebook || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href={instagram || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-instagram"></i></a>
                  <a href={linkedin || '#'} target="_blank" rel="noreferrer" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:w-2/3 p-12 lg:p-16">
              <form className="space-y-8" onSubmit={handleContactForm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                    <input type="text" id="contact-fname" className="contact-input" placeholder="John" required value={formData.firstName} onChange={handleInputChange} />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                    <input type="text" id="contact-lname" className="contact-input" placeholder="Doe" required value={formData.lastName} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                    <input type="email" id="contact-email" className="contact-input" placeholder="john@example.com" required value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone</label>
                    <input type="tel" id="contact-phone" className="contact-input" placeholder="+971..." value={formData.phone} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                  <textarea id="contact-message" rows="4" className="contact-input" placeholder="Write your message..." value={formData.message} onChange={handleInputChange}></textarea>
                </div>

                <div className="flex justify-end relative">
                  <button id="send-btn" type="submit" disabled={isSending} className={`plane-btn bg-primary text-white font-bold rounded-xl px-10 py-4 shadow-lg hover:shadow-primary/40 transition-all flex items-center gap-3 ${isSending ? 'flying disabled:opacity-70' : ''}`}>
                    <span className="btn-text">{isSending ? 'Sending...' : 'Send Message'}</span>
                    <i className="fa-solid fa-paper-plane text-lg transition-transform"></i>
                  </button>
                  <div id="success-msg" className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-green-600 font-bold transition-opacity pointer-events-none ${isSuccess ? 'opacity-100' : 'opacity-0'}`}>
                    <i className="fa-solid fa-check-circle mr-2"></i> Message Sent!
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default ContactFormSection;
