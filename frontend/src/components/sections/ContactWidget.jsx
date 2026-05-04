import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ContactWidget = ({
  heading = 'Connect Across',
  headingHighlight = 'Borders.',
  subtitle = 'Visualize your journey. Our team is ready to guide you from any point on the map to your dream destination.',
  phone = '+971 50 752 6626',
  email = 'info@immihire.com',
  location = 'Dubai, UAE'
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  const globeContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const rendererRef = useRef(null);
  const cleanupRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  // Reveal Animation
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

  // Three.js Globe
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;

    script.onload = () => {
      if (!window.THREE || !globeContainerRef.current) return;
      const THREE = window.THREE;
      const container = globeContainerRef.current;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000814, 0.002);

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 250;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      rendererRef.current = renderer;
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      const particlesCount = 2000;
      const posArray = new Float32Array(particlesCount * 3);
      const radius = 120;

      for (let i = 0; i < particlesCount * 3; i += 3) {
        const phi = Math.acos(-1 + (2 * (i / 3)) / particlesCount);
        const theta = Math.sqrt(particlesCount * Math.PI) * phi;
        posArray[i] = radius * Math.cos(theta) * Math.sin(phi);
        posArray[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
        posArray[i + 2] = radius * Math.cos(phi);
      }

      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
        size: 2, color: 0x0d5fb7, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
      });
      globeGroup.add(new THREE.Points(particlesGeometry, particlesMaterial));

      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
      const createCurve = (p1, p2) => {
        const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
        const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);
        const points = [];
        for (let j = 0; j <= 20; j++) {
          const p = new THREE.Vector3().lerpVectors(v1, v2, j / 20);
          p.normalize().multiplyScalar(radius + 10 * Math.sin(Math.PI * j / 20));
          points.push(p);
        }
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial);
      };

      for (let i = 0; i < 30; i++) {
        const idx1 = Math.floor(Math.random() * particlesCount) * 3;
        const idx2 = Math.floor(Math.random() * particlesCount) * 3;
        globeGroup.add(createCurve(
          { x: posArray[idx1], y: posArray[idx1 + 1], z: posArray[idx1 + 2] },
          { x: posArray[idx2], y: posArray[idx2 + 1], z: posArray[idx2 + 2] }
        ));
      }

      let mouseX = 0, mouseY = 0;
      const handleMouseMove = (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
      };
      document.addEventListener('mousemove', handleMouseMove);

      const handleScroll = () => {
        const scrollPercent = window.scrollY / window.innerHeight;
        globeGroup.position.y = scrollPercent * 100;
        globeGroup.scale.setScalar(1 - scrollPercent * 0.5);
        if (container) container.style.opacity = Math.max(0.2, 1 - scrollPercent * 1.5);
      };
      window.addEventListener('scroll', handleScroll);

      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate);
        globeGroup.rotation.y += 0.002;
        const targetRotationX = mouseY * 0.5;
        const targetRotationY = mouseX * 0.5;
        globeGroup.rotation.x += 0.05 * (targetRotationX - globeGroup.rotation.x);
        globeGroup.rotation.y += 0.05 * (targetRotationY - (globeGroup.rotation.y - (globeGroup.rotation.y % (Math.PI * 2))));
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      cleanupRef.current = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      };
    };

    document.body.appendChild(script);

    return () => {
      if (cleanupRef.current) cleanupRef.current();
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <style>{`
        .contact-globe-container { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0; background: #000814; }
        .plane-btn { overflow: hidden; transition: all 0.3s ease; }
        .plane-btn.flying .btn-text { opacity: 0; }
        .plane-btn.flying .fa-paper-plane { animation: flyAway 1s ease-in-out forwards; }
        @keyframes flyAway {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          20% { transform: translate(-20px, 20px) rotate(-10deg) scale(0.9); opacity: 1; }
          40% { transform: translate(20px, -20px) rotate(10deg) scale(0.9); opacity: 1; }
          100% { transform: translate(500px, -500px) rotate(45deg) scale(0); opacity: 0; }
        }
        .contact-input { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; width: 100%; transition: all 0.3s ease; }
        .contact-input:focus { background: white; border-color: #0d5fb7; box-shadow: 0 0 0 4px rgba(13, 95, 183, 0.1); outline: none; }
        .reveal { opacity: 0; transform: translateY(30px); filter: blur(5px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); filter: blur(0); }
      `}</style>

      {/* 3D Background Canvas */}
      <div className="contact-globe-container" ref={globeContainerRef}></div>

      {/* Hero Overlay */}
      <section className="relative min-h-screen flex items-center justify-center text-white pointer-events-none pt-24">
        <div className="container mx-auto px-6 relative z-10 text-center pointer-events-auto">
          <div className="inline-block px-4 py-1 rounded-full border border-blue-500/50 bg-blue-900/30 text-blue-400 font-mono text-xs uppercase tracking-[0.2em] mb-6 reveal active backdrop-blur-sm">
            ● Live Global Network
          </div>
          <h1 className="font-heading font-bold text-5xl md:text-8xl mb-8 leading-tight reveal active delay-100 drop-shadow-[0_0_15px_rgba(13,95,183,0.5)]">
            {heading} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-400">{headingHighlight}</span>
          </h1>
          <p className="text-blue-100/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto reveal active delay-200 leading-relaxed font-light">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center reveal active delay-300">
            <a href="#contact-form" className="px-10 py-5 bg-white text-darkBlue font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Start a Conversation
            </a>
            <a href="#offices" className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm">
              Locate Offices
            </a>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#f8f9fa] to-transparent z-0"></div>
      </section>

      {/* Form Section */}
      <section id="contact-form" className="py-24 bg-gray-50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row -mt-20">

            {/* Info Side */}
            <div className="lg:w-1/3 bg-darkBlue p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-2xl mb-6">Contact Information</h3>
                <p className="text-blue-200 mb-12 text-sm leading-relaxed">Fill up the form and our Team will get back to you within 24 hours.</p>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="font-bold text-lg">{phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold text-lg">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-primary">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <p className="text-xs text-blue-300 uppercase tracking-widest mb-1">Location</p>
                      <p className="font-bold text-lg">{location}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-16 flex gap-4">
                  <a href="#" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
                  <a href="#" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-instagram"></i></a>
                  <a href="#" className="w-8 h-8 rounded bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="lg:w-2/3 p-12 lg:p-16">
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="contact-input" placeholder="John" required disabled={status === 'loading'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="contact-input" placeholder="Doe" required disabled={status === 'loading'} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="contact-input" placeholder="john@example.com" required disabled={status === 'loading'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="contact-input" placeholder="+971..." disabled={status === 'loading'} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="contact-input" placeholder="Write your message..." required disabled={status === 'loading'}></textarea>
                </div>

                <div className="flex justify-end relative">
                  <button type="submit" disabled={status === 'loading'} className={`plane-btn bg-primary text-white font-bold rounded-xl px-10 py-4 shadow-lg hover:shadow-primary/40 transition-all flex items-center gap-3 ${status === 'loading' || status === 'success' ? 'flying' : ''}`}>
                    <span className="btn-text">{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                    <i className="fa-solid fa-paper-plane text-lg transition-transform"></i>
                  </button>
                  <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 text-green-600 font-bold transition-opacity duration-300 pointer-events-none ${status === 'success' ? 'opacity-100' : 'opacity-0'}`}>
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

export default ContactWidget;
