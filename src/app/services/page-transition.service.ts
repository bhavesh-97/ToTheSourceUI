// page-transition.service.ts
import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

@Injectable({ providedIn: 'root' })
export class PageTransitionService {
  async navigateWith3D(element: HTMLElement) {
    const state = Flip.getState(element);

    // Clone and send to next page (via service or localStorage)
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = element.getBoundingClientRect().top + 'px';
    clone.style.left = element.getBoundingClientRect().left + 'px';
    clone.style.width = element.offsetWidth + 'px';
    clone.style.height = element.offsetHeight + 'px';
    clone.style.zIndex = '9999';
    document.body.appendChild(clone);

    // Navigate
    setTimeout(() => {
      window.location.href = '/new-page'; // or router.navigate()
    }, 100);

    // Animate out
    Flip.from(state, {
      duration: 1.2,
      ease: "power4.inOut",
      scale: true,
      spin: 1,
      onComplete: () => clone.remove()
    });
  }

  // For incoming page
  animateIn() {
    gsap.from("h1, .card, img", {
      y: 200,
      rotationX: -90,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "back.out(1.4)"
    });
  }
}