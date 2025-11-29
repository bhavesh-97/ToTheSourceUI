export type Easing = string;


export interface AnimateStep {
property: string; // 'rotation' | 'position' | 'scale' | etc.
to: any;
duration?: number;
ease?: Easing;
repeat?: number;
yoyo?: boolean;
}


export interface SceneObject {
type: 'box' | 'sphere' | 'plane' | 'custom';
id: string;
params?: any;
material?: { color?: string | number; opacity?: number };
position?: [number, number, number];
scale?: [number, number, number];
rotation?: [number, number, number];
animate?: AnimateStep[];
}


export interface CameraConfig {
fov?: number;
position?: [number, number, number];
}


export interface SceneConfig {
background?: string | number;
camera?: CameraConfig;
objects?: SceneObject[];
}


export interface AnimationConfig {
id: string;
name: string;
category: string;
description: string;
loop: boolean;
duration: number;
viewport?: { width?: number; height?: number };
scene?: SceneConfig;
overrides?: Record<string, any>;
settings: any;
}


export interface PageConfig {
  id: string;
  title: string;
  animations: AnimationConfig[];
}