import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeGlobe = ({ className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    let animationFrameId;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000814, 0.002);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 250;

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

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Dots (The Earth)
    const particlesGeometry = new THREE.BufferGeometry();
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

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2,
      color: 0x0d5fb7,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const earthParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(earthParticles);

    // Add connecting lines (Flight paths)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });

    function createCurve(p1, p2) {
      const v1 = new THREE.Vector3(p1.x, p1.y, p1.z);
      const v2 = new THREE.Vector3(p2.x, p2.y, p2.z);
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const p = new THREE.Vector3().lerpVectors(v1, v2, i / 20);
        p.normalize().multiplyScalar(radius + 10 * Math.sin(Math.PI * i / 20));
        points.push(p);
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geometry, lineMaterial);
    }

    const linesGeometryArray = [];
    for (let i = 0; i < 30; i++) {
      const idx1 = Math.floor(Math.random() * particlesCount) * 3;
      const idx2 = Math.floor(Math.random() * particlesCount) * 3;
      const p1 = { x: posArray[idx1], y: posArray[idx1 + 1], z: posArray[idx1 + 2] };
      const p2 = { x: posArray[idx2], y: posArray[idx2 + 1], z: posArray[idx2 + 2] };
      const curveLine = createCurve(p1, p2);
      globeGroup.add(curveLine);
      linesGeometryArray.push(curveLine.geometry);
    }

    // Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    };
    
    const onScroll = () => {
      const scrollPercent = window.scrollY / window.innerHeight;
      globeGroup.position.y = scrollPercent * 100;
      globeGroup.scale.setScalar(1 - scrollPercent * 0.5);
      if (mountRef.current) {
        mountRef.current.style.opacity = Math.max(0.2, 1 - scrollPercent * 1.5);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      globeGroup.rotation.y += 0.002;
      targetRotationX = mouseY * 0.5;
      targetRotationY = mouseX * 0.5;
      globeGroup.rotation.x += 0.05 * (targetRotationX - globeGroup.rotation.x);
      globeGroup.rotation.y += 0.05 * (targetRotationY - (globeGroup.rotation.y - (globeGroup.rotation.y % (Math.PI * 2))));
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
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose Three.js resources to prevent memory leaks
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      lineMaterial.dispose();
      linesGeometryArray.forEach(geo => geo.dispose());
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={`fixed top-0 left-0 w-full h-screen z-0 bg-[#000814] ${className}`} />;
};

export default ThreeGlobe;
