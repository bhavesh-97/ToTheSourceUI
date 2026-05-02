import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LookupService, LookupItem } from '../../../services/lookup.service';

@Component({
  selector: 'app-lookup-master',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, TableModule, ButtonModule,
    DialogModule, InputTextModule, SelectModule, TagModule, ToastModule
  ],
  templateUrl: './lookup-master.html',
  styleUrls: ['./lookup-master.css'],
  providers: [MessageService]
})
export class LookupMaster implements OnInit {
  private lookupService = inject(LookupService);
  private messageService = inject(MessageService);

  lookups = signal<LookupItem[]>([]);
  filteredLookups = signal<LookupItem[]>([]);
  selectedCode = signal<string>('STATUS');
  
  codes = [
    { label: 'Status', value: 'STATUS' },
    { label: 'GSAP Status', value: 'GSAP_STATUS' },
    { label: 'Rule Type', value: 'RULE_TYPE' },
    { label: 'Property Direction', value: 'PROP_DIR' },
    { label: 'Value Type', value: 'VAL_TYPE' },
    { label: 'Callback Event', value: 'CB_EVENT' },
    { label: 'GSAP Plugin', value: 'GSAP_PLUGIN' }
  ];

  dialogVisible = false;
  isNew = false;
  editingLookup: Partial<LookupItem> = {};

  constructor() {}

  ngOnInit() {
    this.loadLookups();
  }

  loadLookups() {
    this.lookupService.GetByCode(this.selectedCode()).subscribe(response => {
      if (response && !response.isError) {
        this.lookups.set(response.result || []);
        this.filteredLookups.set(response.result || []);
      }
    });
  }

  onCodeChange() {
    this.loadLookups();
  }

  openDialog(isNew: boolean, lookup?: LookupItem) {
    this.isNew = isNew;
    if (isNew) {
      this.editingLookup = {
        code: this.selectedCode(),
        desc: '',
        val: 0,
        isActive: true
      };
    } else if (lookup) {
      this.editingLookup = { ...lookup };
    }
    this.dialogVisible = true;
  }

  save() {
    if (!this.editingLookup.desc?.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Required', detail: 'Description is required' });
      return;
    }

    if (this.isNew) {
      this.lookupService.Create(this.editingLookup).subscribe(response => {
        if (response && !response.isError) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Lookup created' });
          this.dialogVisible = false;
          this.loadLookups();
        }
      });
    } else {
      this.lookupService.Update(this.editingLookup.lookupID!, this.editingLookup).subscribe(response => {
        if (response && !response.isError) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Lookup updated' });
          this.dialogVisible = false;
          this.loadLookups();
        }
      });
    }
  }

  deleteLookup(lookup: LookupItem) {
    if (confirm(`Delete "${lookup.desc}"?`)) {
      this.lookupService.Delete(lookup.lookupID).subscribe(response => {
        if (response && !response.isError) {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Lookup deleted' });
          this.loadLookups();
        }
      });
    }
  }

  getSeverity(active: boolean): 'success' | 'danger' | 'warn' | 'secondary' {
    return active ? 'success' : 'danger';
  }
}