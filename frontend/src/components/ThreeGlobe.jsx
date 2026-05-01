import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeGlobe = ({ className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 15;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const initRenderer = () => {
      const container = mountRef.current;
      if (!container) return;
      
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    initRenderer();

    // Create Particle Globe
    const geometry = new THREE.SphereGeometry(10, 64, 64);
    
    // Use PointsMaterial for particles
    const material = new THREE.PointsMaterial({
      size: 0.1,
      color: 0x0d5fb7, // primary blue color from Tailwind config typically
      transparent: true,
      opacity: 0.8,
    });
    
    // We can just render the vertices of the sphere as particles
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Rotate the globe
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose Three.js resources to prevent memory leaks
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`w-full h-full min-h-[400px] ${className}`} />;
};

export default ThreeGlobe;
