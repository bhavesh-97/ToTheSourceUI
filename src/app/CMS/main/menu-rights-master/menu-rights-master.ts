import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode, MenuItem } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MultiSelectModule } from 'primeng/multiselect';
import { PopoverModule } from 'primeng/popover';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { Tree, TreeModule } from 'primeng/tree';
import { TreeTableModule, TreeTable } from 'primeng/treetable';
import { MCommonEntitiesMaster } from '../../../models/MCommonEntitiesMaster';
import { MRights } from '../../../models/MRights';
import { MMenuRightsMaster } from './MMenuRightsMaster';
import { SelectModule } from 'primeng/select';
import { MRoleMaster } from '../rolemaster/MRoleMaster';
import { MUser } from '../../../models/MUser';
import { MMenuMappingMaster } from '../menu-mapping-master/MenuMappingMaster';

@Component({
  selector: 'app-menu-rights-master',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TreeTableModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    ChipModule,
    BadgeModule,
    TagModule,
    TooltipModule,
    ProgressSpinnerModule,
    PanelModule,
    AccordionModule,
    DividerModule,
    SelectButtonModule,
    ToggleSwitchModule,
    SkeletonModule,
    MultiSelectModule,
    KeyFilterModule,
    InputGroupModule,
    InputGroupAddonModule,
    IconFieldModule,
    InputIconModule,
    TabsModule ,
    CardModule,
    ScrollPanelModule,
    SplitterModule,
    PopoverModule,
    ContextMenuModule,
    FileUploadModule,
    InputNumberModule
  ],
  templateUrl: './menu-rights-master.html',
  styleUrl: './menu-rights-master.scss',
  providers: [ConfirmationService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuRightsMaster implements OnInit {
  roles = signal([{ label: 'Admin', value: 'adm' }, { label: 'HR Manager', value: 'hr' }]);
  admins = signal([{ label: 'Robert Fox', value: 'rf' }, { label: 'Cody Fisher', value: 'cf' }]);
  
  selectedRole: any;
  selectedAdmin: any;
  menuPermissions: TreeNode[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.loadMockData();
  }

  loadMockData() {
    this.menuPermissions = [
      {
        data: { name: 'Inventory', view: false, insert: false, update: false, delete: false },
        expanded: true,
        children: [
          { data: { name: 'Stock Entry', view: false, insert: false, update: false, delete: false } },
          { data: { name: 'Warehouse Transfer', view: false, insert: false, update: false, delete: false } }
        ]
      },
      {
        data: { name: 'Reports', view: false, insert: false, update: false, delete: false },
        children: [{ data: { name: 'Sales Analysis', view: false, insert: false, update: false, delete: false } }]
      }
    ];
  }

  // Recursive toggle for child nodes
  toggleChildren(node: TreeNode, column: string, value: boolean) {
    node.data[column] = value;
    if (node.children) {
      node.children.forEach(child => this.toggleChildren(child, column, value));
    }
  }

  // Header "Select All" logic
  toggleAll(column: string, event: any) {
    const isChecked = event.checked;
    this.menuPermissions.forEach(node => this.toggleChildren(node, column, isChecked));
  }

  savePermissions() {
    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Permissions updated for ' + this.selectedRole?.label 
    });
  }
}