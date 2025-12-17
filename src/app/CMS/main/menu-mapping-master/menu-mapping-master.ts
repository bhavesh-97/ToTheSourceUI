import { Component, OnInit, inject, ViewChild, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
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
import { Select, SelectModule } from 'primeng/select';
import { MMenuResourceMaster } from '../menu-resource-master/MenuResourceMaster';
import { MenuResourceMasterService } from '../menu-resource-master/menu-resource-master.service';
import { MenuTypeOption, MMenuMappingMaster, ParentMenuOption, SaveMenuMappingRequest, StatusOption } from './MenuMappingMaster';
import { CardModule } from "primeng/card";
import { MessageModule } from 'primeng/message';
import { FormUtils } from '../../../shared/utilities/form-utils.ts';
import { FormFieldConfig } from '../../../Interfaces/FormFieldConfig';
import { ValidationRules } from '../../../shared/utilities/validation-rules.enum';
import { TableModule } from "primeng/table";
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MMenuTypeMaster } from '../../../models/MMenuTypeMaster';
import { MSiteAreaMaster } from '../../../models/MSiteAreaMaster';
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
    InputGroupModule,
    InputGroupAddonModule,
    DialogModule,
    ConfirmDialogModule,
    TagModule,
    MessageModule,
    SelectModule,
    InputNumberModule,
    ToggleSwitchModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    SelectButtonModule,
    PanelModule,
    BadgeModule,
    CardModule,
    TableModule
],
  templateUrl: './menu-mapping-master.html',
  styleUrls: ['./menu-mapping-master.css']
})
export class MenuMappingMaster implements OnInit {
  @ViewChild('tt') tt!: TreeTable;
  @ViewChildren('inputField') inputElements!: QueryList<any>;
  private menuMappingService = inject(MenuMappingMasterService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private FormUtils = inject(FormUtils);
  private renderer = inject(Renderer2);
  menuMappings: TreeNode<MMenuMappingMaster>[] = [];
  filteredMenuMappings: TreeNode<MMenuMappingMaster>[] = [];
  menuResources: MMenuResourceMaster[] = [];
  menuTypes: MMenuTypeMaster[] = [];
  siteAres: MSiteAreaMaster[] = [];
  parentMenuOptions: ParentMenuOption[] = [];
  filteredMenuResources: MMenuResourceMaster[] = [];
  loading: boolean = true;
  saving: boolean = false;
  displayDialog: boolean = false;
  dialogHeader: string = '';
  selectedNode: TreeNode<MMenuMappingMaster> | null = null;
  globalFilter: string = '';
  selectedStatus: boolean | null = null;
  selectedMenuType: number | null = null;
  menuMappingForm!: FormGroup;
  activeMenuCount: number = 0;
  mainMenuCount: number = 0;
  maxLevel: number = 0;
  totalMenus: number = 0;
  // menuTypes: MenuTypeOption[] = [
  //   { label: 'Main Menu', value: 1, icon: 'pi pi-home' },
  //   { label: 'Sub Menu', value: 2, icon: 'pi pi-folder' },
  //   { label: 'Action', value: 3, icon: 'pi pi-cog' }
  // ];
  statusOptions: StatusOption[] = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
  ];
  private formFields: FormFieldConfig[] = [
    { name: 'MappingID', isMandatory: false, events: [] },
    { name: 'MenuID', isMandatory: true, validationMessage: 'Please Select Menu',events: [] },
    { name: 'MenuTypeID', isMandatory: true, validationMessage: 'Please Select Menu Type',events: [] },
    { name: 'SiteAreaID', isMandatory: true, validationMessage: 'Please Select Site Area',events: [] },
    { name: 'MenuRank', isMandatory: true, min:1, max:99 ,validationMessage: 'Please enter a valid Menu Rank.', events: [{ type: 'keypress', validationRule: ValidationRules.NumberOnly}, { type: 'focusout', validationRule: ValidationRules.NumberOnly }]},
    { name: 'ParentID', isMandatory: false, validationMessage: 'Please Select Parent Menu',events: [] },
    { name: 'MCommonEntitiesMaster.IsActive', isMandatory: false, validationMessage: '', events: [] },
  ];

