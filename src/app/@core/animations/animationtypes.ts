
export type MediaType = 'image' | 'video' | 'audio' | 'none';
export interface GsapSequenceStep {
  selector: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  order: number;
  timeline?: GsapRule; 
  styles?: Record<string, string>; 
  media?: GsapMedia; 
}
export interface GsapMedia {
  id: string;
  selector: string;
  type: MediaType;
  url: string;
}
export interface GsapRule {
  id: string;
  label: string;
  type: 'tween' | 'timeline';
  selector: string;
  from?: Record<string, any>;
  to?: Record<string, any>;
  defaults?: Record<string, any>;
  stagger?: { each: number };
  scrollTrigger?: Record<string, any>;
  version: number;
  status: 'draft' | 'published' | 'archived'; 
  sequence?: GsapSequenceStep[];
  media: GsapMedia;
  styles?: Record<string, string>;
  description?: string;
  tags?: string[];
}
export interface GsapCallback {
  name: string;
  script: string;
}

export interface GsapGlobal {
  defaults: { duration: number; ease: string };
  registerPlugins: string[];
  autoInit: boolean;
  meta: { version: string; description: string };
  version: number;
  status: string;
}

export interface PageConfig {
  id: string;
  title: string;
  description?: string;
  gsapConfig?: GsapConfig; 
}

export interface GsapConfig {
  global: GsapGlobal;
  rules: GsapRule[];
  callbacks: GsapCallback[];
}



// export type Easing = string;


// export interface AnimateStep {
// property: string; // 'rotation' | 'position' | 'scale' | etc.
// to: any;
// duration?: number;
// ease?: Easing;
// repeat?: number;
// yoyo?: boolean;
// }


// export interface SceneObject {
// type: 'box' | 'sphere' | 'plane' | 'custom';
// id: string;
// params?: any;
// material?: { color?: string | number; opacity?: number };
// position?: [number, number, number];
// scale?: [number, number, number];
// rotation?: [number, number, number];
// animate?: AnimateStep[];
// }


// export interface CameraConfig {
// fov?: number;
// position?: [number, number, number];
// }


// export interface SceneConfig {
// background?: string | number;
// camera?: CameraConfig;
// objects?: SceneObject[];
// }


// export interface AnimationConfig {
// id: string;
// name: string;
// category: string;
// description: string;
// loop: boolean;
// duration: number;
// viewport?: { width?: number; height?: number };
// scene?: SceneConfig;
// overrides?: Record<string, any>;
// settings: any;
// }


// export interface PageConfig {
//   id: string;
//   title: string;
//   animations: AnimationConfig[];
// }