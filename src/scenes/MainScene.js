import * as THREE from 'three';
import vertexShader from '@/shaders/vertex.glsl';
import fragmentShader from '@/shaders/fragment.glsl';
import { mouse } from '@/core/mouse.js';

export class MainScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.smoothMouse = new THREE.Vector2(0, 0);
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
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.035);

    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 5);

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
    const geometry = new THREE.SphereGeometry(2.2, 64, 64);
    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDistortion: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: new THREE.Color('#010812') },
        uColorB: { value: new THREE.Color('#0033aa') },
        uColorC: { value: new THREE.Color('#00d4ff') },
        uOpacity: { value: 0.12 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
    this.mainMesh = new THREE.Mesh(geometry, this.shaderMaterial);
    this.scene.add(this.mainMesh);

    this.floatingMeshes = [];
    const floatGeoms = [new THREE.OctahedronGeometry(0.08), new THREE.TetrahedronGeometry(0.06)];
    const floatColors = [0x00d4ff, 0x6633ff, 0xffa040, 0xffffff];
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: floatColors[i % floatColors.length],
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const mesh = new THREE.Mesh(floatGeoms[i % floatGeoms.length], mat);
      const angle = (i / 8) * Math.PI * 2;
      const radius = 3.8 + Math.random() * 1.5;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2.5,
        Math.sin(angle) * radius - 1
      );
      mesh.userData.angle = angle;
      mesh.userData.radius = radius;
      mesh.userData.speed = 0.12 + Math.random() * 0.15;
      mesh.userData.bobSpeed = 0.4 + Math.random() * 0.4;
      mesh.userData.bobOffset = Math.random() * Math.PI * 2;
      this.floatingMeshes.push(mesh);
      this.scene.add(mesh);
    }
  }

  createParticles() {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorOptions = [
      new THREE.Color('#ffe8a0'),
      new THREE.Color('#a8d4ff'),
      new THREE.Color('#ffc060'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#80c8ff'),
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = -4 + Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24 - 2;

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.particles = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.025,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      })
    );
    this.scene.add(this.particles);
  }

  setupLights() {
    this.scene.add(new THREE.AmbientLight(0x050f1c, 1));

    this.light1 = new THREE.PointLight(0x0044cc, 1.5, 10);
    this.light1.position.set(3, 3, 3);
    this.scene.add(this.light1);

    this.light2 = new THREE.PointLight(0x00aaff, 1.0, 10);
    this.light2.position.set(-3, -2, 2);
    this.scene.add(this.light2);

    this.light3 = new THREE.PointLight(0xff8c42, 0.6, 8);
    this.light3.position.set(0, -3, -2);
    this.scene.add(this.light3);
  }

  bindEvents() {
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

    // Smooth mouse — negate Y to match Three.js up-is-positive convention
    this.smoothMouse.x += (mouse.normX - this.smoothMouse.x) * 0.05;
    this.smoothMouse.y += (-mouse.normY - this.smoothMouse.y) * 0.05;

    this.shaderMaterial.uniforms.uTime.value = elapsed;
    this.shaderMaterial.uniforms.uMouse.value.set(
      this.smoothMouse.x * 0.8,
      this.smoothMouse.y * 0.8
    );
    this.shaderMaterial.uniforms.uDistortion.value = 0.5 + Math.sin(elapsed * 0.3) * 0.15;

    this.mainMesh.rotation.y = elapsed * 0.05 + this.smoothMouse.x * 0.1;
    this.mainMesh.rotation.x = Math.sin(elapsed * 0.06) * 0.08 + this.smoothMouse.y * 0.08;

    this.floatingMeshes.forEach((mesh) => {
      const t = elapsed * mesh.userData.speed;
      const angle = mesh.userData.angle + t;
      const r = mesh.userData.radius;
      mesh.position.x = Math.cos(angle) * r;
      mesh.position.z = Math.sin(angle) * r - 2;
      mesh.position.y +=
        Math.sin(elapsed * mesh.userData.bobSpeed + mesh.userData.bobOffset) * 0.002;
      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.015;
    });

    this.light1.intensity = 1.5 + Math.sin(elapsed * 1.5) * 0.5;
    this.light2.intensity = 1.0 + Math.cos(elapsed * 1.0) * 0.4;
    this.light1.position.x = Math.cos(elapsed * 0.5) * 4;
    this.light1.position.z = Math.sin(elapsed * 0.5) * 4;
    this.light2.position.x = Math.cos(elapsed * 0.5 + Math.PI) * 3;
    this.light2.position.z = Math.sin(elapsed * 0.5 + Math.PI) * 3;

    this.particles.rotation.y = elapsed * 0.015;
    this.particles.rotation.z = elapsed * 0.008;

    this.camera.position.x += (this.smoothMouse.x * 0.3 - this.camera.position.x) * 0.025;
    this.camera.position.y += (this.smoothMouse.y * 0.2 - this.camera.position.y) * 0.025;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }
}
