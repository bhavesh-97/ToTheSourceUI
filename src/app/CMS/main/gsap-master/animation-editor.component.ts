// src/app/pages/gsap-master-editor.component.ts
import { Component, ViewChild, ElementRef, AfterViewInit, inject, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Tabs } from 'primeng/tabs';
import { TabList } from 'primeng/tabs';
import { Tab } from 'primeng/tabs';
import { TabPanels } from 'primeng/tabs';
import { TabPanel } from 'primeng/tabs';
import { gsap } from 'gsap'; 
import { AnimationConfig } from '../../../@core/animations/animationtypes';
import { AnimationConfigService } from '../../../services/animation-config.service';
import { GsapMasterService } from './gsap-master.service';

@Component({
  selector: 'app-gsap-master-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Tabs,
    TabList,
    Tab, 
    TabPanels, 
    TabPanel,
    TableModule,
    ButtonModule,
    // DropdownModule REMOVED ← Fix for errors 1 & 2: Not used (native select instead)
    ToastModule,
    CKEditorModule
  ],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <!-- Left Panel: Editor -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5>GSAP Master Editor</h5>
              <!-- NEW: p-tabs (replaces p-tabView) -->
              <p-tabs value="0">
                <p-tablist>
                  <p-tab value="0">Custom Code</p-tab>
                  <p-tab value="1">Presets</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel value="0">
                    <ckeditor
                      [editor]="Editor"
                      [(ngModel)]="gsapCode"
                      [config]="editorConfig"
                      (change)="onCodeChange()">
                    </ckeditor>
                  </p-tabpanel>
                  <p-tabpanel value="1">
                    <!-- Native Select (unchanged) -->
                    <div class="mb-3">
                      <label for="presetSelect" class="form-label">Select Preset</label>
                      <select 
                        id="presetSelect"
                        class="form-select"
                        [(ngModel)]="selectedPresetId"
                        (change)="loadPreset()">
                        <option value="">Choose a preset...</option>
                        <option *ngFor="let preset of presets" [value]="preset.id">
                          {{ preset.name }}
                        </option>
                      </select>
                    </div>
                    <textarea 
                      class="form-control mt-2" 
                      rows="5" 
                      [(ngModel)]="presetJson"
                      placeholder="Or paste JSON config here">
                    </textarea>
                  </p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
            <div class="card-body">
              <button pButton label="Run Code" icon="pi pi-play" class="mb-2" (click)="runCode()"></button>
              <button pButton label="Save Preset" icon="pi pi-save" class="mb-2 ms-2" (click)="savePreset()"></button>
              <small class="text-muted">Write GSAP timelines, tweens, or JSON configs above.</small>
            </div>
          </div>
        </div>

        <!-- Right Panel: Live Preview (unchanged) -->
        <div class="col-md-6">
          <div class="card h-100">
            <div class="card-header">
              <h5>Live Preview</h5>
            </div>
            <div class="card-body p-0">
              <div #previewContainer class="preview-canvas bg-dark position-relative" style="width:100%; height:300px; overflow:hidden;">
                <!-- GSAP elements render here -->
              </div>
            </div>
            <div class="card-footer">
              <button pButton label="Pause" icon="pi pi-pause" class="me-2" (click)="pause()"></button>
              <button pButton label="Reset" icon="pi pi-refresh" (click)="reset()"></button>
            </div>
          </div>

          <!-- Saved Presets Table: Added *ngIf to handle null ← Fix for error 4 -->
          <div class="card mt-3" *ngIf="savedPresets$ | async as savedPresets">
            <div class="card-header"><h6>Saved Presets</h6></div>
            <p-table [value]="savedPresets" [tableStyle]="{'min-width': '50rem'}">
              <ng-template pTemplate="header">
                <tr><th>Name</th><th>Duration</th><th>Actions</th></tr>
              </ng-template>
              <ng-template pTemplate="body" let-preset>
                <tr>
                  <td>{{ preset.name }}</td>
                  <td>{{ preset.duration }}s</td>
                  <td>
                    <button pButton icon="pi pi-eye" (click)="loadFromTable(preset.id)" class="p-button-text"></button>
                    <button pButton icon="pi pi-trash" (click)="deletePreset(preset.id)" class="p-button-danger p-button-text"></button>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </div>
    </div>

  `,
  styles: [`
    .preview-canvas { border: 1px solid #ddd; }
    .ck-editor__editable { min-height: 200px; }
    .form-select { width: 100%; }
  `]
})
export class GsapMasterEditorComponent implements AfterViewInit {
  @ViewChild('previewContainer') previewContainer!: ElementRef<HTMLDivElement>;

  // ← Fix for error 3: Cast to any to bypass type conflict (update packages as noted above)
  Editor = ClassicEditor as any;
  editorConfig = { toolbar: ['bold', 'italic', '|', 'bulletedList', 'numberedList'] };

  gsapCode = `// Write your GSAP code here!\ngsap.to(".gsap-box", { duration: 2, rotation: 360, stagger: 0.1 });`;
  presetJson = '{}';
  selectedPresetId = '';  // For native select

  presets = [
    { id: 'spin', name: 'Spin Animation' },
    { id: 'bounce', name: 'Bounce Effect' },
    { id: 'stagger-fade', name: 'Stagger Fade' }
  ];

  private gsapService = inject(GsapMasterService);
  private configService = inject(AnimationConfigService);
  // private messageService = inject(MessageService);

  savedPresets$ = this.configService.getAll();

  ngAfterViewInit() {
    this.runCode(); // Initial run
  }

  onCodeChange() {
    setTimeout(() => this.runCode(), 500);
  }

  runCode() {
    this.gsapService.runCode(this.gsapCode, this.previewContainer.nativeElement);
  }

  loadPreset() {
    if (this.selectedPresetId) {
      this.gsapService.loadPreset(this.selectedPresetId, this.previewContainer.nativeElement);
    }
  }
// Add to GsapMasterEditorComponent class (after existing properties)
@Input() config?: AnimationConfig;  // ← For [config] binding

@Output() saveConfig = new EventEmitter<AnimationConfig>();  // ← For (saveConfig) event

// In savePreset() method: Emit instead of just subscribe (for dialog callback)
savePreset() {
  const config: AnimationConfig = {
    id: 'custom-' + Date.now(),
    name: 'Custom GSAP',
    category: 'user',
    description: 'Saved from editor',
    duration: 2,
    loop: true,
    scene: JSON.parse(this.presetJson || '{}'),
    settings: {}
  };
  this.configService.save(config).subscribe(() => {
    // this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Preset saved!' });
    this.saveConfig.emit(config);  // ← Emit for parent (GsapMaster) to handle
  });
}

// Optional: Load initial config on init (for edit mode)
ngOnInit() {
  if (this.config) {
    this.gsapCode = `// Loaded from config: ${this.config.name}\ngsap.to(".gsap-box", { duration: ${this.config.duration}, rotation: 360 });`;
    this.presetJson = JSON.stringify(this.config.scene || {}, null, 2);
    this.runCode();
  }
}
  loadFromTable(id: string) {
    this.configService.getById(id).subscribe(config => {
      if (config) {
        // ← Fix for error 5: Make generateGsapCodeFromConfig public in GsapMasterService (see below)
        this.gsapCode = this.gsapService.generateGsapCodeFromConfig(config);
        this.runCode();
      }
    });
  }

  // savePreset() {
  //   const config: AnimationConfig = {
  //     id: 'custom-' + Date.now(),
  //     name: 'Custom GSAP',
  //     category: 'user',
  //     description: 'Saved from editor',
  //     duration: 2,
  //     loop: true,
  //     scene: JSON.parse(this.presetJson || '{}'),
  //     settings: {}  // ← Fix for error 6: Add required 'settings' property
  //   };
  //   this.configService.save(config).subscribe(() => {
  //     this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Preset saved!' });
  //   });
  // }

  deletePreset(id: string) {
    this.configService.delete(id).subscribe(() => {
      // this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Preset removed.' });
    });
  }

  pause() {
    gsap.globalTimeline.pause();
  }

  reset() {
    this.gsapService.killCurrent();
    this.runCode();
  }
}