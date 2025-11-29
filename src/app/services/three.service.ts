import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class ThreeService implements OnDestroy {
  private scenes = new Map<HTMLElement, THREE.Scene>();

  createScene(container: HTMLElement, type: 'particles' | 'mesh' | 'gltf' = 'particles') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Responsive
    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    camera.position.z = 5;

    // === SCENE TYPES ===
    if (type === 'particles') this.createParticles(scene);
    if (type === 'mesh') this.createMorphMesh(scene);
    // if (type === 'gltf') this.loadGLTF(scene); // placeholder

    // Animate + sync with scroll
    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    this.scenes.set(container, scene);

    // ScrollTrigger control
    gsap.to(scene.rotation, {
      y: Math.PI * 4,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });

    return { scene, camera, renderer };
  }

  private createParticles(scene: THREE.Scene) {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const sizes: number[] = [];

    for (let i = 0; i < 5000; i++) {
      vertices.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      sizes.push(Math.random());
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0x8844ff) } },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = vec3(0.5, 0.3, 1.0);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * 30.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;
          gl_FragColor = vec4(0.8, 0.4, 1.0, 1.0);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
  }

  private createMorphMesh(scene: THREE.Scene) {
    const geometry = new THREE.IcosahedronGeometry(2, 0);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Morph on scroll
    gsap.to(mesh.scale, {
      x: 3, y: 3, z: 3,
      scrollTrigger: {
        // trigger: mesh.parent?.parent,
        scrub: true,
        start: "top center",
        end: "bottom top"
      }
    });
  }

  ngOnDestroy() {
    this.scenes.forEach((scene, container) => {
      container.innerHTML = '';
      scene.clear();
    });
  }
}