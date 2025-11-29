import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AnimationConfig } from '../@core/animations/animationtypes';

@Injectable({ providedIn: 'root' })
export class AnimationConfigService {
  private data$ = new BehaviorSubject<AnimationConfig[]>([
    {
      id: 'spin-box',
      name: 'Spin Box',
      category: 'basic',
      description: 'A simple spinning box.',
      duration: 2,
      loop: true,
      scene: {
        background: '#0b0b0b',
        camera: { fov: 50, position: [0, 1, 4] },
        objects: [
          {
            type: 'box',
            id: 'box-1',
            params: { width: 1, height: 1, depth: 1 },
            material: { color: '#ff7f50' },
            position: [0, 0, 0],
            animate: [{ property: 'rotation', to: { y: Math.PI * 2 }, duration: 2, repeat: -1 }]
          }
        ]
      },
      settings: undefined
    },
    {
      id: 'bobbing-spheres',
      name: 'Bobbing Spheres',
      category: 'group',
      description: 'Three bobbing spheres.',
      duration: 3,
      loop: true,
      scene: {
        background: '#ffffff',
        camera: { fov: 45, position: [0, 1, 6] },
        objects: [
          { type: 'sphere', id: 's1', params: { radius: 0.4 }, material: { color: '#4CAF50' }, position: [-1.2, 0, 0], animate: [{ property: 'position', to: { y: 0.6 }, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }] },
          { type: 'sphere', id: 's2', params: { radius: 0.4 }, material: { color: '#2196F3' }, position: [0, 0, 0], animate: [{ property: 'position', to: { y: 0.8 }, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }] },
          { type: 'sphere', id: 's3', params: { radius: 0.4 }, material: { color: '#FFC107' }, position: [1.2, 0, 0], animate: [{ property: 'position', to: { y: 0.6 }, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }] }
        ]
      },
      settings: undefined
    }
  ]);

  getAll(): Observable<AnimationConfig[]> {
    return this.data$.asObservable();
  }

  getById(id: string): Observable<AnimationConfig | undefined> {
    return of(this.data$.value.find(c => c.id === id));
  }

  save(config: AnimationConfig): Observable<AnimationConfig> {
    const arr = [...this.data$.value];
    const idx = arr.findIndex(x => x.id === config.id);
    if (idx >= 0) {
      arr[idx] = config;
    } else {
      config.id = config.id || this.generateId();
      arr.push(config);
    }
    this.data$.next(arr);
    return of(config);
  }

  delete(id: string): Observable<boolean> {
    const arr = this.data$.value.filter(x => x.id !== id);
    this.data$.next(arr);
    return of(true);
  }

  private generateId() {
    return 'anim-' + Math.random().toString(36).slice(2, 9);
  }
}
