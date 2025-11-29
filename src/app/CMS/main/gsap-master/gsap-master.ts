import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

interface Animation {
  id: number;
  name: string;
  selector: string;
  type: 'fade-up' | 'fade-down' | 'scale' | 'rotate' | 'text-split' | 'parallax' | 'stagger' | 'pin' | 'scrub' | 'morph' | 'draw-svg' | '3d-rotate' | '3d-float';
  duration: number;
  ease: string;
  active: boolean;
  order: number;
}
@Component({
  selector: 'app-gsap-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    DrawerModule,
    // DialogModule,
    TableModule,
    CardModule,
    TagModule
  ],
  templateUrl: './gsap-master.html',
  styleUrl: './gsap-master.css'
})
export class GsapMaster implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeCanvas') threeCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('preview') preview!: ElementRef;

  animations: Animation[] = [];
  filteredAnimations: Animation[] = [];
  searchTerm = '';
  darkMode = false;
  threeScene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  cube!: THREE.Mesh;

  ngOnInit() {
    this.loadAnimations();
    this.filteredAnimations = [...this.animations];
    this.setupThreeJS();
    this.refreshPreview();
  }

  ngAfterViewInit() {
    this.initDragAndDrop();
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    this.renderer?.dispose();
  }

  loadAnimations() {
    this.animations = [
      { id: 1, name: "Hero Title", selector: ".hero-title", type: "text-split", duration: 1.8, ease: "back.out(1.7)", active: true, order: 0 },
      { id: 2, name: "3D Cube Float", selector: "#three-canvas", type: "3d-float", duration: 4, ease: "power2.inOut", active: true, order: 1 },
      { id: 3, name: "Feature Cards", selector: ".feature-card", type: "stagger", duration: 1.2, ease: "power3.out", active: true, order: 2 },
      { id: 4, name: "Parallax Image", selector: ".parallax-img", type: "parallax", duration: 1, ease: "none", active: true, order: 3 },
      { id: 5, name: "Pin Section", selector: ".pin-section", type: "pin", duration: 2, ease: "none", active: true, order: 4 }
    ];
  }

  setupThreeJS() {
    const canvas = this.threeCanvas.nativeElement;
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x0f172a);

    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.8, roughness: 0.2 });
    this.cube = new THREE.Mesh(geometry, material);
    this.threeScene.add(this.cube);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.threeScene.add(light);
    this.threeScene.add(new THREE.AmbientLight(0x404040));

    this.animateThree();
  }

  animateThree() {
    this.controls.update();
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.threeScene, this.camera);
    requestAnimationFrame(() => this.animateThree());
  }

  refreshPreview() {
    ScrollTrigger.getAll().forEach(st => st.kill());

    this.animations
      .filter(a => a.active)
      .sort((a, b) => a.order - b.order)
      .forEach(anim => {
        const els = document.querySelectorAll(anim.selector);
        if (els.length === 0) return;

        if (anim.type === 'text-split') {
          els.forEach(el => new SplitText(el, { type: "chars" }));
          gsap.from(".hero-title .char", { y: 100, opacity: 0, stagger: 0.05, duration: 1.5, ease: anim.ease });
        }
        else if (anim.type === '3d-float') {
          gsap.to(this.cube.position, { y: 1, duration: 2, yoyo: true, repeat: -1, ease: "sine.inOut" });
          gsap.to(this.cube.rotation, { x: "+=6.28", y: "+=6.28", duration: 20, repeat: -1, ease: "none" });
        }
        else if (anim.type === 'pin') {
          ScrollTrigger.create({ trigger: anim.selector, pin: true, start: "top top", end: "+=500" });
        }
        else if (anim.type === 'parallax') {
          gsap.to(els, { yPercent: -100, ease: "none", scrollTrigger: { trigger: els[0], scrub: true } });
        }
        else if (anim.type === 'stagger') {
          gsap.from(els, { y: 100, opacity: 0, stagger: 0.2, duration: 1.2, ease: anim.ease });
        }
      });
  }

  initDragAndDrop() {
    setTimeout(() => {
      Draggable.create('p-table tbody tr', {
        type: 'y',
        onDragEnd(this: any) {
          const rows = Array.from(document.querySelectorAll('p-table tbody tr'));
          const newOrder = rows.map(r => {
            const id = parseInt(r.getAttribute('data-id') || '0');
            return this.vars.comp.animations.find((a: any) => parseInt(a.id) === id)!;
          });
          this.vars.comp.animations = newOrder.map((a, i) => ({ ...a, order: i }));
          this.vars.comp.refreshPreview();
        },
        vars: { comp: this }
      });
    }, 1000);
  }
}