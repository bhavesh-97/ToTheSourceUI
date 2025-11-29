import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(TextPlugin, CustomEase);

@Directive({
  selector: '[textDistort]',
  standalone: true
})
export class TextDistortDirective implements OnInit {
  @Input() intensity = 1;
  @Input() trigger: string | HTMLElement = 'this';

  private originalText = '';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.originalText = this.el.nativeElement.textContent;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

    const distort = () => {
      let iteration = 0;
      const interval = setInterval(() => {
        this.el.nativeElement.textContent = this.originalText
          .split("")
          .map((letter: string, i: number) => {
            if (iteration / 3 > i || Math.random() < 0.1) return this.originalText[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        if (iteration >= this.originalText.length * 3) {
          clearInterval(interval);
          this.el.nativeElement.textContent = this.originalText;
        }
        iteration += 1 / 3;
      }, 30);
    };

    if (this.trigger === 'this') {
      this.el.nativeElement.addEventListener('mouseenter', distort);
    } else {
      ScrollTrigger.create({
        trigger: this.trigger,
        onEnter: distort
      });
    }
  }
}