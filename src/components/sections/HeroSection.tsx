import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TweenMax } from 'gsap';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: any;
    let group = new THREE.Group();

    const init = () => {
      createWorld();
      createLights();
      createPrimitive();
      animate();
    };

    const createWorld = () => {
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xd7dddd, 9, 13);
      scene.background = null;

      camera = new THREE.PerspectiveCamera(
        35,
        containerRef.current!.clientWidth / containerRef.current!.clientHeight,
        1,
        1000
      );
      camera.position.set(0, 0, 10);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvasRef.current!,
      });

      renderer.setSize(
        containerRef.current!.clientWidth,
        containerRef.current!.clientHeight
      );
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    };

    const createLights = () => {
      const hemiLight = new THREE.HemisphereLight(0xd7dddd, 0x101010, 1);
      const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.position.set(10, 20, 20);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 5000;
      dirLight.shadow.mapSize.height = 5000;
      (dirLight as any).penumbra = 0.8;

      scene.add(hemiLight);
      scene.add(dirLight);
    };

    class Book {
      mesh: THREE.Object3D;

      constructor() {
        this.mesh = new THREE.Object3D();

        const geo_cover = new THREE.BoxGeometry(2.4, 3, 0.05);
        const lmo_cover = new THREE.BoxGeometry(0.05, 3, 0.59);
        const ppr_cover = new THREE.BoxGeometry(2.3, 2.8, 0.5);

        const mat = new THREE.MeshPhongMaterial({ color: 0x475b47 });
        const mat_paper = new THREE.MeshPhongMaterial({ color: 0xffffff });

        const cover1 = new THREE.Mesh(geo_cover, mat);
        const cover2 = new THREE.Mesh(geo_cover, mat);
        const lomo = new THREE.Mesh(lmo_cover, mat);
        const paper = new THREE.Mesh(ppr_cover, mat_paper);

        [cover1, cover2, lomo, paper].forEach((mesh) => {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        });

        cover1.position.z = 0.3;
        cover2.position.z = -0.3;
        lomo.position.x = 2.4 / 2;

        this.mesh.add(cover1, cover2, lomo, paper);
      }
    }

    const isTooClose = (newObj: THREE.Object3D, others: THREE.Object3D[], minDistance = 1.5) => {
      const newPos = newObj.position;
      for (let existing of others) {
        const dx = newPos.x - existing.position.x;
        const dy = newPos.y - existing.position.y;
        const dz = newPos.z - existing.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < minDistance) return true;
      }
      return false;
    };

    const createPrimitive = () => {
      const placedBooks: THREE.Object3D[] = [];
      const a = 2;

      for (let i = 0; i < 12; i++) {
        const book = new Book();
        const s = 0.1 + Math.random() * 0.4;
        book.mesh.scale.set(s, s, s);

        let tries = 0;
        do {
          book.mesh.position.x = (Math.random() - 0.5) * a * 2;
          book.mesh.position.y = (Math.random() - 0.5) * a * 2;
          book.mesh.position.z = (Math.random() - 0.5) * a * 2;
          tries++;
        } while (isTooClose(book.mesh, placedBooks) && tries < 20);

        book.mesh.rotation.x = Math.random() * 2 * Math.PI;
        book.mesh.rotation.y = Math.random() * 2 * Math.PI;
        book.mesh.rotation.z = Math.random() * 2 * Math.PI;

        TweenMax.to(book.mesh.rotation, 8 + Math.random() * 8, {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.5,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
          delay: 0.05 * i,
        });

        group.add(book.mesh);
        placedBooks.push(book.mesh);
      }

      scene.add(group);
      group.position.x = 2;
    };

    const animate = () => {
      group.rotation.x -= 0.003;
      group.rotation.y -= 0.003;
      group.rotation.z -= 0.003;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const heroCard = e.currentTarget as HTMLElement;
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xNorm = (x / rect.width - 0.5) * 2;
      const yNorm = (y / rect.height - 0.5) * 2;
      document.documentElement.style.setProperty("--x", String(xNorm));
      document.documentElement.style.setProperty("--y", String(yNorm));
    };

    const resetPosition = () => {
      document.documentElement.style.setProperty("--x", "0");
      document.documentElement.style.setProperty("--y", "0");
    };
    
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    init();
    window.addEventListener('resize', handleResize);
    
    const heroCard = document.querySelector('.hero-card');
    heroCard?.addEventListener("mousemove", handleMouseMove as any);
    heroCard?.addEventListener("mouseleave", resetPosition);
    
    return () => {
      heroCard?.removeEventListener("mousemove", handleMouseMove as any);
      heroCard?.removeEventListener("mouseleave", resetPosition);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-24 md:pt-32 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container px-4 max-w-[1200px] mx-auto">
        <article className="hero-card">
          <div ref={containerRef} id="canvas-container" className="absolute inset-0 z-0">
            <canvas ref={canvasRef} />
          </div>
          <div className="hero-assets">
            <h3 className="hero-title">ECHOVERSE</h3>
            <img 
              src="robot.png"
              alt="Floating Icon"
              className="foreground transition-transform duration-300"
              style={{ width: "800px", height: "675px" }}
            />
          </div>
          <div className="hero-content">
            <p className="text-3xl md:text-4xl lg:text-5xl font-bold">AI-Powered Learning Hub</p>
            <p className="text-lg md:text-xl lg:text-2xl opacity-100">Transform Your Learning Journey</p>
          </div>
        </article>
      </div>
    </section>
  );
}