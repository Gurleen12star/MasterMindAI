import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TweenMax } from 'gsap';

export default function HeroSection() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    const Theme = {
      primary: 0xd7dddd,
      darker: 0x101010
    };

    function createWorld() {
      const container = canvasContainerRef.current;
      if (!container) return;

      const width = window.innerWidth;
      const height = container.clientHeight;

      sceneRef.current = new THREE.Scene();
      sceneRef.current.fog = new THREE.Fog(Theme.primary, 9, 13);
      sceneRef.current.background = null;

      cameraRef.current = new THREE.PerspectiveCamera(35, width / height, 1, 1000);
      cameraRef.current.position.set(0, 0, 10);

      rendererRef.current = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
      });
      rendererRef.current.setSize(width, height);
      rendererRef.current.shadowMap.enabled = true;
      rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;

      container.appendChild(rendererRef.current.domElement);
    }

    function createLights() {
      if (!sceneRef.current) return;

      const hemiLight = new THREE.HemisphereLight(Theme.primary, Theme.darker, 1);
      const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1);
      dirLight.position.set(10, 20, 20);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 5000;
      dirLight.shadow.mapSize.height = 5000;

      sceneRef.current.add(hemiLight);
      sceneRef.current.add(dirLight);
    }

    function CreateBook() {
      const mesh = new THREE.Object3D();
      const geo_cover = new THREE.BoxGeometry(2.4, 3, 0.05);
      const lmo_cover = new THREE.BoxGeometry(0.05, 3, 0.59);
      const ppr_cover = new THREE.BoxGeometry(2.3, 2.8, 0.5);

      const mat = new THREE.MeshPhongMaterial({ 
        color: 0x475b47,
        transparent: true,
        opacity: 0.8
      });
      const mat_paper = new THREE.MeshPhongMaterial({ 
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.6
      });

      const cover1 = new THREE.Mesh(geo_cover, mat);
      const cover2 = new THREE.Mesh(geo_cover, mat);
      const lomo = new THREE.Mesh(lmo_cover, mat);
      const paper = new THREE.Mesh(ppr_cover, mat_paper);

      [cover1, cover2, lomo, paper].forEach(m => {
        m.castShadow = true;
        m.receiveShadow = true;
      });

      cover1.position.z = 0.3;
      cover2.position.z = -0.3;
      lomo.position.x = 2.4 / 2;

      mesh.add(cover1, cover2, lomo, paper);
      return mesh;
    }

    function createBooks() {
      if (!sceneRef.current) return;

      const placedBooks = [];
      const area = 2;

      for (let i = 0; i < 12; i++) {
        const book = CreateBook();
        const scale = 0.1 + Math.random() * 0.4;
        book.scale.set(scale, scale, scale);

        let tries = 0;
        do {
          book.position.x = (Math.random() - 0.5) * area * 2;
          book.position.y = (Math.random() - 0.5) * area * 2;
          book.position.z = (Math.random() - 0.5) * area * 2;
          tries++;
        } while (tries < 20);

        book.rotation.x = Math.random() * 2 * Math.PI;
        book.rotation.y = Math.random() * 2 * Math.PI;
        book.rotation.z = Math.random() * 2 * Math.PI;

        TweenMax.to(book.rotation, 8 + Math.random() * 8, {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.5,
          yoyo: true,
          repeat: -1,
          ease: "none",
          delay: 0.05 * i
        });

        groupRef.current.add(book);
        placedBooks.push(book);
      }

      groupRef.current.position.x = 2;
      sceneRef.current.add(groupRef.current);
    }

    function animate() {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      groupRef.current.rotation.x -= 0.003;
      groupRef.current.rotation.y -= 0.003;
      groupRef.current.rotation.z -= 0.003;

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    }

    function handleResize() {
      if (!cameraRef.current || !rendererRef.current || !canvasContainerRef.current) return;

      const width = window.innerWidth;
      const height = canvasContainerRef.current.clientHeight;

      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    }

    // Initialize scene
    createWorld();
    createLights();
    createBooks();
    animate();
    setIsLoaded(true);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(rendererRef.current.domElement);
      }

      // Clean up Three.js resources
      sceneRef.current?.dispose();
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 min-h-screen">
      <div 
        ref={canvasContainerRef} 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#628f84] via-[#768ca8] to-[#e4eeef]"
        style={{ 
          height: '100vh',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 pointer-events-none" />
      <div className="container px-4 max-w-[1200px] mx-auto">
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            ECHOVERSE
          </h1>
          <div className="space-y-4">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">AI-Powered Learning Hub</p>
            <p className="text-lg md:text-xl lg:text-2xl opacity-100">Transform Your Learning Journey</p>
          </div>
        </div>
      </div>
    </section>
  );
}