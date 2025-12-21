import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TreeModule } from 'primeng/tree';
import { TreeTableModule, TreeTable } from 'primeng/treetable';
import { MMenuRightsMaster, SaveMenuRightsRequest } from './MMenuRightsMaster';
import { SelectModule } from 'primeng/select';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { MenuRightsMasterService } from './menu-rights-master.services';
import { RolemasterService } from '../rolemaster/rolemaster.service';
import { LoginService } from '../../../authentication/login/login.service';

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
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuRightsMaster implements OnInit {
  @ViewChild('tt') tt!: TreeTable;
  private menuRightsService = inject(MenuRightsMasterService);
  private rolemasterService = inject(RolemasterService);
  private loginService = inject(LoginService);
  private messageService = inject(NotificationService);
  private confirmationService = inject(ConfirmationService);
  menuRightsTree: TreeNode<any>[] = [];
  filteredMenuRightsTree: TreeNode<any>[] = [];
  roles: any[] = [];
  admins: any[] = [];
  menuMappings: any[] = [];
  selectedRoleId: number | null = 0;
  selectedAdminId: number | null = 0;
  selectedRole: any = null;
  selectedAdmin: any = null;
  loading: boolean = false;
  saving: boolean = false;
  globalFilter: string = '';
  selectedMenuType: number | null = null;
  totalMenus: number = 0;
  menusWithView: number = 0;
  menusWithFullAccess: number = 0;
  activePreset: string | null = null;
  headerViewState: boolean = false;
  headerInsertState: boolean = false;
  headerUpdateState: boolean = false;
  headerDeleteState: boolean = false;
  presetConfig = {
  readOnly: { 
    label: 'Read Only', 
    icon: 'pi pi-eye', 
    description: 'Can only view content',
    config: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false }
  },
  fullAccess: { 
    label: 'Full Access', 
    icon: 'pi pi-lock-open', 
    description: 'All permissions enabled',
    config: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: true }
  },
  contentManager: { 
    label: 'Content Manager', 
    icon: 'pi pi-file-edit', 
    description: 'Can view, insert and update content',
    config: { CanView: true, CanInsert: true, CanUpdate: true, CanDelete: false }
  },
  editor: { 
    label: 'Editor', 
    icon: 'pi pi-pencil', 
    description: 'Can view and update content',
    config: { CanView: true, CanInsert: false, CanUpdate: true, CanDelete: false }
  },
  viewer: { 
    label: 'Viewer', 
    icon: 'pi pi-user', 
    description: 'View only, no modifications',
    config: { CanView: true, CanInsert: false, CanUpdate: false, CanDelete: false }
  }
  };

  ngOnInit() {
    this.loadRoles();
    this.loadAdmins();
    this.loadMenuMappings();
  }

  loadRoles() {
    this.rolemasterService.GetRoleDetails().subscribe({
      next: (res) => {
        if (!res.isError && res.result) {
          this.roles = Array.isArray(res.result) ? res.result : JSON.parse(res.result);
        } else {
          this.messageService.showMessage(res.strMessage || 'Failed to load roles', 'Error', PopupMessageType.Error);
        }
      },
      error: (err) => {
        console.error('Failed to load roles:', err);
        this.messageService.showMessage('Failed to load roles', 'Error', PopupMessageType.Error);
      }
    });
  }

  loadAdmins() {
    this.loginService.GetAdminDetails().subscribe({
      next: (res) => {
        if (!res.isError && res.result) {
          this.admins = Array.isArray(res.result) ? res.result : JSON.parse(res.result);
        } else {
          this.messageService.showMessage(res.strMessage || 'Failed to load admins', 'Error', PopupMessageType.Error);
        }
      },
      error: (err) => {
        console.error('Failed to load admins:', err);
        this.messageService.showMessage('Failed to load admins', 'Error', PopupMessageType.Error);
        }
    });
  }

  loadMenuMappings() {
    this.loading = true;
    this.menuRightsService.GetAllMenuMappings().subscribe({
      next: (res) => {
        if (!res.isError && res.result) {
          const rawData = Array.isArray(res.result) ? res.result : JSON.parse(res.result);
          this.menuMappings = rawData;
        } else {
          this.messageService.showMessage(res.strMessage || 'Failed to load menu mappings', 'Error', PopupMessageType.Error);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load menu mappings:', err);
        this.messageService.showMessage('Failed to load menu mappings', 'Error', PopupMessageType.Error);
        this.loading = false;
      }
    });
  }

  onRoleSelected(event: any) {
    this.selectedRoleId = event.value;
    this.selectedRole = this.roles.find(r => r.RoleID === this.selectedRoleId) || null;
    this.selectedAdminId = null;
    this.selectedAdmin = null;
    this.clearActivePreset(); 
    this.loadMenuRightsForEntity(this.selectedRoleId || 0, 0);
  }

  onAdminSelected(event: any) {
    debugger
    this.selectedAdminId = event.value;
    this.selectedAdmin = this.admins.find(a => a.UserID === this.selectedAdminId) || 0;
    this.clearActivePreset(); 
    this.loadMenuRightsForEntity(this.selectedRoleId || 0, this.selectedAdminId || 0);
  }

  loadMenuRightsForEntity(roleId: number, adminId: number) {
    if (roleId === 0) {
      this.menuRightsTree = [];
      this.filteredMenuRightsTree = [];
      return;
    }
    debugger;
    this.loading = true;
    this.menuRightsService.GetMenuMappingsByRoleandAdmin(roleId, adminId).subscribe({
      next: (res) => {
        this.loading = false;
        if (!res.isError) {
          debugger;
          let rightsData: any[] = [];
          if (res.result) {
            rightsData = Array.isArray(res.result) ? res.result : JSON.parse(res.result);
          }
          this.updateMenuTreeWithRights(rightsData);
          this.calculateStats();
        } else {
          this.messageService.showMessage(res.strMessage, res.title, PopupMessageType.Error);
          // Initialize with default rights (all false)
          this.initializeMenuTreeWithDefaultRights();
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load menu rights:', err);
        this.messageService.showMessage('Failed to load menu rights', 'Error', PopupMessageType.Error);
        // Initialize with default rights (all false)
        this.initializeMenuTreeWithDefaultRights();
      }
    });
  }

  initializeMenuTreeWithDefaultRights() {
    // Add default MRights (all false) to each menu item
    const menuWithRights = this.menuMappings.map(menu => ({
      ...menu,
      MRights: {
        CanView: false,
        CanInsert: false,
        CanUpdate: false,
        CanDelete: false
      }
    }));
    
    this.menuRightsTree = this.buildTree(menuWithRights);
    this.filteredMenuRightsTree = [...this.menuRightsTree];
    this.calculateStats();
  }

  updateMenuTreeWithRights(rightsData: any[]) {
    // Create a map of MenuID to rights from API response
    const rightsMap = new Map<number, any>();
    rightsData.forEach(right => {
      if (right.MRights) {
        rightsMap.set(right.MenuID, right.MRights);
      } else {
        // If the API returns the rights directly on the object
        rightsMap.set(right.MenuID, {
          CanView: right.CanView || false,
          CanInsert: right.CanInsert || false,
          CanUpdate: right.CanUpdate || false,
          CanDelete: right.CanDelete || false
        });
      }
    });

    // Update menu mappings with rights from API or set defaults
    const updatedMenus = this.menuMappings.map(menu => ({
      ...menu,
      MRights: rightsMap.get(menu.MenuID) || {
        CanView: false,
        CanInsert: false,
        CanUpdate: false,
        CanDelete: false
      }
    }));

    this.menuRightsTree = this.buildTree(updatedMenus);
    this.filteredMenuRightsTree = [...this.menuRightsTree];
  }

  buildTree(flatData: any[]): TreeNode<any>[] {
    const roots: TreeNode<any>[] = [];
    const map = new Map<number, TreeNode<any>>();

    flatData.forEach(item => {
      map.set(item.MenuID, {
        key: item.MenuID.toString(),
        data: item,
        children: [],
        expanded: false
      });
    });

    flatData.forEach(item => {
      const node = map.get(item.MenuID)!;
      if (item.ParentID === 0 || item.ParentID === null) {
        roots.push(node);
      } else {
        const parentNode = map.get(item.ParentID);
        if (parentNode) {
          parentNode.children!.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    // Sort by MenuRank
    const sortRecursive = (nodes: TreeNode<any>[]) => {
      nodes.sort((a, b) => a.data!.MenuRank - b.data!.MenuRank);
      for (const node of nodes) {
        if (node.children?.length) {
          sortRecursive(node.children);
        }
      }
    };
    
    sortRecursive(roots);
    return roots;
  }

  onRightsChange(node: TreeNode<any>, rightType: string) {
    if (!node.data) return;
    
    // Update the specific right
    node.data.MRights[rightType] = !node.data.MRights[rightType];
    
    // If unchecking View, uncheck all other rights
    if (rightType === 'CanView' && !node.data.MRights.CanView) {
      node.data.MRights.CanInsert = false;
      node.data.MRights.CanUpdate = false;
      node.data.MRights.CanDelete = false;
    }
    
    // Force change detection
    this.filteredMenuRightsTree = [...this.filteredMenuRightsTree];
    this.calculateStats();
  }

  calculateStats() {
    this.totalMenus = this.countNodes(this.menuRightsTree);
    this.menusWithView = this.countNodesByCondition(this.menuRightsTree, 
      node => node.data!.MRights.CanView
    );
    this.menusWithFullAccess = this.countNodesByCondition(this.menuRightsTree,
      node => node.data!.MRights.CanView && 
              node.data!.MRights.CanInsert && 
              node.data!.MRights.CanUpdate && 
              node.data!.MRights.CanDelete
    );
  }

  private countNodes(nodes: TreeNode<any>[]): number {
    let count = 0;
    nodes.forEach(node => {
      count++;
      if (node.children && node.children.length > 0) {
        count += this.countNodes(node.children);
      }
    });
    return count;
  }

  private countNodesByCondition(nodes: TreeNode<any>[], condition: (node: TreeNode<any>) => boolean): number {
    let count = 0;
    nodes.forEach(node => {
      if (condition(node)) {
        count++;
      }
      if (node.children && node.children.length > 0) {
        count += this.countNodesByCondition(node.children, condition);
      }
    });
    return count;
  }

  saveMenuRights() {
    // Determine which entity is selected
    const entityId = this.selectedRoleId || this.selectedAdminId;
    const entityType = this.selectedRoleId ? 'Role' : 'Admin';
    
    if (!entityId) {
      this.messageService.showMessage('Please select a role or admin', 'Warning', PopupMessageType.Warning);
      return;
    }

    // Collect all menu rights from tree
    const menuRightsItems: any[] = [];
    const collectRights = (nodes: TreeNode<any>[]) => {
      nodes.forEach(node => {
        if (node.data) {
          menuRightsItems.push({
            MenuID: node.data.MenuID,
            MappingID: node.data.MappingID,
            MRights: node.data.MRights
          });
          
          if (node.children?.length) {
            collectRights(node.children);
          }
        }
      });
    };
    
    collectRights(this.menuRightsTree);

    const saveRequest: SaveMenuRightsRequest = {
      EntityID: entityId,
      EntityType: entityType,
      MenuRights: menuRightsItems
    };

    this.saving = true;
    this.menuRightsService.SaveMenuRights(saveRequest).subscribe({
      next: (res) => {
        this.saving = false;
        if (!res.isError) {
          this.messageService.showMessage(
            res.strMessage || 'Menu rights saved successfully', 
            res.title || 'Success', 
            PopupMessageType.Success
          );
        } else {
          this.messageService.showMessage(res.strMessage, res.title, PopupMessageType.Error);
        }
      },
      error: (err) => {
        this.saving = false;
        this.messageService.showMessage(
          'Failed to save menu rights. Please try again.',
          'Error',
          PopupMessageType.Error
        );
      }
    });
  }

  // Bulk actions
  selectAllForRight(rightType: string, value: boolean) {
    const updateNodes = (nodes: TreeNode<any>[]) => {
      nodes.forEach(node => {
        if (node.data) {
          node.data.MRights[rightType] = value;
          // If unchecking View, uncheck all
          if (rightType === 'CanView' && !value) {
            node.data.MRights.CanInsert = false;
            node.data.MRights.CanUpdate = false;
            node.data.MRights.CanDelete = false;
          }
        }
        if (node.children?.length) {
          updateNodes(node.children);
        }
      });
    };
    
    updateNodes(this.menuRightsTree);
    this.filteredMenuRightsTree = [...this.filteredMenuRightsTree];
    this.calculateStats();
  }
  getNodeIndex(row: any): number {
    const node = this.resolveTreeNode(row);
    if (!node) return 0;
    const visibleNodes = this.getVisibleNodes();
    return visibleNodes.findIndex(n => n.key === node.key) + 1;
  }
  private getVisibleNodes(): TreeNode<MMenuRightsMaster>[] {
    const visible: TreeNode<MMenuRightsMaster>[] = [];
  
    const traverse = (nodes: TreeNode<MMenuRightsMaster>[]) => {
      for (const node of nodes) {
        visible.push(node);
  
        if (node.expanded && node.children?.length) {
          traverse(node.children);
        }
      }
    };
  
    traverse(this.filteredMenuRightsTree);
    return visible;
  }
  private resolveTreeNode(row: any): TreeNode<MMenuRightsMaster> | null {
        if (!row) return null;
        if (row.node && row.node.data) {
          return row.node as TreeNode<MMenuRightsMaster>;
        }
        if (row.data) {
          return row as TreeNode<MMenuRightsMaster>;
        }
        console.error('Invalid TreeTable row passed:', row);
        return null;
  }

  async applyPreset(presetKey: string) {
    if (!this.selectedRoleId && !this.selectedAdminId) {
    this.messageService.showMessage('Please select a role or admin first', 'Warning', PopupMessageType.Warning);
    return;
    } 

  const preset = this.presetConfig[presetKey as keyof typeof this.presetConfig];
  if (!preset) return;

  // Show confirmation dialog
  const confirmed = await this.showPresetConfirmation(preset);
  if (!confirmed) return;

  this.applyPresetConfig(preset.config);
  this.activePreset = presetKey;
  }
  applyPresetConfig(config: any) {
  const updateNodes = (nodes: TreeNode<any>[]) => {
    nodes.forEach(node => {
      if (node.data) {
        // Apply the preset config
        Object.assign(node.data.MRights, config);
        
        // Special logic for restricted preset
        if (!config.CanView) {
          node.data.MRights.CanInsert = false;
          node.data.MRights.CanUpdate = false;
          node.data.MRights.CanDelete = false;
        }
      }
      if (node.children?.length) {
        updateNodes(node.children);
      }
    });
  };

  updateNodes(this.menuRightsTree);
  this.updateHeaderStates();
  this.filteredMenuRightsTree = [...this.filteredMenuRightsTree];
  this.calculateStats();
  
  // Show success message
  this.messageService.showMessage(
    'Preset applied successfully',
    'Success',
    PopupMessageType.Success
  );
  }
  updateHeaderStates() {
  if (this.menuRightsTree.length === 0) {
    this.headerViewState = false;
    this.headerInsertState = false;
    this.headerUpdateState = false;
    this.headerDeleteState = false;
    return;
  }

  this.headerViewState = this.getAllRightState('CanView');
  this.headerInsertState = this.getAllRightState('CanInsert');
  this.headerUpdateState = this.getAllRightState('CanUpdate');
  this.headerDeleteState = this.getAllRightState('CanDelete');
}
getAllRightState(rightType: string): boolean {
  if (this.menuRightsTree.length === 0) return false;
  return this.menuRightsTree.every(node => 
    this.checkNodeAndChildren(node, rightType, true)
  );
}
private checkNodeAndChildren(node: TreeNode<any>, rightType: string, value: boolean): boolean {
  // Check current node
  if (node.data?.MRights?.[rightType] !== value) return false;
  
  // Check all children recursively
  if (node.children?.length) {
    return node.children.every(child => 
      this.checkNodeAndChildren(child, rightType, value)
    );
  }
  return true;
}
  private showPresetConfirmation(preset: any): Promise<boolean> {
  return new Promise((resolve) => {
    this.confirmationService.confirm({
      message: `Are you sure you want to apply the <strong>"${preset.label}"</strong> preset?<br>
                <small class="text-color-secondary">${preset.description}</small><br>
                <br>
                This will overwrite all existing permissions for the selected ${this.selectedRoleId ? 'role' : 'admin'}.`,
      header: 'Apply Preset',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-secondary p-button-text',
      accept: () => resolve(true),
      reject: () => resolve(false)
    });
  });
  } 
  clearActivePreset() {
    this.activePreset = null;
  }
  applyFilters() {
    let filteredData = this.menuRightsTree;
    
    if (this.selectedMenuType !== null) {
      filteredData = this.filterTreeByType(filteredData, this.selectedMenuType);
    }
    
    if (this.globalFilter.trim()) {
      filteredData = this.filterTreeByText(filteredData, this.globalFilter.trim());
    }
    
    this.filteredMenuRightsTree = filteredData;
  }

  private filterTreeByType(nodes: TreeNode<any>[], menuType: number): TreeNode<any>[] {
    return nodes.reduce((result: TreeNode<any>[], node) => {
      if (node.data!.MenuTypeID === menuType) {
        result.push(node);
      } else if (node.children && node.children.length > 0) {
        const filteredChildren = this.filterTreeByType(node.children, menuType);
        if (filteredChildren.length > 0) {
          result.push({ ...node, children: filteredChildren });
        }
      }
      return result;
    }, []);
  }

  private filterTreeByText(nodes: TreeNode<any>[], searchText: string): TreeNode<any>[] {
    const lowerSearch = searchText.toLowerCase();
    
    return nodes.reduce((result: TreeNode<any>[], node) => {
      const matches = 
        node.data!.MenuName.toLowerCase().includes(lowerSearch) ||
        (node.data!.MenuURL || '').toLowerCase().includes(lowerSearch);
      
      let filteredChildren: TreeNode<any>[] = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = this.filterTreeByText(node.children, searchText);
      }
      
      if (matches || filteredChildren.length > 0) {
        result.push({ ...node, children: filteredChildren });
      }
      
      return result;
    }, []);
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilter = value;
    this.applyFilters();
  }

  clearFilters() {
    this.globalFilter = '';
    this.selectedMenuType = null;
    this.filteredMenuRightsTree = [...this.menuRightsTree];
  }

  expandAll() {
    const expandNodes = (nodes: TreeNode<any>[]) => {
      nodes.forEach(node => {
        node.expanded = true;
        if (node.children && node.children.length > 0) {
          expandNodes(node.children);
        }
      });
    };
    expandNodes(this.menuRightsTree);
    this.filteredMenuRightsTree = [...this.filteredMenuRightsTree];
  }

  collapseAll() {
    const collapseNodes = (nodes: TreeNode<any>[]) => {
      nodes.forEach(node => {
        node.expanded = false;
        if (node.children && node.children.length > 0) {
          collapseNodes(node.children);
        }
      });
    };
    collapseNodes(this.menuRightsTree);
    this.filteredMenuRightsTree = [...this.filteredMenuRightsTree];
  }
  clearSelections() {
    this.selectedRoleId = null;
    this.selectedAdminId = null;
    this.selectedRole = null;
    this.selectedAdmin = null;
    this.menuRightsTree = [];
    this.filteredMenuRightsTree = [];
    this.totalMenus = 0;
    this.menusWithView = 0;
    this.menusWithFullAccess = 0;
  }
  getMenuTypeSeverity(type: number): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  switch(type) {
    case 1: return 'info';      // Main Menu
    case 2: return 'success';   // Sub Menu
    case 3: return 'warn';   // Action
    default: return 'secondary';
  }
  }
  // Get selected entity name for display
  getSelectedEntityName(): string {
    if (this.selectedRole) {
      return `Role: ${this.selectedRole.RoleName}`;
    } else if (this.selectedAdmin) {
      return `Admin: ${this.selectedAdmin.AdminName}`;
    }
    return 'Select Role or Admin';
  }
}