import gsap from "gsap";
import * as THREE from "three";

export class MasterAnimationController {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private timeline: gsap.core.Timeline;
    private currentConfig: any = null;

    constructor(
        private canvas: HTMLCanvasElement,
        config?: any // <-- Now accepts optional config (fixes "expected 1 arg")
    ) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true
        });

        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        this.timeline = gsap.timeline({ paused: true });

        this.initBaseScene();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        if (config) this.registerConfig(config);
    }


    //-----------------------------------------------------
    //  Scene Setup
    //-----------------------------------------------------
    private initBaseScene() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0xff6600 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = "baseMesh";
        this.scene.add(mesh);

        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        this.timeline.to(mesh.rotation, { y: Math.PI * 2, duration: 3, repeat: -1 });
    }


    public applyConfig(config: any, p: { overrides: any; }) {
        if (!config) return;

        const mesh = this.scene.getObjectByName("baseMesh") as THREE.Mesh;

        if (config.duration) {
            this.timeline.duration(config.duration);
        }

        if (config.color) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.color = new THREE.Color(config.color);
        }

        if (config.scale) {
            mesh.scale.set(config.scale, config.scale, config.scale);
        }

        if (config.cameraZ) {
            gsap.to(this.camera.position, { z: config.cameraZ, duration: 1 });
        }
    }



    //-----------------------------------------------------
    //  Config System (NEW)
    //-----------------------------------------------------
    public registerConfig(config: any) {
        this.currentConfig = config;
        this.applyConfig(config, { overrides: {} });
    }
    //-----------------------------------------------------
    //  Resize Support (NEW)
    //-----------------------------------------------------
    public resize(width: number = this.canvas.clientWidth, height: number = this.canvas.clientHeight) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }


    //-----------------------------------------------------
    //  Lifecycle
    //-----------------------------------------------------
    public play() { this.timeline.play(); }
    public pause() { this.timeline.pause(); }

    private animate() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }

    //-----------------------------------------------------
    //  Cleanup (NEW)
    //-----------------------------------------------------
    public dispose() {
        this.timeline.kill();
        this.renderer.dispose();
    }

    // For backward compatibility with your code
    public destroy() {
        this.dispose();
    }
}
