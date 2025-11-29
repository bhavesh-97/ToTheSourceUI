import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-preview-grid',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="preview-box"></div>`,
  styles: [`
    .preview-box {
      width: 80px;
      height: 40px;
      background: #41b6ff;
      border-radius: 6px;
    }
  `]
})
export class PreviewGridComponent implements OnInit {
  @Input() animation: any;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const box = this.el.nativeElement.querySelector('.preview-box');

    gsap.fromTo(
      box,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: this.animation.duration, repeat: -1, yoyo: true }
    );
  }
}
