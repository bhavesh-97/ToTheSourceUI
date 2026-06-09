import { Component, ElementRef, Input, AfterViewInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';

@Component({
  selector: 'app-animated-bg',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="three-bg" #container></div>`,
  styles: [`
    :host { display: block; position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
    .three-bg { width: 100%; height: 100%; }
    :host ::ng-deep canvas { display: block; width: 100% !important; height: 100% !important; }
  `]
})
export class AnimatedBgComponent implements AfterViewInit, OnDestroy {
  @Input() variant: 'hero' | 'section' = 'hero';
  @Input() color1 = '#00c896';
  @Input() color2 = '#00a3d4';
  @Input() color3 = '#6366f1';

  private el = inject(ElementRef);
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId = 0;
  private mouseX = 0;
  private mouseY = 0;

  private particles!: THREE.Points;
  private torusKnot!: THREE.Mesh;
  private secondaryMesh!: THREE.Mesh;
  private particlePositions!: Float32Array;
  private particleVelocities!: Float32Array;
  private clock = new THREE.Clock();

  ngAfterViewInit() {
    this.initScene();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
    this.scene?.clear();
  }

  @HostListener('window:resize')
  onResize() {
    if (!this.camera || !this.renderer) return;
    const container = this.el.nativeElement.querySelector('.three-bg') as HTMLElement;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private initScene() {
    const container = this.el.nativeElement.querySelector('.three-bg') as HTMLElement;
    const w = container.clientWidth;
    const h = container.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.z = this.variant === 'hero' ? 8 : 12;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    const c1 = new THREE.Color(this.color1);
    const c2 = new THREE.Color(this.color2);
    const c3 = new THREE.Color(this.color3);

    // ── Particle field ──
    const particleCount = this.variant === 'hero' ? 2000 : 800;
    const geometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(particleCount * 3);
    this.particleVelocities = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);

    const spread = this.variant === 'hero' ? 12 : 8;

    for (let i = 0; i < particleCount; i++) {
      this.particlePositions[i * 3] = (Math.random() - 0.5) * spread;
      this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * spread;
      this.particleVelocities[i * 3] = (Math.random() - 0.5) * 0.005;
      this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
      particleSizes[i] = Math.random() * 3 + 0.5;

      const color = c1.clone().lerp(c2, Math.random()).lerp(c3, Math.random() * 0.3);
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: this.variant === 'hero' ? 0.8 : 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, particleMaterial);
    this.scene.add(this.particles);

    // ── Torus Knot ──
    const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 16);
    const knotMat = new THREE.MeshBasicMaterial({
      color: c1,
      wireframe: true,
      transparent: true,
      opacity: this.variant === 'hero' ? 0.15 : 0.08,
    });
    this.torusKnot = new THREE.Mesh(knotGeo, knotMat);
    this.torusKnot.position.x = this.variant === 'hero' ? -1.5 : 0;
    this.torusKnot.position.y = this.variant === 'hero' ? 0.5 : 0;
    this.scene.add(this.torusKnot);

    // ── Secondary shape ──
    const icoGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: c2,
      wireframe: true,
      transparent: true,
      opacity: this.variant === 'hero' ? 0.1 : 0.05,
    });
    this.secondaryMesh = new THREE.Mesh(icoGeo, icoMat);
    this.secondaryMesh.position.x = this.variant === 'hero' ? 2 : 0;
    this.secondaryMesh.position.y = this.variant === 'hero' ? -0.8 : 0;
    this.scene.add(this.secondaryMesh);

    // ── Ambient lights for depth ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    const elapsed = this.clock.getElapsedTime();

    // Animate particles
    const positions = this.particles.geometry.attributes['position'] as THREE.BufferAttribute;
    const posArray = positions.array as Float32Array;
    const spread = this.variant === 'hero' ? 12 : 8;

    for (let i = 0; i < posArray.length / 3; i++) {
      posArray[i * 3] += this.particleVelocities[i * 3];
      posArray[i * 3 + 1] += this.particleVelocities[i * 3 + 1];
      posArray[i * 3 + 2] += this.particleVelocities[i * 3 + 2];

      // Wrap around edges
      if (Math.abs(posArray[i * 3]) > spread / 2) this.particleVelocities[i * 3] *= -1;
      if (Math.abs(posArray[i * 3 + 1]) > spread / 2) this.particleVelocities[i * 3 + 1] *= -1;
      if (Math.abs(posArray[i * 3 + 2]) > spread / 2) this.particleVelocities[i * 3 + 2] *= -1;
    }
    positions.needsUpdate = true;

    // Gentle overall rotation
    this.particles.rotation.y = elapsed * 0.02;
    this.particles.rotation.x = Math.sin(elapsed * 0.01) * 0.1;

    // Animate torus knot
    this.torusKnot.rotation.x = elapsed * 0.15;
    this.torusKnot.rotation.y = elapsed * 0.2;
    this.torusKnot.position.y = Math.sin(elapsed * 0.3) * 0.3;

    // Animate secondary mesh
    this.secondaryMesh.rotation.x = elapsed * 0.1;
    this.secondaryMesh.rotation.z = elapsed * 0.15;
    this.secondaryMesh.position.y = Math.cos(elapsed * 0.2) * 0.4;

    // Mouse parallax on scene group
    const group = this.scene;
    group.rotation.x += (this.mouseY * 0.05 - group.rotation.x) * 0.03;
    group.rotation.y += (this.mouseX * 0.05 - group.rotation.y) * 0.03;

    this.renderer.render(this.scene, this.camera);
  }

  updateMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }
}
