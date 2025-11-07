// src/app/@theme/components/search-input/search-input.component.ts
import { Component, ElementRef, EventEmitter, Output, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'ngx-search-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="search-container" (click)="$event.stopPropagation()">
      <!-- Search Icon -->
      <i class="search-icon" (click)="toggleSearch()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </i>

      <!-- Input Field -->
      <input #searchInput
             type="text"
             placeholder="Search anything..."
             class="search-input"
             [class.active]="isActive"
             (input)="onSearch($event)"
             (blur)="onBlur()"
             (focus)="onFocus()">
    </div>
  `,
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent {
  @ViewChild('searchInput') input!: ElementRef<HTMLInputElement>;
  @Output() search = new EventEmitter<string>();

  isActive = false;

  toggleSearch() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      setTimeout(() => this.input.nativeElement.focus(), 100);
      this.animateIn();
    } else {
      this.animateOut();
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }

  onFocus() {
    this.isActive = true;
    this.animateIn();
  }

  onBlur() {
    if (!this.input.nativeElement.value) {
      this.isActive = false;
      this.animateOut();
    }
  }

  private animateIn() {
    gsap.to(this.input.nativeElement, {
      width: 280,
      padding: '0.5rem 1rem',
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
    gsap.to('.search-icon', {
      x: -240,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  private animateOut() {
    gsap.to(this.input.nativeElement, {
      width: 0,
      padding: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
    gsap.to('.search-icon', {
      x: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
  }
}