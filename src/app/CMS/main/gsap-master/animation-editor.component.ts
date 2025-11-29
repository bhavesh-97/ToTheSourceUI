// src/app/CMS/main/gsap-master/animation-editor.component.ts

import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { AnimationConfig } from '../../../@core/animations/animationtypes';

@Component({
  selector: 'app-animation-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextModule,
    CheckboxModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()">
      <div class="grid">
        <div class="col-12">
          <label>ID</label>
          <input pInputText formControlName="id" [readonly]="editing" />
        </div>
        <div class="col-12">
          <label>Name</label>
          <input pInputText formControlName="name" />
        </div>
        <div class="col-6">
          <label>Duration (s)</label>
          <p-inputNumber formControlName="duration"></p-inputNumber>
        </div>
        <div class="col-6 flex align-items-end">
          <p-checkbox formControlName="loop" binary="true"></p-checkbox>
          <label class="ml-2">Loop</label>
        </div>
        <div class="col-12">
          <label>Description</label>
          <textarea pInputTextarea rows="3" formControlName="description"></textarea>
        </div>
        <div class="col-12">
          <label>Scene JSON</label>
          <!-- <textarea pInputTextarea rows="10" [(ngModel)]="sceneJson" [ngModelOptions]="{standalone: true}"></textarea> -->
        </div>
      </div>

      <div class="flex justify-content-end gap-2 mt-3">
        <button pButton type="submit" label="Save" [disabled]="form.invalid"></button>
        <button pButton type="button" label="Cancel" class="p-button-secondary" (click)="cancel.emit()"></button>
      </div>
    </form>
  `
})
export class AnimationEditorComponent implements OnInit {
  @Input() config!: AnimationConfig;
  @Output() saveConfig = new EventEmitter<AnimationConfig>();
  @Output() cancel = new EventEmitter<void>();

  form = inject(FormBuilder).group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    duration: [2],
    loop: [false],
    description: ['']
  });

  sceneJson = '{}';
  editing = false;

  ngOnInit() {
    if (this.config) {
      this.editing = true;
      this.form.patchValue({
        id: this.config.id,
        name: this.config.name,
        duration: this.config.duration ?? 2,
        loop: this.config.loop ?? false,
        description: this.config.description ?? ''
      });
      this.sceneJson = JSON.stringify(this.config.scene || {}, null, 2);
    }
  }

  save() {
    if (this.form.invalid) return;

    const updated: AnimationConfig = {
      ...this.config,
      id: this.form.value.id!,
      name: this.form.value.name!,
      category: this.config.category || 'custom',
      description: this.form.value.description || '',
      duration: this.form.value.duration || 2,
      loop: this.form.value.loop || false,
      scene: JSON.parse(this.sceneJson || '{}')
    };

    this.saveConfig.emit(updated);
  }
}