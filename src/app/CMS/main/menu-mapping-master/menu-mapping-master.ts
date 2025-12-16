import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConfirmationService, TreeNode, MessageService } from 'primeng/api';
import { NotificationService } from '../../../services/notification.service';
import { PopupMessageType } from '../../../models/PopupMessageType';
import { MenuMappingMasterService } from './menu-mapping-master.service';
import { ButtonModule } from 'primeng/button';
import { TreeTableModule, TreeTable } from 'primeng/treetable';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PanelModule } from 'primeng/panel';
import { BadgeModule } from 'primeng/badge';
import { SelectModule } from 'primeng/select';
import { MMenuResourceMaster } from '../menu-resource-master/MenuResourceMaster';
import { MenuResourceMasterService } from '../menu-resource-master/menu-resource-master.service';
import { MenuTypeOption, MMenuMappingMaster, ParentMenuOption, SaveMenuMappingRequest, StatusOption } from './MenuMappingMaster';
import { Card, CardModule } from "primeng/card";

@Component({
  selector: 'app-menu-mapping-master',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TreeTableModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    TagModule,
    SelectModule,
    InputNumberModule,
    ToggleSwitchModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    SelectButtonModule,
    PanelModule,
    BadgeModule,
    CardModule
],
  templateUrl: './menu-mapping-master.html',
  styleUrls: ['./menu-mapping-master.css']
})
export class MenuMappingMaster implements OnInit {
  @ViewChild('tt') tt!: TreeTable;

