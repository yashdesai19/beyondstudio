import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();

    const fov = 45;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 8.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.className = "hero-3d-canvas";
    container.appendChild(renderer.domElement);

    // 3. Central Sculpture Group (Positioned slightly to the right for editorial balance on desktop)
    const sculptureGroup = new THREE.Group();
    // Default position: on desktop shift slightly right and up so it frames the typography
    const isDesktop = window.innerWidth >= 1024;
    sculptureGroup.position.set(isDesktop ? 1.6 : 0, isDesktop ? 0.3 : -0.2, 0);
    scene.add(sculptureGroup);

    // 3A. Primary Fluid Gold Ribbon (Organic Torus Knot)
    // p=2, q=3 gives the classic trefoil Möbius flowing ribbon aesthetic
    const ribbonGeometry = new THREE.TorusKnotGeometry(1.6, 0.42, 160, 36, 2, 3);
    const ribbonMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#C6A44A"), // Beyond signature champagne gold
      emissive: new THREE.Color("#1a1306"),
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      reflectivity: 0.85,
      wireframe: false,
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    sculptureGroup.add(ribbonMesh);

    // 3B. Celestial Thin Halo Rings (Luxury Jewelry accent)
    const halo1Geometry = new THREE.TorusGeometry(2.7, 0.016, 24, 120);
    const haloMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#E8D49E"),
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: 0.45,
    });
    const halo1Mesh = new THREE.Mesh(halo1Geometry, haloMaterial);
    halo1Mesh.rotation.x = Math.PI / 3;
    halo1Mesh.rotation.y = Math.PI / 6;
    sculptureGroup.add(halo1Mesh);

    const halo2Geometry = new THREE.TorusGeometry(2.3, 0.012, 24, 100);
    const halo2Mesh = new THREE.Mesh(halo2Geometry, haloMaterial);
    halo2Mesh.rotation.x = -Math.PI / 4;
    halo2Mesh.rotation.z = Math.PI / 5;
    sculptureGroup.add(halo2Mesh);

    // 3C. Golden Stardust / Ambient Floating Micro-particles
    const particleCount = isDesktop ? 90 : 45;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random() * 0.04 + 0.015;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color("#f1dc9d"),
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    sculptureGroup.add(particles);

    // 4. Photographic Lighting Rig
    // Ambient light - deep obsidian warmth
    const ambientLight = new THREE.AmbientLight(0x16120c, 1.6);
    scene.add(ambientLight);

    // Main Key Light - Warm champagne gold spotlight from top-right
    const keyLight = new THREE.DirectionalLight(0xffdf8e, 3.4);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    // Fill Rim Light - Deep cool violet/obsidian from lower-left for cinematic contrast
    const rimLight = new THREE.DirectionalLight(0x352b4d, 2.2);
    rimLight.position.set(-6, -4, -2);
    scene.add(rimLight);

    // Cursor Follower Point Light - Gives dynamic interactive sheen to the ribbon
    const cursorLight = new THREE.PointLight(0xffe6a3, 2.8, 12, 1.8);
    cursorLight.position.set(0, 0, 3);
    scene.add(cursorLight);

    // 5. Interaction State & Physics
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollY = 0;
    let isVisible = true;
    let animationFrameId: number;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x;
      targetMouseY = y;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // 6. Resize Handling
    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Responsive positioning
      const desktop = width >= 1024;
      sculptureGroup.position.x = desktop ? 1.6 : 0;
      sculptureGroup.position.y = desktop ? 0.3 : -0.2;
      const scale = desktop ? 1 : Math.max(0.68, width / 768);
      sculptureGroup.scale.set(scale, scale, scale);
    };

    window.addEventListener("resize", onResize);
    onResize();

    // 7. Visibility Observer (Pause rendering when Hero is scrolled out of view)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 8. Animation Loop
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth mouse lerping
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Update interactive light position
      cursorLight.position.x = currentMouseX * 4 + sculptureGroup.position.x;
      cursorLight.position.y = currentMouseY * 4 + sculptureGroup.position.y;

      if (!prefersReducedMotion) {
        // Continuous gentle rotation of the gold ribbon
        ribbonMesh.rotation.x += delta * 0.28;
        ribbonMesh.rotation.y += delta * 0.42;

        // Counter-rotation of halo rings
        halo1Mesh.rotation.z += delta * 0.15;
        halo2Mesh.rotation.z -= delta * 0.12;

        // Particles gentle drift
        particles.rotation.y += delta * 0.08;

        // Floating vertical bobbing
        const floatOffset = Math.sin(currentTime * 0.0012) * 0.12;

        // Parallax tilt from mouse cursor
        const tiltX = currentMouseY * 0.45;
        const tiltY = currentMouseX * 0.55;

        // Scroll influence (gently moves up and tilts as user begins to scroll)
        const scrollOffset = Math.min(scrollY * 0.0018, 1.5);

        const desktop = window.innerWidth >= 1024;
        sculptureGroup.position.y = (desktop ? 0.3 : -0.2) + floatOffset + scrollOffset * 0.6;
        sculptureGroup.position.z = -scrollOffset * 1.2;

        sculptureGroup.rotation.x = tiltX + scrollOffset * 0.4;
        sculptureGroup.rotation.y = tiltY;
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      ribbonGeometry.dispose();
      ribbonMaterial.dispose();
      halo1Geometry.dispose();
      halo2Geometry.dispose();
      haloMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-3d-container"
      aria-hidden="true"
    />
  );
}
