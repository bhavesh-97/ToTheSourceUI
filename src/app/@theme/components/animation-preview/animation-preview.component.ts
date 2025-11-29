// src/app/components/animation-preview/animation-preview.component.ts
import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LazyPreviewDirective } from '../../../directives/lazy-preview.directive';
import { AnimationConfig } from '../../../@core/animations/animationtypes';
import { GsapMaster } from '../../../CMS/main/gsap-master/gsap-master';

@Component({
  selector: 'app-animation-preview',
  standalone: true,
  imports: [CommonModule, LazyPreviewDirective],
  template: `
    <div class="preview-box" [style.width.px]="width" [style.height.px]="height" lazyPreview (visible)="onVisible()">
      <ng-container #vc></ng-container>

      <div *ngIf="!mounted" class="preview-placeholder d-flex align-items-center justify-content-center">
        <div class="text-muted">Preview</div>
      </div>
    </div>
  `,
  styles: [`
    .preview-box { position: relative; overflow: hidden; border-radius: 6px; background: #000; }
    .preview-placeholder { position: absolute; inset: 0; display:flex; }
    app-gsap-master { width:100%; height:100%; display:block; }
  `]
})
export class AnimationPreviewComponent {
  @Input() config!: AnimationConfig;
  @Input() width = 220;
  @Input() height = 140;
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;

  mounted = false;

  // lazy mount GSAPMasterComponent when visible
  async onVisible() {
    if (this.mounted) return;
    this.mounted = true;
    // dynamically create the GSAPMasterComponent inside VC and pass inputs
    const compRef = this.vc.createComponent(GsapMaster as any);
    compRef.setInput('config', this.config);
    // set preview overrides (shorter duration / camera)
    compRef.setInput('overrides', {
      duration: Math.min(this.config.duration ?? 2, 1.5),
      scene: { camera: { fov: 45 } }
    });
    // note: component will initialize in its lifecycle
  }
}
