import * as THREE from 'three';

export interface SceneContext {
  onProgress: (p: number, stageIndex: number) => void;
}

export function init3DScene(canvas: HTMLCanvasElement, ctx: SceneContext) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  // Alaa's exact deep plum fog: #110616
  scene.fog = new THREE.FogExp2(0x110616, 0.018);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 400);
  camera.position.set(0, 0, 10);

  // -------------------------------------------------------------
  // Alaa's Royal Lavender & Plum Lighting
  // -------------------------------------------------------------
  // Ambient royal purple
  const ambientLight = new THREE.AmbientLight(0x4a356b, 1.8);
  scene.add(ambientLight);

  // Main lavender glow spotlight
  const lavenderSpot = new THREE.SpotLight(0x9068d1, 5, 80, Math.PI / 3, 0.6, 1.2);
  lavenderSpot.position.set(8, 16, 10);
  scene.add(lavenderSpot);

  // Deep plum backfill light
  const plumLight = new THREE.PointLight(0x8862c6, 3, 50);
  plumLight.position.set(-8, -6, -15);
  scene.add(plumLight);

  const centerWarmGlow = new THREE.PointLight(0x9068d1, 2.5, 35);
  centerWarmGlow.position.set(0, 2, -25);
  scene.add(centerWarmGlow);

  // -------------------------------------------------------------
  // Subtle Ethereal Lavender Stardust Particles
  // -------------------------------------------------------------
  const particleCount = 280;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colorLav = new THREE.Color(0x9068d1);
  const colorSoft = new THREE.Color(0xc8b3ec);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePos[i3] = (Math.random() - 0.5) * 45;
    particlePos[i3 + 1] = (Math.random() - 0.5) * 30;
    particlePos[i3 + 2] = -Math.random() * 160 + 10;

    const c = Math.random() > 0.5 ? colorLav : colorSoft;
    particleColors[i3] = c.r;
    particleColors[i3 + 1] = c.g;
    particleColors[i3 + 2] = c.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // -------------------------------------------------------------
  // Scroll Controller
  // -------------------------------------------------------------
  let targetProgress = 0;
  let currentProgress = 0;

  function updateProgress() {
    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    targetProgress = Math.min(1, Math.max(0, window.scrollY / scrollMax));
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onWindowResize);

  function animate() {
    requestAnimationFrame(animate);

    // Smooth scroll camera lerp
    currentProgress += (targetProgress - currentProgress) * 0.08;

    const targetZ = 10 - currentProgress * 110;
    camera.position.z += (targetZ - camera.position.z) * 0.1;
    camera.position.y = Math.sin(currentProgress * Math.PI) * 0.35;
    camera.position.x = Math.sin(currentProgress * Math.PI * 2) * 0.5;
    camera.lookAt(0, 0, camera.position.z - 20);

    // Gentle particle floating
    particles.rotation.y += 0.0006;
    particles.rotation.x = Math.sin(currentProgress * Math.PI) * 0.1;

    let stageIndex = 0;
    if (currentProgress < 0.20) stageIndex = 0;
    else if (currentProgress < 0.45) stageIndex = 1;
    else if (currentProgress < 0.80) stageIndex = 2;
    else stageIndex = 3;

    ctx.onProgress(currentProgress, stageIndex);

    renderer.render(scene, camera);
  }

  animate();

  return {
    scrollToStage: (stageRatio: number) => {
      const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      window.scrollTo({
        top: stageRatio * scrollMax,
        behavior: 'smooth',
      });
    },
    destroy: () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', onWindowResize);
      renderer.dispose();
    },
  };
}
