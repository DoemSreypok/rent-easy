import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {
  AdminDashboardStats,
  User,
  PropertyListing,
  RentalContract,
  PaymentRecord
} from '../../models/flowchart.model';

@Component({
  selector: 'app-admin-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-portal.component.html',
  styleUrls: ['./admin-portal.component.scss']
})
export class AdminPortalComponent implements OnInit {
  private apiService = inject(ApiService);
  public authService = inject(AuthService);

  activeTab = signal<'overview' | 'users' | 'properties' | 'contracts' | 'payments' | 'reports'>('overview');
  loading = signal<boolean>(false);
  actionMessage = signal<{ text: string; type: 'success' | 'error' } | null>(null);

  // Dashboard Metrics
  stats = signal<AdminDashboardStats>({
    totalUsers: 4,
    totalLandlords: 1,
    totalTenants: 2,
    totalProperties: 7,
    pendingProperties: 0,
    totalRooms: 21,
    availableRooms: 14,
    rentedRooms: 7,
    activeContracts: 2,
    totalRevenue: 18600,
    monthlyRevenue: 14850,
    maintenanceTickets: 2
  });

  // Users State
  usersList = signal<User[]>([]);
  userSearch = signal<string>('');
  userRoleFilter = signal<string>('ALL');

  // Properties State
  propertiesList = signal<PropertyListing[]>([]);
  propertyStatusFilter = signal<string>('ALL');

  // Contracts & Payments State
  contractsList = signal<RentalContract[]>([]);
  paymentsList = signal<PaymentRecord[]>([]);

  // User Modal State
  isCreateUserModalOpen = signal<boolean>(false);
  newUser = {
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'TENANT' as 'ADMIN' | 'LANDLORD' | 'TENANT',
    employment: '',
    annualIncome: ''
  };

  // Filtered Users
  filteredUsers = computed(() => {
    let list = this.usersList();
    const search = this.userSearch().toLowerCase();
    const role = this.userRoleFilter();

    if (search) {
      list = list.filter(u =>
        (u.fullName || u.name || '').toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        (u.phone || '').includes(search)
      );
    }

    if (role !== 'ALL') {
      list = list.filter(u => (u.role || '').toUpperCase() === role.toUpperCase());
    }

    return list;
  });

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading.set(true);

    // 1. Fetch Stats
    this.apiService.getAdminStats().subscribe({
      next: (res) => {
        if (res.data) this.stats.set(res.data);
      },
      error: () => {}
    });

    // 2. Fetch Users
    this.apiService.getUsers().subscribe({
      next: (res) => {
        if (res.data?.users) {
          this.usersList.set(res.data.users);
        }
      },
      error: () => {}
    });

    // 3. Fetch Properties
    this.apiService.getProperties().subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.propertiesList.set(res.data);
        }
      },
      error: () => {}
    });

    // 4. Fetch Contracts
    this.apiService.getContracts().subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.contractsList.set(res.data);
        }
      },
      error: () => {}
    });

    // 5. Fetch Payments
    this.apiService.getPayments().subscribe({
      next: (res) => {
        if (Array.isArray(res.data)) {
          this.paymentsList.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  // User Actions
  toggleUserStatus(user: User): void {
    if (!user._id) return;
    this.apiService.toggleUserStatus(user._id).subscribe({
      next: (res) => {
        this.showToast(`User ${user.fullName || user.email} status updated to ${res.data?.user?.status || 'Active'}.`, 'success');
        this.loadAllData();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to update user status.', 'error')
    });
  }

  deleteUser(user: User): void {
    if (!user._id) return;
    if (!confirm(`Are you sure you want to delete user ${user.fullName || user.email}?`)) return;

    this.apiService.deleteUser(user._id).subscribe({
      next: () => {
        this.showToast(`User ${user.fullName || user.email} removed.`, 'success');
        this.loadAllData();
      },
      error: (err) => this.showToast(err.error?.message || 'Failed to delete user.', 'error')
    });
  }

  submitCreateUser(): void {
    if (!this.newUser.fullName || !this.newUser.email || !this.newUser.password) {
      this.showToast('Please fill in name, email, and password.', 'error');
      return;
    }

    this.apiService.createUser(this.newUser).subscribe({
      next: () => {
        this.showToast(`Account created for ${this.newUser.fullName} (${this.newUser.role}).`, 'success');
        this.isCreateUserModalOpen.set(false);
        this.newUser = {
          fullName: '',
          email: '',
          phone: '',
          password: '',
          role: 'TENANT',
          employment: '',
          annualIncome: ''
        };
        this.loadAllData();
      },
      error: (err) => this.showToast(err.error?.message || 'Error creating user.', 'error')
    });
  }

  // Property Actions
  approveProperty(prop: PropertyListing): void {
    const id = prop._id || prop.id;
    if (!id) return;

    this.apiService.approveProperty(id).subscribe({
      next: () => {
        this.showToast(`"${prop.title || prop.name}" has been approved.`, 'success');
        this.loadAllData();
      },
      error: (err) => this.showToast(err.error?.message || 'Error approving property.', 'error')
    });
  }

  rejectProperty(prop: PropertyListing): void {
    const id = prop._id || prop.id;
    if (!id) return;

    this.apiService.rejectProperty(id).subscribe({
      next: () => {
        this.showToast(`"${prop.title || prop.name}" status set to Rejected.`, 'success');
        this.loadAllData();
      },
      error: (err) => this.showToast(err.error?.message || 'Error rejecting property.', 'error')
    });
  }

  deleteProperty(prop: PropertyListing): void {
    const id = prop._id || prop.id;
    if (!id) return;
    if (!confirm(`Delete listing "${prop.title || prop.name}"?`)) return;

    this.apiService.deleteProperty(id).subscribe({
      next: () => {
        this.showToast(`Property deleted.`, 'success');
        this.loadAllData();
      },
      error: (err) => this.showToast(err.error?.message || 'Error deleting property.', 'error')
    });
  }

  // Payment Confirmation Action
  confirmPayment(payment: PaymentRecord): void {
    if (!payment._id) return;
    this.apiService.confirmPayment(payment._id).subscribe({
      next: () => {
        this.showToast(`Payment of $${payment.amount} verified! Receipt generated.`, 'success');
        this.loadAllData();
      },
      error: (err) => this.showToast(err.error?.message || 'Error verifying payment.', 'error')
    });
  }

  getPropertyTitle(ctr: any): string {
    if (!ctr) return 'Rental Unit';
    if (ctr.propertyId && typeof ctr.propertyId === 'object') {
      return ctr.propertyId.title || ctr.propertyId.name || 'Property Unit';
    }
    return 'Property Unit';
  }

  private showToast(text: string, type: 'success' | 'error' = 'success'): void {
    this.actionMessage.set({ text, type });
    setTimeout(() => this.actionMessage.set(null), 4000);
  }
}
