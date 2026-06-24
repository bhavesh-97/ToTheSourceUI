import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guide-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './guide-tab.component.html',
  styleUrls: ['./guide-tab.component.scss'],
})
export class GuideTabComponent {
  expandedSection = signal<string | null>('sections');

  toggleSection(id: string): void {
    this.expandedSection.set(this.expandedSection() === id ? null : id);
  }
}