  constructor() {
    this.menuMappingForm = this.FormUtils.createFormGroup(this.formFields, this.fb);
    this.menuMappingForm.get('MenuID')?.valueChanges.subscribe(menuId => {
      this.onMenuSelected(menuId);
    });
    this.menuMappingForm.get('MenuTypeID')?.valueChanges.subscribe(menuType => {
      this.onMenuTypeChanged(menuType);
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadMenuResources();
    this.loadMenuTypes();
    this.loadSiteAres();
  }
  ngAfterViewInit() {
      this.FormUtils.registerFormFieldEventListeners(this.formFields, this.inputElements.toArray(), this.renderer,this.menuMappingForm);
  }
  private getVisibleNodes(): TreeNode<MMenuMappingMaster>[] {
  const visible: TreeNode<MMenuMappingMaster>[] = [];

  const traverse = (nodes: TreeNode<MMenuMappingMaster>[]) => {
    for (const node of nodes) {
      visible.push(node);

      if (node.expanded && node.children?.length) {
        traverse(node.children);
      }
    }
  };

  traverse(this.filteredMenuMappings);
  return visible;
}

  getNodeIndex(row: any): number {
    const node = this.resolveTreeNode(row);
    if (!node) return 0;
    const visibleNodes = this.getVisibleNodes();
    return visibleNodes.findIndex(n => n.key === node.key) + 1;
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
    this.menuMappingService.GetMenuResourceDetails().subscribe({
      next: (res) => {
        let menuData: any[] = [];
        if (!res.isError) {
          const rawResult = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          if (Array.isArray(rawResult)) {
            menuData = rawResult;
          } else {
            console.error('API response successful, but result is not an array after parsing:', rawResult);
          }
          this.menuResources = menuData;
          this.filteredMenuResources = [...this.menuResources];
        } else if (!res.isError) {
        this.menuResources = []; 
        this.filteredMenuResources = [];
      }
      },
      error: (err) => {
        this.menuResources = [];
        this.filteredMenuResources = [];
        console.error('Failed to load menu resources:', err);
      }
    });
  }
  loadMenuTypes() {
    this.menuMappingService.GetMenuTypeDetails().subscribe({
      next: (res) => {
        let menutypeData: any[] = [];
        if (!res.isError) {
          const rawResult = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          if (Array.isArray(rawResult)) {
            menutypeData = rawResult;
          } else {
            console.error('API response successful, but result is not an array after parsing:', rawResult);
          }
          this.menuTypes = menutypeData;

        } else if (!res.isError) {
        this.menuTypes = []; 
      }
      },
      error: (err) => {
        this.menuTypes = [];
        console.error('Failed to load menu type:', err);
      }
    });
  }
  
  loadSiteAres() {
    this.menuMappingService.GetSiteAreaDetails().subscribe({
      next: (res) => {
        let siteAreData: any[] = [];
        if (!res.isError) {
          const rawResult = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          if (Array.isArray(rawResult)) {
            siteAreData = rawResult;
          } else {
            console.error('API response successful, but result is not an array after parsing:', rawResult);
          }
          this.siteAres = siteAreData;
        } else if (!res.isError) {
        this.siteAres = []; 
      }
      },
      error: (err) => {
        this.siteAres = [];
        console.error('Failed to load Site Areas:', err);
      }
    });
  }
  onMenuResourceChange(event: any) {
    const menuId = event.value;
    const selectedMenu = this.menuResources.find(m => m.MenuID === menuId);

    if (selectedMenu) {
      this.menuMappingForm.patchValue({
        Icon: selectedMenu.Icon,
        MenuName: selectedMenu.MenuName 
      });
    }
  }
  preventParentScroll() {
    // Use a slight delay to ensure ALL dropdown overlays are rendered
    setTimeout(() => {
      this.inputElements.forEach((pSelectComponent: Select) => {
        const overlay = document.querySelector('.p-select-overlay.p-connected-overlay-enter') || 
                        document.querySelector('.p-dropdown-panel.p-connected-overlay-enter');
        
        if (overlay) {
          const listContainer = overlay.querySelector('.p-select-items-wrapper') || overlay.querySelector('.p-dropdown-items-wrapper');
          if (listContainer) {
            this.renderer.listen(listContainer, 'wheel', (event) => {
              event.stopPropagation();
            });
            this.renderer.listen(listContainer, 'touchmove', (event) => {
              event.stopPropagation();
            });
            return; 
          }
        }
      });
    }, 0); 
  }
  buildTree(flatData: MMenuMappingMaster[]): TreeNode<MMenuMappingMaster>[] {
    const roots: TreeNode<MMenuMappingMaster>[] = [];
    const map = new Map<number, TreeNode<MMenuMappingMaster>>();
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
    const MAX_DEPTH = 100; 
    const sortRecursive = (nodes: TreeNode<MMenuMappingMaster>[],depth = 0) => {
        if (depth > MAX_DEPTH) {
          console.error('Max recursion depth exceeded at depth:', depth);
          return;
        }

        nodes.sort((a, b) => a.data!.MenuRank - b.data!.MenuRank);
  
        for (const node of nodes) {
            if (node.children?.length) {
              sortRecursive(node.children, depth + 1);
            }
          }
      };
    sortRecursive(roots);
    return roots;
  }

  isRootMenu(menu: MMenuMappingMaster): boolean {
    return menu.ParentID === 0 || menu.ParentID === null;
  }

  buildParentMenuOptions() {
    const options: ParentMenuOption[] = [
      { label: '🏠 Root (Top Level)', value: 0, data: null }
    ];

    const traverse = (nodes: TreeNode<MMenuMappingMaster>[], level = 0) => {
      nodes.forEach(node => {
        options.push({
          // label: `${'—'.repeat(level * 2)} ${node.data!.MenuName}`,
          label: node.data!.MenuName,
          value: node.data!.MenuID, 
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
    this.totalMenus = this.countNodes(this.menuMappings);
    this.activeMenuCount = this.countNodesByCondition(this.menuMappings, 
      node => node.data!.MCommonEntitiesMaster.IsActive
    );
    this.mainMenuCount = this.countNodesByCondition(this.menuMappings,
      node => node.data!.MenuTypeID === 1
    );
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
      MenuTypeID: 1,
      ParentID: 0,
      MenuRank: 1,
      MCommonEntitiesMaster: {
        IsActive: false
      }
    });
    this.dialogHeader = 'Create New Menu Mapping';
    this.displayDialog = true;
  }

  openNewChild(row: any) {
    debugger
    const parentNode = this.resolveTreeNode(row);
    if (!parentNode) return;
    if(!parentNode.data!.MCommonEntitiesMaster.IsActive){
        this.messageService.showMessage(
          'Parent menu must be active to add sub-items.',
          'Error',
          PopupMessageType.Error
        );
        return
    }
    this.selectedNode = parentNode;

    this.menuMappingForm.reset({
      MappingID: 0,
      MenuID: null,
      MenuName: '',
      MenuURL: '',
      Icon: '',
      MenuTypeID: 2, // child menu
      SiteAreaID: parentNode.data!.SiteAreaID,
      ParentID: parentNode.data!.MenuID, 
      MenuRank: (parentNode.children?.length || 0) + 1,
      MCommonEntitiesMaster: {
        IsActive: false
      }
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
      SiteAreaID: menuData.SiteAreaID,
      MenuTypeID: menuData.MenuTypeID,
      ParentID: menuData.ParentID,
      MenuRank: menuData.MenuRank,
      MCommonEntitiesMaster: {
        IsActive: menuData.MCommonEntitiesMaster.IsActive
      }
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
    if (Array.isArray(this.menuResources)) { 
        const selectedMenu = this.menuResources.find(m => m.MenuID === menuId);
        if (selectedMenu) {
            this.menuMappingForm.patchValue({
                  MenuName: selectedMenu.MenuName,
                  MenuURL: selectedMenu.MenuURL,
                  Icon: selectedMenu.Icon
                }, { emitEvent: false });
            }
    } else {
          console.error('menuResources is not an array in onMenuSelected');
    }
  }

  onMenuTypeChanged(menuType: number) {
    if (menuType === 1) {
      this.menuMappingForm.patchValue({ ParentID: 0 });
    }
  }

  saveMapping() {
    debugger;
    if (this.menuMappingForm.invalid) {
      this.markFormGroupTouched(this.menuMappingForm);
      return;
    }
     const outcome = this.FormUtils.validateFormFields(this.formFields, this.menuMappingForm, this.inputElements.toArray(), this.renderer);
    if (outcome.isError) {
      this.messageService.showMessage(outcome.strMessage, outcome.title, outcome.type);
      return;
    }  
    const menumappingModel = this.FormUtils.getAllFormFieldData(this.formFields, this.menuMappingForm, this.inputElements.toArray(), SaveMenuMappingRequest);
    this.saving = true;
    this.menuMappingService.SaveMenuMapping(menumappingModel).subscribe({
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
    const menuType = this.menuTypes.find(t => t.MenuTypeID === type);
    return menuType ? menuType.MenuTypeName : 'Unknown';
  }

  getMenuTypeIcon(type: number): string {
    const menuType = this.menuTypes.find(t => t.MenuTypeID === type);
    return menuType ? menuType.MenuTypeIcon : 'pi pi-question';
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
      menu.MenuName.toLowerCase().includes(query)
    );
  }

  applyFilters() {
    if (!this.menuMappings || this.menuMappings.length === 0) {
      this.filteredMenuMappings = [...this.menuMappings];
      return;
    }
    let filteredData = this.menuMappings;
    if (this.selectedMenuType !== null) {
      filteredData = this.filterTreeByType(filteredData, this.selectedMenuType);
    }
    if (this.selectedStatus !== null) {
      filteredData = this.filterTreeByStatus(filteredData, this.selectedStatus);
    }
    if (this.globalFilter.trim()) {
      filteredData = this.filterTreeByText(filteredData, this.globalFilter.trim());
    }
    
    this.filteredMenuMappings = filteredData;
  }

  private filterTreeByType(nodes: TreeNode<MMenuMappingMaster>[], menuType: number): TreeNode<MMenuMappingMaster>[] {
    return nodes.reduce((result: TreeNode<MMenuMappingMaster>[], node) => {
      if (node.data!.MenuTypeID === menuType) {
        result.push(node);
      } else if (node.children && node.children.length > 0) {
        const filteredChildren = this.filterTreeByType(node.children, menuType);
        if (filteredChildren.length > 0) {
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

  getSerialNumber(rowIndex: number): number {
    const first = this.tt?.first ?? 0;
    return first + rowIndex + 1;
  }
  exportToCSV() {
    this.exportToCSVCustom();
  }
  private exportToCSVCustom() {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ['Menu Name', 'URL', 'Type', 'Rank', 'Parent', 'Status', 'Level'];
    csvContent += headers.join(',') + '\n';
    const addNodeToCSV = (node: TreeNode<MMenuMappingMaster>, level: number) => {
      const row = [
        `"${node.data!.MenuName}"`,
        `"${node.data!.MenuURL || ''}"`,
        `"${this.getMenuTypeLabel(node.data!.MenuTypeID)}"`,
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
  toggleRow(node: TreeNode<MMenuMappingMaster>) {
    node.expanded = !node.expanded;
    this.filteredMenuMappings = [...this.filteredMenuMappings];
  }
}