  private menuMappingService = inject(MenuMappingMasterService);
  private menuResourceService = inject(MenuResourceMasterService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private fb = inject(FormBuilder);

  // Data
  menuMappings: TreeNode<MMenuMappingMaster>[] = [];
  filteredMenuMappings: TreeNode<MMenuMappingMaster>[] = [];
  menuResources: MMenuResourceMaster[] = [];
  parentMenuOptions: ParentMenuOption[] = [];
  filteredMenuResources: MMenuResourceMaster[] = [];

  // UI State
  loading: boolean = true;
  saving: boolean = false;
  displayDialog: boolean = false;
  dialogHeader: string = '';
  selectedNode: TreeNode<MMenuMappingMaster> | null = null;
  globalFilter: string = '';
  
  // Filter state
  selectedStatus: boolean | null = null;
  selectedMenuType: number | null = null;

  // Form
  menuMappingForm: FormGroup;

  // Dropdown Options
  menuTypes: MenuTypeOption[] = [
    { label: 'Main Menu', value: 1, icon: 'pi pi-home' },
    { label: 'Sub Menu', value: 2, icon: 'pi pi-folder' },
    { label: 'Action', value: 3, icon: 'pi pi-cog' }
  ];

  statusOptions: StatusOption[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];

  // Stats
  activeMenuCount: number = 0;
  mainMenuCount: number = 0;
  maxLevel: number = 0;
  totalMenus: number = 0;

  constructor() {
    this.menuMappingForm = this.fb.group({
      MappingID: [0],
      MenuID: [null, Validators.required],
      MenuName: [''],
      MenuURL: [''],
      Icon: [''],
      MenuType: [1, Validators.required],
      ParentID: [0],
      MenuRank: [1, [Validators.required, Validators.min(1), Validators.max(999)]],
      IsActive: [true]
    });

    // Watch for MenuID changes to populate Menu details
    this.menuMappingForm.get('MenuID')?.valueChanges.subscribe(menuId => {
      this.onMenuSelected(menuId);
    });

    // Watch for MenuType changes to adjust ParentID
    this.menuMappingForm.get('MenuType')?.valueChanges.subscribe(menuType => {
      this.onMenuTypeChanged(menuType);
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadMenuResources();
  }

  loadData() {
    this.loading = true;
    this.menuMappingService.GetAllMenuMappingDetails().subscribe({
      next: (res) => {
        if (!res.isError) {
          let flatData: MMenuMappingMaster[];
          if (typeof res.result === 'string') {
            flatData = JSON.parse(res.result) as MMenuMappingMaster[];
          } else {
            flatData = res.result as MMenuMappingMaster[];
          }
          const treeData = this.buildTree(flatData);
          this.menuMappings = treeData;
          this.filteredMenuMappings = [...treeData];
          this.buildParentMenuOptions();
          this.calculateStats();
          this.loading = false;
        } else {
          this.messageService.showMessage(res.strMessage, res.title, PopupMessageType.Error);
          this.loading = false;
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.showMessage(
          'Failed to load menu mappings. Please try again.',
          'Error',
          PopupMessageType.Error
        );
      }
    });
  }

  loadMenuResources() {
    this.menuResourceService.GetAllMenuResourceDetails().subscribe({
      next: (res) => {
        if (!res.isError) {
          this.menuResources = res.result;
          this.filteredMenuResources = [...this.menuResources];
        }
      },
      error: (err) => {
        console.error('Failed to load menu resources:', err);
      }
    });
  }

  // buildTree(flatData: MMenuMappingMaster[]): TreeNode<MMenuMappingMaster>[] {
  //   const tree: TreeNode<MMenuMappingMaster>[] = [];
  //   const map: { [key: number]: TreeNode<MMenuMappingMaster> } = {};

  //   // First pass: create map
  //   flatData.forEach(item => {
  //     map[item.MappingID] = {
  //       data: item,
  //       children: [],
  //       key: item.MappingID.toString(),
  //       label: item.MenuName,
  //       expanded: false // Initialize expanded state
  //     };
  //   });

  //   // Second pass: build tree
  //   flatData.forEach(item => {
  //     const node = map[item.MappingID];
  //     if (item.ParentID === 0) {
  //       tree.push(node);
  //     } else {
  //       if (map[item.ParentID]) {
  //         map[item.ParentID].children!.push(node);
  //       } else {
  //         // Orphan node - add to root
  //         tree.push(node);
  //       }
  //     }
  //   });

  //   // Sort tree by MenuRank
  //   const sortTree = (nodes: TreeNode<MMenuMappingMaster>[]): TreeNode<MMenuMappingMaster>[] => {
  //     return nodes
  //       .sort((a, b) => (a.data!.MenuRank - b.data!.MenuRank))
  //       .map(node => {
  //         if (node.children && node.children.length > 0) {
  //           node.children = sortTree(node.children);
  //         }
  //         return node;
  //       });
  //   };

  //   return sortTree(tree);
  // }
buildTree(flatData: MMenuMappingMaster[]): TreeNode<MMenuMappingMaster>[] {
  const roots: TreeNode<MMenuMappingMaster>[] = [];

  // Map by MenuID (IMPORTANT)
  const map = new Map<number, TreeNode<MMenuMappingMaster>>();

  // Step 1: Create nodes
  flatData.forEach(item => {
    map.set(item.MenuID, {
      key: item.MenuID.toString(),
      data: item,
      children: [],
      expanded: false
    });
  });

  // Step 2: Link parent → child using ParentID → MenuID
  flatData.forEach(item => {
    const node = map.get(item.MenuID)!;

    if (item.ParentID === 0 || item.ParentID === null) {
      // ROOT MENU
      roots.push(node);
    } else {
      const parentNode = map.get(item.ParentID);
      if (parentNode) {
        parentNode.children!.push(node);
      } else {
        // Safety fallback (orphan)
        roots.push(node);
      }
    }
  });

  // Step 3: Sort by MenuRank recursively
  const sortRecursive = (nodes: TreeNode<MMenuMappingMaster>[]) => {
    nodes.sort((a, b) => a.data!.MenuRank - b.data!.MenuRank);
    nodes.forEach(n => n.children && sortRecursive(n.children));
  };

  sortRecursive(roots);
  return roots;
}
isRootMenu(menu: MMenuMappingMaster): boolean {
  return menu.ParentID === 0 || menu.ParentID === null;
}

  // buildParentMenuOptions() {
  //   const flattenTree = (nodes: TreeNode<MMenuMappingMaster>[], level = 0): ParentMenuOption[] => {
  //     let result: ParentMenuOption[] = [];
  //     nodes.forEach(node => {
  //       const prefix = '—'.repeat(level * 2);
  //       result.push({
  //         label: `${prefix} ${node.data!.MenuName} (${this.getMenuTypeLabel(node.data!.MenuType)})`,
  //         value: node.data!.MappingID,
  //         data: node.data!
  //       });
  //       if (node.children && node.children.length > 0) {
  //         result = result.concat(flattenTree(node.children, level + 1));
  //       }
  //     });
  //     return result;
  //   };

  //   const rootOption: ParentMenuOption = {
  //     label: '🏠 Root (Top Level)',
  //     value: 0,
  //     data: null
  //   };

  //   this.parentMenuOptions = [rootOption, ...flattenTree(this.menuMappings)];
  // }
buildParentMenuOptions() {
  const options: ParentMenuOption[] = [
    { label: '🏠 Root (Top Level)', value: 0, data: null }
  ];

  const traverse = (nodes: TreeNode<MMenuMappingMaster>[], level = 0) => {
    nodes.forEach(node => {
      options.push({
        label: `${'—'.repeat(level * 2)} ${node.data!.MenuName}`,
        value: node.data!.MenuID, // IMPORTANT
        data: node.data!
      });

      if (node.children?.length) {
        traverse(node.children, level + 1);
      }
    });
  };

  traverse(this.menuMappings);
  this.parentMenuOptions = options;
}

  calculateStats() {
    // Calculate total menus
    this.totalMenus = this.countNodes(this.menuMappings);

    // Calculate active menu count
    this.activeMenuCount = this.countNodesByCondition(this.menuMappings, 
      node => node.data!.MCommonEntitiesMaster.IsActive
    );

    // Calculate main menu count
    this.mainMenuCount = this.countNodesByCondition(this.menuMappings,
      node => node.data!.MenuType === 1
    );

    // Calculate max level
    const calculateMaxLevel = (nodes: TreeNode<MMenuMappingMaster>[], currentLevel: number): number => {
      let maxLevel = currentLevel;
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          const childMax = calculateMaxLevel(node.children, currentLevel + 1);
          maxLevel = Math.max(maxLevel, childMax);
        }
      });
      return maxLevel;
    };
    
    this.maxLevel = calculateMaxLevel(this.menuMappings, 0);
  }

  private countNodes(nodes: TreeNode<MMenuMappingMaster>[]): number {
    let count = 0;
    nodes.forEach(node => {
      count++;
      if (node.children && node.children.length > 0) {
        count += this.countNodes(node.children);
      }
    });
    return count;
  }

  private countNodesByCondition(nodes: TreeNode<MMenuMappingMaster>[], condition: (node: TreeNode<MMenuMappingMaster>) => boolean): number {
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

  openNew() {
    this.selectedNode = null;
    this.menuMappingForm.reset({
      MappingID: 0,
      MenuID: null,
      MenuName: '',
      MenuURL: '',
      Icon: '',
      MenuType: 1,
      ParentID: 0,
      MenuRank: 1,
      IsActive: true
    });
    this.dialogHeader = 'Create New Menu Mapping';
    this.displayDialog = true;
  }

  // openNewChild(parentNode: TreeNode<MMenuMappingMaster>) {
  //   this.selectedNode = parentNode;
  //   this.menuMappingForm.reset({
  //     MappingID: 0,
  //     MenuID: null,
  //     MenuName: '',
  //     MenuURL: '',
  //     Icon: '',
  //     MenuType: 2,
  //     ParentID: parentNode.data!.MappingID,
  //     MenuRank: (parentNode.children?.length || 0) + 1,
  //     IsActive: true
  //   });
  //   this.dialogHeader = `Add Child to "${parentNode.data!.MenuName}"`;
  //   this.displayDialog = true;
  // }
openNewChild(row: any) {
  const parentNode = this.resolveTreeNode(row);
  if (!parentNode) return;

  this.selectedNode = parentNode;

  this.menuMappingForm.reset({
    MappingID: 0,
    MenuID: null,
    MenuName: '',
    MenuURL: '',
    Icon: '',
    MenuType: 2,
    ParentID: parentNode.data!.MenuID, // ✅ MenuID
    MenuRank: (parentNode.children?.length || 0) + 1,
    IsActive: true
  });

  this.dialogHeader = `Add Child to "${parentNode.data!.MenuName}"`;
  this.displayDialog = true;
}

  editMenu(row: any) {
    const node = this.resolveTreeNode(row);
    if (!node) return;
    const menuData = node.data!;
    this.selectedNode = node;
    this.menuMappingForm.patchValue({
      MappingID: menuData.MappingID,
      MenuID: menuData.MenuID,
      MenuName: menuData.MenuName,
      MenuURL: menuData.MenuURL,
      Icon: menuData.Icon,
      MenuType: menuData.MenuType,
      ParentID: menuData.ParentID,
      MenuRank: menuData.MenuRank,
      IsActive: menuData.MCommonEntitiesMaster.IsActive
    });
    this.dialogHeader = `Edit "${menuData.MenuName}"`;
    this.displayDialog = true;
  }

  deleteMenu(row: any) {
    const node = this.resolveTreeNode(row);
    if (!node) return;
    const menuData = node.data!;
    this.confirmationService.confirm({
      message: `Are you sure you want to delete <strong>"${menuData.MenuName}"</strong>?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.menuMappingService.DeleteMenuMapping(menuData).subscribe({
          next: (res) => {
            if (!res.isError) {
              this.messageService.showMessage(res.strMessage, res.title, PopupMessageType.Success);
              this.loadData();
            } else {
              this.messageService.showMessage(res.strMessage, res.title, PopupMessageType.Error);
            }
          },
          error: (err) => {
            this.messageService.showMessage(
              'Failed to delete menu mapping. Please try again.',
              'Error',
              PopupMessageType.Error
            );
          }
        });
      }
    });
  }
private resolveTreeNode(row: any): TreeNode<MMenuMappingMaster> | null {
  if (!row) return null;
  if (row.node && row.node.data) {
    return row.node as TreeNode<MMenuMappingMaster>;
  }
  if (row.data) {
    return row as TreeNode<MMenuMappingMaster>;
  }

  console.error('Invalid TreeTable row passed:', row);
  return null;
}

  onMenuSelected(menuId: number) {
    const selectedMenu = this.menuResources.find(m => m.MenuID === menuId);
    if (selectedMenu) {
      this.menuMappingForm.patchValue({
        MenuName: selectedMenu.MenuName,
        MenuURL: selectedMenu.MenuURL,
        Icon: selectedMenu.Icon
      }, { emitEvent: false });
    }
  }

  onMenuTypeChanged(menuType: number) {
    if (menuType === 1) { // Main Menu
      this.menuMappingForm.patchValue({ ParentID: 0 });
    }
  }

  saveMapping() {
    if (this.menuMappingForm.invalid) {
      this.markFormGroupTouched(this.menuMappingForm);
      return;
    }

    const formValue = this.menuMappingForm.value;
    const mapping: SaveMenuMappingRequest = {
      MappingID: formValue.MappingID > 0 ? formValue.MappingID : undefined,
      MenuID: formValue.MenuID,
      MenuType: formValue.MenuType,
      ParentID: formValue.ParentID,
      MenuRank: formValue.MenuRank,
      IsActive: formValue.IsActive
    };

    this.saving = true;
    this.menuMappingService.SaveMenuMapping(mapping).subscribe({
      next: (res) => {
        this.saving = false;
        if (!res.isError) {
          this.messageService.showMessage(res.strMessage, res.title, PopupMessageType.Success);
          this.displayDialog = false;
          this.loadData();
        } else {
          this.messageService.showMessage(res.strMessage, res.title, PopupMessageType.Error);
        }
      },
      error: (err) => {
        this.saving = false;
        this.messageService.showMessage(
          'Failed to save menu mapping. Please try again.',
          'Error',
          PopupMessageType.Error
        );
      }
    });
  }

  getMenuTypeLabel(type: number): string {
    const menuType = this.menuTypes.find(t => t.value === type);
    return menuType ? menuType.label : 'Unknown';
  }

  getMenuTypeIcon(type: number): string {
    const menuType = this.menuTypes.find(t => t.value === type);
    return menuType ? menuType.icon : 'pi pi-question';
  }

  getMenuTypeSeverity(type: number): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch(type) {
      case 1: return 'info';
      case 2: return 'success';
      case 3: return 'warning';
      default: return 'secondary';
    }
  }

  getStatusSeverity(isActive: boolean): 'success' | 'danger' {
    return isActive ? 'success' : 'danger';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Active' : 'Inactive';
  }

  getParentName(parentId: number): string {
    if (parentId === 0) return 'Root';
    const parent = this.parentMenuOptions.find(p => p.value === parentId);
    return parent && parent.data ? parent.data.MenuName : 'Unknown';
  }

  getParentIcon(parentId: number): string {
    if (parentId === 0) return 'pi pi-home';
    const parent = this.parentMenuOptions.find(p => p.value === parentId);
    return parent && parent.data ? parent.data.Icon : 'pi pi-folder';
  }

  filterMenuResources(event: any) {
    const query = (event.query || '').toLowerCase();
    this.filteredMenuResources = this.menuResources.filter(menu =>
      menu.MenuName.toLowerCase().includes(query) ||
      (menu.MenuURL || '').toLowerCase().includes(query) 
    );
  }

  applyFilters() {
    if (!this.menuMappings || this.menuMappings.length === 0) {
      this.filteredMenuMappings = [...this.menuMappings];
      return;
    }

    let filteredData = this.menuMappings;
    
    // Apply menu type filter
    if (this.selectedMenuType !== null) {
      filteredData = this.filterTreeByType(filteredData, this.selectedMenuType);
    }
    
    // Apply status filter
    if (this.selectedStatus !== null) {
      filteredData = this.filterTreeByStatus(filteredData, this.selectedStatus);
    }
    
    // Apply global filter
    if (this.globalFilter.trim()) {
      filteredData = this.filterTreeByText(filteredData, this.globalFilter.trim());
    }
    
    this.filteredMenuMappings = filteredData;
  }

  private filterTreeByType(nodes: TreeNode<MMenuMappingMaster>[], menuType: number): TreeNode<MMenuMappingMaster>[] {
    return nodes.reduce((result: TreeNode<MMenuMappingMaster>[], node) => {
      if (node.data!.MenuType === menuType) {
        // Include node and all its children
        result.push(node);
      } else if (node.children && node.children.length > 0) {
        // Check children
        const filteredChildren = this.filterTreeByType(node.children, menuType);
        if (filteredChildren.length > 0) {
          // Include parent if any child matches
          result.push({
            ...node,
            children: filteredChildren
          });
        }
      }
      return result;
    }, []);
  }

  private filterTreeByStatus(nodes: TreeNode<MMenuMappingMaster>[], status: boolean): TreeNode<MMenuMappingMaster>[] {
    return nodes.reduce((result: TreeNode<MMenuMappingMaster>[], node) => {
      if (node.data!.MCommonEntitiesMaster.IsActive === status) {
        // Include node and all its children
        result.push(node);
      } else if (node.children && node.children.length > 0) {
        // Check children
        const filteredChildren = this.filterTreeByStatus(node.children, status);
        if (filteredChildren.length > 0) {
          // Include parent if any child matches
          result.push({
            ...node,
            children: filteredChildren
          });
        }
      }
      return result;
    }, []);
  }

  private filterTreeByText(nodes: TreeNode<MMenuMappingMaster>[], searchText: string): TreeNode<MMenuMappingMaster>[] {
    const lowerSearch = searchText.toLowerCase();
    
    return nodes.reduce((result: TreeNode<MMenuMappingMaster>[], node) => {
      const matches = 
        node.data!.MenuName.toLowerCase().includes(lowerSearch) ||
        (node.data!.MenuURL || '').toLowerCase().includes(lowerSearch);
      
      let filteredChildren: TreeNode<MMenuMappingMaster>[] = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = this.filterTreeByText(node.children, searchText);
      }
      
      if (matches || filteredChildren.length > 0) {
        result.push({
          ...node,
          children: filteredChildren
        });
      }
      
      return result;
    }, []);
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilter = value;
    this.applyFilters();
  }

  onStatusFilterChange(event: any) {
    this.selectedStatus = event.value;
    this.applyFilters();
  }

  onMenuTypeFilterChange(event: any) {
    this.selectedMenuType = event.value;
    this.applyFilters();
  }

  clearFilters() {
    this.globalFilter = '';
    this.selectedStatus = null;
    this.selectedMenuType = null;
    this.filteredMenuMappings = [...this.menuMappings];
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  expandAll() {
    const expandNodes = (nodes: TreeNode<MMenuMappingMaster>[]) => {
      nodes.forEach(node => {
        node.expanded = true;
        if (node.children && node.children.length > 0) {
          expandNodes(node.children);
        }
      });
    };
    expandNodes(this.menuMappings);
    // Force change detection
    this.filteredMenuMappings = [...this.filteredMenuMappings];
  }

  collapseAll() {
    const collapseNodes = (nodes: TreeNode<MMenuMappingMaster>[]) => {
      nodes.forEach(node => {
        node.expanded = false;
        if (node.children && node.children.length > 0) {
          collapseNodes(node.children);
        }
      });
    };
    collapseNodes(this.menuMappings);
    // Force change detection
    this.filteredMenuMappings = [...this.filteredMenuMappings];
  }

  exportToCSV() {
    this.exportToCSVCustom();
  }
getSerialNumber(index: number): number {
  const page = this.tt?.first ?? 0;
  const rows = this.tt?.rows ?? 10;
  return page + index + 1;
}
getNodeIndex(rowNode: TreeNode): number {
  const flat: TreeNode[] = [];

  const flatten = (nodes: TreeNode[]) => {
    for (const n of nodes) {
      flat.push(n);
      if (n.children?.length) {
        flatten(n.children);
      }
    }
  };

  flatten(this.filteredMenuMappings);
  return flat.indexOf(rowNode) + 1;
}

  private exportToCSVCustom() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    const headers = ['Menu Name', 'URL', 'Type', 'Rank', 'Parent', 'Status', 'Level'];
    csvContent += headers.join(',') + '\n';
    
    // Data
    const addNodeToCSV = (node: TreeNode<MMenuMappingMaster>, level: number) => {
      const row = [
        `"${node.data!.MenuName}"`,
        `"${node.data!.MenuURL || ''}"`,
        `"${this.getMenuTypeLabel(node.data!.MenuType)}"`,
        node.data!.MenuRank,
        `"${node.data!.ParentMenuName || 'Root'}"`,
        `"${this.getStatusLabel(node.data!.MCommonEntitiesMaster.IsActive)}"`,
        level
      ];
      csvContent += row.join(',') + '\n';
      
      if (node.children) {
        node.children.forEach(child => addNodeToCSV(child, level + 1));
      }
    };
    
    this.menuMappings.forEach(node => addNodeToCSV(node, 0));
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "menu_mappings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getSelectedMenuIcon(): string {
    const menuId = this.menuMappingForm.get('MenuID')?.value;
    const menu = this.menuResources.find(m => m.MenuID === menuId);
    return menu?.Icon || 'pi pi-file';
  }

  getSelectedMenuName(): string {
    const menuId = this.menuMappingForm.get('MenuID')?.value;
    const menu = this.menuResources.find(m => m.MenuID === menuId);
    return menu?.MenuName || 'Select Menu';
  }

  // Manually toggle row expansion
  toggleRow(node: TreeNode<MMenuMappingMaster>) {
    node.expanded = !node.expanded;
    // Force change detection
    this.filteredMenuMappings = [...this.filteredMenuMappings];
  }
}