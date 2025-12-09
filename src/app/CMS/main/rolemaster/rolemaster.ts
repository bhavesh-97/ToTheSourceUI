import { Component } from '@angular/core';
import { TableAction, TableComponent } from '../../../@theme/components/Table/table.component';
import { CommonModule } from '@angular/common';
import { SharedImports } from '../../../shared/imports/shared-imports';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { CustomTableState,TableConfig } from '../../../@theme/components/Table/table-config.interface';
@Component({
  selector: 'app-rolemaster',
  imports: [CommonModule,
            TableComponent,
            SharedImports,
            ButtonModule,
            TagModule,
            TableModule
    ],
  templateUrl: './rolemaster.html',
  styleUrl: './rolemaster.css'
})
export class Rolemaster {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active', role: 'Admin', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Active', role: 'User', joinDate: '2023-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 25, status: 'Inactive', role: 'User', joinDate: '2023-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 35, status: 'Active', role: 'Manager', joinDate: '2023-01-05' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 40, status: 'Pending', role: 'User', joinDate: '2023-04-01' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', age: 29, status: 'Active', role: 'Admin', joinDate: '2023-02-28' },
    { id: 7, name: 'Edward Norton', email: 'edward@example.com', age: 31, status: 'Inactive', role: 'User', joinDate: '2023-03-15' },
    { id: 8, name: 'Fiona Gallagher', email: 'fiona@example.com', age: 27, status: 'Active', role: 'User', joinDate: '2023-04-10' },
    { id: 9, name: 'George Miller', email: 'george@example.com', age: 38, status: 'Active', role: 'Manager', joinDate: '2023-01-25' },
    { id: 10, name: 'Helen Parker', email: 'helen@example.com', age: 33, status: 'Pending', role: 'User', joinDate: '2023-03-30' }
  ];

  // Table Configuration
 tableConfig: TableConfig = {
    columns: [
      { field: 'id', header: 'ID', sortable: true, filterable: true, width: '80px' },
      { field: 'name', header: 'Name', sortable: true, filterable: true },
      { field: 'email', header: 'Email', sortable: true, filterable: true },
      { field: 'age', header: 'Age', sortable: true, filterable: true, type: 'number', width: '100px' },
      { 
        field: 'status', 
        header: 'Status', 
        sortable: true, 
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Pending', value: 'Pending' }
        ]
      },
      { 
        field: 'role', 
        header: 'Role', 
        sortable: true, 
        filterable: true,
        filterType: 'multiselect',
        filterOptions: [
          { label: 'Admin', value: 'Admin' },
          { label: 'Manager', value: 'Manager' },
          { label: 'User', value: 'User' }
        ]
      },
      { field: 'joinDate', header: 'Join Date', sortable: true, filterable: true, type: 'date' }
    ],
    rows: 10,
    rowsPerPageOptions: [5, 10, 20, 50],
    paginator: true,
    selectionMode: 'multiple',
    dataKey: 'id',
    loading: false,
    resizableColumns: true,
    reorderableColumns: true,
    stripedRows: true,
    bordered: true,
    exportable: true,
    printable: true,
    printTitle: 'Users Report',
    scrollable: false,
    size: 'normal'
  };
  // Row Actions
  rowActions: TableAction[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      severity: 'primary',
      command: (row) => this.editUser(row)
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      severity: 'danger',
      command: (row) => this.deleteUser(row)
    },
    {
      label: 'View Details',
      icon: 'pi pi-eye',
      severity: 'info',
      command: (row) => this.viewUserDetails(row)
    }
  ];

  // Bulk Actions
  bulkActions: TableAction[] = [
    {
      label: 'Delete Selected',
      icon: 'pi pi-trash',
      severity: 'danger',
      command: (selectedItems) => this.deleteSelectedUsers(selectedItems),
      disabled: (selectedItems) => !selectedItems || selectedItems.length === 0
    },
    {
      label: 'Export Selected',
      icon: 'pi pi-download',
      severity: 'success',
      command: (selectedItems) => this.exportSelectedUsers(selectedItems),
      disabled: (selectedItems) => !selectedItems || selectedItems.length === 0
    },
    {
      label: 'Activate Selected',
      icon: 'pi pi-check',
      severity: 'primary',
      command: (selectedItems) => this.activateSelectedUsers(selectedItems),
      disabled: (selectedItems) => !selectedItems || selectedItems.length === 0
    }
  ];

  // Event Handlers
  onRowClick(row: any): void {
    console.log('Row clicked:', row);
    // You can navigate to detail view or open a modal
  }

  onSelectionChange(selection: any[]): void {
    console.log('Selection changed:', selection);
    // Handle selection changes
  }

  // Action Methods
  editUser(user: any): void {
    console.log('Edit user:', user);
    alert(`Editing user: ${user.name}`);
    // Implement edit logic
  }

  deleteUser(user: any): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      console.log('Delete user:', user);
      // Remove from array
      this.users = this.users.filter(u => u.id !== user.id);
    }
  }

  viewUserDetails(user: any): void {
    console.log('View user details:', user);
    // Open modal or navigate to details page
  }

  deleteSelectedUsers(selectedUsers: any[]): void {
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      const idsToDelete = selectedUsers.map(user => user.id);
      this.users = this.users.filter(user => !idsToDelete.includes(user.id));
      console.log('Deleted selected users:', selectedUsers);
    }
  }

  exportSelectedUsers(selectedUsers: any[]): void {
    console.log('Exporting selected users:', selectedUsers);
    // Implement export logic
  }

  activateSelectedUsers(selectedUsers: any[]): void {
    selectedUsers.forEach(user => {
      user.status = 'Active';
    });
    console.log('Activated selected users:', selectedUsers);
  }
    // Custom template for stock
  getStockSeverity(stock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock < 10) return 'stock-low';
    if (stock < 30) return 'stock-medium';
    return 'stock-high';
  }

  getStatusSeverity(status: string): string {
    switch(status) {
      case 'In Stock': return 'success';
      case 'Low Stock': return 'warning';
      case 'Out of Stock': return 'danger';
      default: return 'info';
    }
  }

  addToCart(product: any): void {
    console.log('Added to cart:', product);
    alert(`Added ${product.name} to cart!`);
  }

  addToWishlist(product: any): void {
    console.log('Added to wishlist:', product);
    alert(`Added ${product.name} to wishlist!`);
  }
}
