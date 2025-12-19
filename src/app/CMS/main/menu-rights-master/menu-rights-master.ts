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

  @ViewChild('tt') tt!: TreeTable;

  /* ---------------------------------
     Dropdowns (Selection Only)
  ----------------------------------*/
  roles = [
    { label: 'Admin', value: 1 },
    { label: 'HR Manager', value: 2 }
  ];

  admins = [
    { label: 'Robert Fox', value: 1 },
    { label: 'Cody Fisher', value: 2 }
  ];

  selectedRole: any = null;
  selectedAdmin: any = null;

  /* ---------------------------------
     Tree Data
  ----------------------------------*/
  menuMappings: TreeNode<MMenuRightsMaster>[] = [];
  filteredMenuMappings: TreeNode<MMenuRightsMaster>[] = [];

  globalFilter: string = '';

  constructor(private messageService: MessageService) {}

  /* ---------------------------------
     INIT
  ----------------------------------*/
  ngOnInit(): void {
    this.loadMenuTree();
  }

  /* ---------------------------------
     MOCK / API DATA LOAD
     (Replace with API later)
  ----------------------------------*/
  loadMenuTree(): void {
   const rawMenus: MMenuRightsMaster[] = [
  {
    MappingID: 1,
    MenuID: 1,
    RoleID: 1,
    AdminID: 0,
    EntityID: 1,
    EntityType: 'Role',
    MRights: {
      CanView: true,
      CanInsert: true,
      CanUpdate: false,
      CanDelete: false
    },
    MMenuMappingMaster: {
      MappingID: 1,
      MenuID: 1,
      MenuName: 'Inventory',
      MenuURL: '/inventory',
      Icon: 'pi pi-box',
      MenuTypeID: 1,
      MenuTypeCode: 'MAIN',
      MenuTypeName: 'Main Menu',
      MenuRank: 1,
      ParentID: 0,
      ParentMenuName: '',
      ParentMenuURL: '',
      ParentMenuIcon: '',
      SiteAreaID: 1,
      AreaName: 'Operations',
      MCommonEntitiesMaster: {
        IsActive: true
      } as MCommonEntitiesMaster
    },
    MCommonEntitiesMaster: {
      IsActive: true
    } as MCommonEntitiesMaster
  },

  {
    MappingID: 2,
    MenuID: 2,
    RoleID: 1,
    AdminID: 0,
    EntityID: 1,
    EntityType: 'Role',
    MRights: {
      CanView: true,
      CanInsert: false,
      CanUpdate: false,
      CanDelete: false
    },
    MMenuMappingMaster: {
      MappingID: 2,
      MenuID: 2,
      MenuName: 'Stock Entry',
      MenuURL: '/inventory/stock-entry',
      Icon: 'pi pi-database',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 1,
      ParentID: 1,
      ParentMenuName: 'Inventory',
      ParentMenuURL: '/inventory',
      ParentMenuIcon: 'pi pi-box',
      SiteAreaID: 1,
      AreaName: 'Operations',
      MCommonEntitiesMaster: {
        IsActive: true
      } as MCommonEntitiesMaster
    },
    MCommonEntitiesMaster: {
      IsActive: true
    } as MCommonEntitiesMaster
  },

  {
    MappingID: 3,
    MenuID: 3,
    RoleID: 1,
    AdminID: 0,
    EntityID: 1,
    EntityType: 'Role',
    MRights: {
      CanView: true,
      CanInsert: true,
      CanUpdate: true,
      CanDelete: false
    },
    MMenuMappingMaster: {
      MappingID: 3,
      MenuID: 3,
      MenuName: 'Warehouse Transfer',
      MenuURL: '/inventory/warehouse-transfer',
      Icon: 'pi pi-send',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 2,
      ParentID: 1,
      ParentMenuName: 'Inventory',
      ParentMenuURL: '/inventory',
      ParentMenuIcon: 'pi pi-box',
      SiteAreaID: 1,
      AreaName: 'Operations',
      MCommonEntitiesMaster: {
        IsActive: true
      } as MCommonEntitiesMaster
    },
    MCommonEntitiesMaster: {
      IsActive: true
    } as MCommonEntitiesMaster
  },

  {
    MappingID: 4,
    MenuID: 4,
    RoleID: 1,
    AdminID: 0,
    EntityID: 1,
    EntityType: 'Role',
    MRights: {
      CanView: true,
      CanInsert: false,
      CanUpdate: false,
      CanDelete: false
    },
    MMenuMappingMaster: {
      MappingID: 4,
      MenuID: 4,
      MenuName: 'Reports',
      MenuURL: '/reports',
      Icon: 'pi pi-chart-line',
      MenuTypeID: 1,
      MenuTypeCode: 'MAIN',
      MenuTypeName: 'Main Menu',
      MenuRank: 2,
      ParentID: 0,
      ParentMenuName: '',
      ParentMenuURL: '',
      ParentMenuIcon: '',
      SiteAreaID: 2,
      AreaName: 'Analytics',
      MCommonEntitiesMaster: {
        IsActive: true
      } as MCommonEntitiesMaster
    },
    MCommonEntitiesMaster: {
      IsActive: true
    } as MCommonEntitiesMaster
  },

  {
    MappingID: 5,
    MenuID: 5,
    RoleID: 1,
    AdminID: 0,
    EntityID: 1,
    EntityType: 'Role',
    MRights: {
      CanView: true,
      CanInsert: false,
      CanUpdate: false,
      CanDelete: false
    },
    MMenuMappingMaster: {
      MappingID: 5,
      MenuID: 5,
      MenuName: 'Sales Analysis',
      MenuURL: '/reports/sales-analysis',
      Icon: 'pi pi-chart-bar',
      MenuTypeID: 2,
      MenuTypeCode: 'SUB',
      MenuTypeName: 'Sub Menu',
      MenuRank: 1,
      ParentID: 4,
      ParentMenuName: 'Reports',
      ParentMenuURL: '/reports',
      ParentMenuIcon: 'pi pi-chart-line',
      SiteAreaID: 2,
      AreaName: 'Analytics',
      MCommonEntitiesMaster: {
        IsActive: true
      } as MCommonEntitiesMaster
    },
    MCommonEntitiesMaster: {
      IsActive: true
    } as MCommonEntitiesMaster
  }
];

    this.menuMappings = this.buildTree(rawMenus);
    this.filteredMenuMappings = [...this.menuMappings];
  }

  /* ---------------------------------
     TREE BUILD
  ----------------------------------*/
  private buildTree(data: MMenuRightsMaster[]): TreeNode<MMenuRightsMaster>[] {
    const map = new Map<number, TreeNode<MMenuRightsMaster>>();
    const roots: TreeNode<MMenuRightsMaster>[] = [];

    data.forEach(menu => {
      map.set(menu.MenuID, {
        key: menu.MenuID.toString(),
        data: {
          ...menu,
          MRights: new MRights()
        },
        children: [],
        expanded: false
      });
    });

    data.forEach(menu => {
      const node = map.get(menu.MenuID)!;
      if (!menu.MMenuMappingMaster.ParentID || menu.MMenuMappingMaster.ParentID === 0) {
        roots.push(node);
      } else {
        const parent = map.get(menu.MMenuMappingMaster.ParentID);
        parent ? parent.children!.push(node) : roots.push(node);
      }
    });

    return roots;
  }

  /* ---------------------------------
     GLOBAL FILTER
  ----------------------------------*/
  onGlobalFilter(event: Event): void {
    this.globalFilter = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredMenuMappings = this.filterTree(this.menuMappings, this.globalFilter);
  }

  private filterTree(nodes: TreeNode<MMenuRightsMaster>[], text: string): TreeNode<MMenuRightsMaster>[] {
    if (!text) return [...nodes];

    return nodes.reduce((result: TreeNode<MMenuRightsMaster>[], node) => {
      const matches = node.data!.MMenuMappingMaster.MenuName.toLowerCase().includes(text);
      const children = node.children ? this.filterTree(node.children, text) : [];

      if (matches || children.length) {
        result.push({ ...node, children });
      }
      return result;
    }, []);
  }

  clearFilters(): void {
    this.globalFilter = '';
    this.filteredMenuMappings = [...this.menuMappings];
  }

  /* ---------------------------------
     RIGHTS TOGGLING
  ----------------------------------*/
  toggleNode(node: TreeNode<MMenuRightsMaster>, right: keyof MRights, value: boolean): void {
    node.data!.MRights[right] = value;
    this.propagateDown(node, right, value);
    this.syncUp(node.parent, right);
  }

  private propagateDown(node: TreeNode<MMenuRightsMaster>, right: keyof MRights, value: boolean): void {
    if (!node.children) return;
    for (const child of node.children) {
      child.data!.MRights[right] = value;
      this.propagateDown(child, right, value);
    }
  }

  private syncUp(node: TreeNode<MMenuRightsMaster> | undefined, right: keyof MRights): void {
    if (!node || !node.children) return;

    node.data!.MRights[right] =
      node.children.every(c => c.data!.MRights[right]);

    this.syncUp(node.parent, right);
  }

  /* ---------------------------------
     EXPAND / COLLAPSE
  ----------------------------------*/
  expandAll(): void {
    this.setExpanded(this.menuMappings, true);
  }

  collapseAll(): void {
    this.setExpanded(this.menuMappings, false);
  }

  private setExpanded(nodes: TreeNode<MMenuRightsMaster>[], state: boolean): void {
    nodes.forEach(node => {
      node.expanded = state;
      if (node.children?.length) {
        this.setExpanded(node.children, state);
      }
    });
    this.filteredMenuMappings = [...this.filteredMenuMappings];
  }

  /* ---------------------------------
     SERIAL NUMBER
  ----------------------------------*/
  getNodeIndex(rowNode: any): number {
    const visible: TreeNode[] = [];
    const walk = (nodes: TreeNode[]) => {
      nodes.forEach(n => {
        visible.push(n);
        if (n.expanded && n.children?.length) walk(n.children);
      });
    };
    walk(this.filteredMenuMappings);
    return visible.findIndex(n => n.key === rowNode.key) + 1;
  }

  /* ---------------------------------
     SAVE
  ----------------------------------*/
  savePermissions(): void {
    const payload: MMenuRightsMaster[] = [];

    const walk = (node: TreeNode<MMenuRightsMaster>) => {
      payload.push({
        MappingID: 0,
        MenuID: node.data!.MenuID,
        RoleID: this.selectedRole?.value || 0,
        AdminID: this.selectedAdmin?.value || 0,
        EntityID: this.selectedRole?.value || this.selectedAdmin?.value,
        EntityType: this.selectedRole ? 'Role' : 'Admin',
        MRights: node.data!.MRights,
        MMenuMappingMaster: node.data!.MMenuMappingMaster,
        MCommonEntitiesMaster: new MCommonEntitiesMaster()
      });

      node.children?.forEach(walk);
    };

    this.filteredMenuMappings.forEach(walk);

    console.log('SAVE PAYLOAD', payload);

    this.messageService.add({
      severity: 'success',
      summary: 'Saved',
      detail: 'Menu rights updated successfully'
    });
  }
}