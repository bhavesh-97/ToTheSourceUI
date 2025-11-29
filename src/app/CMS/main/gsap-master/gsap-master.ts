import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
import { AnimationEditorComponent } from '../gsap-master/animation-editor.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { AnimationService } from './animation.service';
import { PreviewGridComponent } from './preview-grid.component';
import { AnimationConfig, PageConfig } from '../../../@core/animations/animationtypes';
@Component({
  selector: 'app-gsap-master',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    // DropdownModule,
    ToastModule,
    AnimationEditorComponent,
    PreviewGridComponent
  ],
  templateUrl: './gsap-master.html',
  styleUrl: './gsap-master.css'
})
export class GsapMaster implements OnInit {

  private animationService = inject(AnimationService);
  // private messageService = inject(MessageService);

  pages: PageConfig[] = [];
  selectedPage: PageConfig | null = null;

  showAnimationDialog = false;
  editingAnimation: AnimationConfig | null = null;

  ngOnInit() {
    this.pages = this.animationService.getPages();
  }

  selectPage(page: PageConfig) {
    this.selectedPage = JSON.parse(JSON.stringify(page)); // deep clone
  }

  addAnimation() {
    this.editingAnimation = {
      id: '',
      name: '',
      description: '',
      duration: 1,
      settings: {},
      category: '',
      loop: false
    };
    this.showAnimationDialog = true;
  }

  editAnimation(anim: AnimationConfig) {
    this.editingAnimation = JSON.parse(JSON.stringify(anim));
    this.showAnimationDialog = true;
  }

  onSaveAnimation(anim: AnimationConfig) {
    if (!this.selectedPage) return;

    const idx = this.selectedPage.animations.findIndex(a => a.id === anim.id);

    if (idx >= 0) {
      this.selectedPage.animations[idx] = anim;
    } else {
      this.selectedPage.animations.push(anim);
    }

    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Saved',
    //   detail: 'Animation saved successfully'
    // });

    this.showAnimationDialog = false;
  }

  savePageToServer() {
    if (!this.selectedPage) return;

    this.animationService.savePage(this.selectedPage);
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Updated',
    //   detail: 'Page configuration saved.'
    // });
  }
}
