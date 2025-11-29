import { Injectable } from '@angular/core';
import { PageConfig } from '../../../@core/animations/animationtypes';

@Injectable({ providedIn: 'root' })
export class AnimationService {

  private pages: PageConfig[] = [
    {
      id: 'home',
      title: 'Homepage',
      animations: [
        {
            id: 'fadeInBox',
            name: 'Fade In Box',
            description: 'Simple fade and slide animation',
            duration: 1.2,
            settings: {},
            category: '',
            loop: false
        }
      ]
    },
    {
      id: 'about',
      title: 'About',
      animations: []
    }
  ];

  getPages(): PageConfig[] {
    return this.pages;
  }

  savePage(page: PageConfig) {
    const idx = this.pages.findIndex(p => p.id === page.id);
    if (idx !== -1) {
      this.pages[idx] = page;
    }
  }
}
