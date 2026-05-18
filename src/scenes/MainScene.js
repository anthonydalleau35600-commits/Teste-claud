import * as THREE from 'three';
import vertexShader from '@/shaders/vertex.glsl';
import fragmentShader from '@/shaders/fragment.glsl';

export class MainScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.clock = new THREE.Clock();
    this.animationId = null;

    this.init();
    this.createObjects();
    this.createParticles();
    this.setupLights();
    this.bindEvents();
    this.animate();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.035);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  createObjects() {
    // Main shader sphere
    const geometry = new THREE.SphereGeometry(1.8, 128, 128);

    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDistortion: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: new THREE.Color('#0a0a1a') },
        uColorB: { value: new THREE.Color('#7b2fff') },
        uColorC: { value: new THREE.Color('#00ffcc') },
        uOpacity: { value: 0.95 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.mainMesh = new THREE.Mesh(geometry, this.shaderMaterial);
    this.scene.add(this.mainMesh);

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7b2fff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireMesh = new THREE.Mesh(new THREE.SphereGeometry(1.82, 32, 32), wireMat);
    this.scene.add(wireMesh);
    this.wireMesh = wireMesh;

    // Outer glow ring
    const ringGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 120);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.5,
    });
    this.ring1 = new THREE.Mesh(ringGeo, ringMat);
    this.ring1.rotation.x = Math.PI / 2;
    this.scene.add(this.ring1);

    // Second ring - tilted
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xff2fff,
      transparent: true,
      opacity: 0.3,
    });
    this.ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.02, 16, 120), ring2Mat);
    this.ring2.rotation.x = Math.PI / 4;
    this.ring2.rotation.y = Math.PI / 6;
    this.scene.add(this.ring2);

    // Floating geometry pieces
    this.floatingMeshes = [];
    const floatGeoms = [
      new THREE.OctahedronGeometry(0.15),
      new THREE.TetrahedronGeometry(0.12),
      new THREE.IcosahedronGeometry(0.1),
    ];
    const floatMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });

    for (let i = 0; i < 12; i++) {
      const mesh = new THREE.Mesh(
        floatGeoms[i % floatGeoms.length],
        floatMat.clone()
      );
      const angle = (i / 12) * Math.PI * 2;
      const radius = 3.2 + Math.random() * 1.0;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius - 2
      );
      mesh.userData.angle = angle;
      mesh.userData.radius = radius;
      mesh.userData.speed = 0.2 + Math.random() * 0.3;
      mesh.userData.bobSpeed = 0.5 + Math.random() * 0.5;
      mesh.userData.bobOffset = Math.random() * Math.PI * 2;
      this.floatingMeshes.push(mesh);
      this.scene.add(mesh);
    }
  }

  createParticles() {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const colorOptions = [
      new THREE.Color('#7b2fff'),
      new THREE.Color('#00ffcc'),
      new THREE.Color('#ff2fff'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 6;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi) - 2;

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x111111, 1);
    this.scene.add(ambientLight);

    // Point lights for neon effect
    const light1 = new THREE.PointLight(0x7b2fff, 3, 10);
    light1.position.set(3, 3, 3);
    this.scene.add(light1);
    this.light1 = light1;

    const light2 = new THREE.PointLight(0x00ffcc, 2, 10);
    light2.position.set(-3, -2, 2);
    this.scene.add(light2);
    this.light2 = light2;

    const light3 = new THREE.PointLight(0xff2fff, 1.5, 8);
    light3.position.set(0, -3, -2);
    this.scene.add(light3);
    this.light3 = light3;
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / this.width - 0.5) * 2;
      this.targetMouse.y = -(e.clientY / this.height - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Update shader uniforms
    this.shaderMaterial.uniforms.uTime.value = elapsed;
    this.shaderMaterial.uniforms.uMouse.value.set(
      this.mouse.x * 1.5,
      this.mouse.y * 1.5
    );
    this.shaderMaterial.uniforms.uDistortion.value = 0.8 + Math.sin(elapsed * 0.5) * 0.2;

    // Rotate main mesh with mouse influence
    this.mainMesh.rotation.y = elapsed * 0.15 + this.mouse.x * 0.3;
    this.mainMesh.rotation.x = Math.sin(elapsed * 0.1) * 0.2 + this.mouse.y * 0.2;

    // Wireframe rotation
    this.wireMesh.rotation.y = elapsed * 0.1;
    this.wireMesh.rotation.x = elapsed * 0.08;

    // Ring animations
    this.ring1.rotation.z = elapsed * 0.3;
    this.ring2.rotation.z = -elapsed * 0.2;
    this.ring2.rotation.y = elapsed * 0.15;

    // Floating meshes orbit
    this.floatingMeshes.forEach((mesh) => {
      const t = elapsed * mesh.userData.speed;
      const angle = mesh.userData.angle + t;
      const r = mesh.userData.radius;
      mesh.position.x = Math.cos(angle) * r;
      mesh.position.z = Math.sin(angle) * r - 2;
      mesh.position.y += Math.sin(elapsed * mesh.userData.bobSpeed + mesh.userData.bobOffset) * 0.002;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.015;
    });

    // Pulsing lights
    this.light1.intensity = 3 + Math.sin(elapsed * 2.0) * 1.0;
    this.light2.intensity = 2 + Math.cos(elapsed * 1.5) * 0.8;

    // Orbit lights
    this.light1.position.x = Math.cos(elapsed * 0.5) * 4;
    this.light1.position.z = Math.sin(elapsed * 0.5) * 4;
    this.light2.position.x = Math.cos(elapsed * 0.5 + Math.PI) * 3;
    this.light2.position.z = Math.sin(elapsed * 0.5 + Math.PI) * 3;

    // Particle drift
    this.particles.rotation.y = elapsed * 0.04;
    this.particles.rotation.x = Math.sin(elapsed * 0.02) * 0.1;

    // Camera subtle movement following mouse
    this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.03;
    this.camera.position.y += (this.mouse.y * 0.3 - this.camera.position.y) * 0.03;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
  }
}
