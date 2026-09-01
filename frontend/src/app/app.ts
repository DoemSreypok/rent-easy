import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, HealthResponse, RentalItem } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { FavoritesService } from './services/favorites.service';
import { HomepagePreviewComponent } from './components/homepage-preview/homepage-preview.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { AdminPortalComponent } from './components/admin-portal/admin-portal.component';
import { OwnerPortalComponent } from './components/owner-portal/owner-portal.component';
import { TenantPortalComponent } from './components/tenant-portal/tenant-portal.component';
import { ActiveTenancyComponent } from './components/active-tenancy/active-tenancy.component';
import { PropertyListing, AppNotification } from './models/flowchart.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HomepagePreviewComponent,
    AuthModalComponent,
    AdminPortalComponent,
    OwnerPortalComponent,
    TenantPortalComponent,
    ActiveTenancyComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  favoritesService = inject(FavoritesService);

  // Active Main Navigation View
  activeView = signal<'explore' | 'tenant-portal' | 'owner-portal' | 'admin-portal' | 'active-tenancy' | 'database'>('explore');

  // User Dropdown & Notifications State
  showUserDropdown = signal<boolean>(false);
  showNotificationsDropdown = signal<boolean>(false);
  notificationsList = signal<AppNotification[]>([]);
  unreadNotificationsCount = signal<number>(0);

  // Auth Modal State
  showAuthModal = signal<boolean>(false);
  authModalDefaultMode = signal<'login' | 'register' | 'forgot'>('login');
  authModalDefaultRole = signal<'TENANT' | 'LANDLORD' | 'ADMIN' | 'tenant' | 'owner'>('TENANT');
  pendingFavoriteProperty = signal<PropertyListing | null>(null);
  appToast = signal<string | null>(null);

  // Backend Health & Connection
  backendStatus = signal<HealthResponse | null>(null);
  isConnected = signal<boolean>(false);
  isDbConnected = signal<boolean>(false);
  connectionError = signal<string | null>(null);
  seedStatus = signal<string | null>(null);

  // Registered Users in MongoDB
  registeredUsers = signal<any[]>([]);

  // Generic Items for Backend Health DB testing
  items = signal<RentalItem[]>([]);
  newItem = {
    title: '',
    description: '',
    category: 'Apartment',
    price: 2500
  };
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.checkBackendHealth();
    this.loadRegisteredUsers();
    this.loadNotifications();
  }

  checkBackendHealth(): void {
    this.apiService.checkHealth().subscribe({
      next: (res) => {
        this.backendStatus.set(res);
        this.isConnected.set(true);
        this.isDbConnected.set(res.database === 'connected');
        this.connectionError.set(null);
      },
      error: (err) => {
        this.isConnected.set(false);
        this.isDbConnected.set(false);
        this.connectionError.set(
          err.status === 0
            ? 'Cannot connect to backend server. Make sure it is running on http://localhost:5001'
            : err.message || 'Error connecting to backend'
        );
      }
    });
  }

  refreshAll(): void {
    this.checkBackendHealth();
    this.loadRegisteredUsers();
    this.loadDbItems();
    this.loadNotifications();
  }

  loadNotifications(): void {
    if (!this.authService.isLoggedIn()) return;
    this.apiService.getNotifications().subscribe({
      next: (res) => {
        if (res?.data) {
          this.notificationsList.set(res.data.notifications || []);
          this.unreadNotificationsCount.set(res.data.unreadCount || 0);
        }
      },
      error: () => {}
    });
  }

  toggleNotificationsDropdown(): void {
    this.showNotificationsDropdown.update(v => !v);
    this.showUserDropdown.set(false);
    if (this.showNotificationsDropdown()) {
      this.loadNotifications();
    }
  }

  markNotificationAsRead(notif: AppNotification): void {
    if (!notif._id || notif.isRead) return;
    this.apiService.markNotificationAsRead(notif._id).subscribe({
      next: () => {
        notif.isRead = true;
        this.unreadNotificationsCount.update(c => Math.max(0, c - 1));
      }
    });
  }

  markAllNotificationsRead(): void {
    this.apiService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.notificationsList.update(list => list.map(n => ({ ...n, isRead: true })));
        this.unreadNotificationsCount.set(0);
      }
    });
  }

  loadRegisteredUsers(): void {
    this.apiService.getUsers().subscribe({
      next: (res) => {
        const users = (res.data && res.data.users) ? res.data.users : (Array.isArray(res.data) ? res.data : []);
        this.registeredUsers.set(users);
      },
      error: () => {}
    });
  }

  onDeleteUser(id?: string): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this user from MongoDB?')) return;
    this.apiService.deleteUser(id).subscribe({
      next: () => {
        this.registeredUsers.update(prev => prev.filter(u => u._id !== id));
      },
      error: (err) => alert('Error deleting user: ' + err.message)
    });
  }

  onSeedDatabase(): void {
    this.isLoading.set(true);
    this.seedStatus.set('Seeding MongoDB database with rich RentEasy records (Admin, Landlord, Tenant, 7 Properties, Rooms, Contracts, Payments, Maintenance)...');
    this.apiService.seedDatabase().subscribe({
      next: () => {
        this.seedStatus.set('🎉 MongoDB Seeded Successfully! (Admin, Landlord, 2 Tenants, 7 Properties, 21 Rooms, Contracts, Payments, Maintenance Tickets)');
        this.refreshAll();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.seedStatus.set('❌ Error seeding database: ' + (err.error?.message || err.message));
        this.isLoading.set(false);
      }
    });
  }

  loadDbItems(): void {
    this.isLoading.set(true);
    this.apiService.getItems().subscribe({
      next: (res) => {
        this.items.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onAddItem(): void {
    if (!this.newItem.title.trim()) return;
    this.isLoading.set(true);
    this.apiService.addItem(this.newItem).subscribe({
      next: (res) => {
        this.items.update((prev) => [res.data, ...prev]);
        this.newItem = { title: '', description: '', category: 'Apartment', price: 2500 };
        this.isLoading.set(false);
      },
      error: (err) => {
        alert('Error adding item: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  onDeleteItem(id?: string): void {
    if (!id) return;
    this.apiService.deleteItem(id).subscribe({
      next: () => {
        this.items.update((prev) => prev.filter((item) => item._id !== id));
      },
      error: (err) => alert('Error deleting item: ' + err.message)
    });
  }

  // Auth Actions
  openLogin(): void {
    this.authModalDefaultMode.set('login');
    this.showAuthModal.set(true);
  }

  openRegister(role: 'TENANT' | 'LANDLORD' | 'ADMIN' | 'tenant' | 'owner' = 'TENANT'): void {
    this.authModalDefaultMode.set('register');
    this.authModalDefaultRole.set(role);
    this.showAuthModal.set(true);
  }

  handleRequestAuth(event?: { defaultMode?: 'login' | 'register'; defaultRole?: 'TENANT' | 'LANDLORD' | 'ADMIN' | 'tenant' | 'owner'; nextAction?: string; property?: PropertyListing } | any): void {
    if (event) {
      if (event.defaultMode) this.authModalDefaultMode.set(event.defaultMode);
      if (event.defaultRole) this.authModalDefaultRole.set(event.defaultRole);
      if (event.property) {
        this.pendingFavoriteProperty.set(event.property);
      } else {
        this.pendingFavoriteProperty.set(null);
      }
    } else {
      this.authModalDefaultMode.set('login');
      this.authModalDefaultRole.set('TENANT');
      this.pendingFavoriteProperty.set(null);
    }
    this.showAuthModal.set(true);
  }

  handleAuthSuccess(): void {
    this.loadRegisteredUsers();
    this.loadNotifications();

    // Check if user was trying to favorite a property before signing in
    const pendingProp = this.pendingFavoriteProperty();
    if (pendingProp) {
      const propId = pendingProp._id || pendingProp.id || pendingProp.title;
      this.favoritesService.addFavorite(propId);
      this.pendingFavoriteProperty.set(null);
      this.showToast(`🎉 Signed in successfully! Saved "${pendingProp.title}" to your Saved Homes! ❤️`);
      this.switchView('explore', 'search-results');
      return;
    }

    if (this.authService.isAdmin()) {
      this.activeView.set('admin-portal');
      this.showToast(`👑 Welcome Administrator! System control panel ready.`);
    } else if (this.authService.isLandlord()) {
      this.activeView.set('owner-portal');
      this.showToast(`🟣 Welcome Landlord! Portfolio dashboard ready.`);
    } else {
      this.activeView.set('tenant-portal');
      this.showToast(`🟢 Welcome Tenant! Rental hub ready.`);
    }
  }

  showToast(msg: string): void {
    this.appToast.set(msg);
    setTimeout(() => {
      this.appToast.set(null);
    }, 4500);
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(v => !v);
    this.showNotificationsDropdown.set(false);
  }

  closeUserDropdown(): void {
    this.showUserDropdown.set(false);
    this.showNotificationsDropdown.set(false);
  }

  switchView(view: 'explore' | 'tenant-portal' | 'owner-portal' | 'admin-portal' | 'active-tenancy' | 'database', sectionId?: string): void {
    this.activeView.set(view);
    this.showUserDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    if (sectionId && view === 'explore') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }

  logout(): void {
    this.authService.logout();
    this.showUserDropdown.set(false);
    this.showNotificationsDropdown.set(false);
    this.activeView.set('explore');
    this.showToast('You have been logged out.');
  }

  handleHomepageJourneyTransition(event: any): void {
    if (event?.role === 'owner' || event?.role === 'landlord') {
      if (!this.authService.isLoggedIn()) {
        this.openRegister('LANDLORD');
      } else {
        this.activeView.set('owner-portal');
      }
    } else {
      this.activeView.set('tenant-portal');
    }
  }

  handleNavFavoritesClick(): void {
    if (!this.authService.isLoggedIn()) {
      this.authModalDefaultMode.set('login');
      this.authModalDefaultRole.set('TENANT');
      this.showAuthModal.set(true);
      return;
    }

    if (this.authService.isTenant()) {
      this.activeView.set('tenant-portal');
    } else {
      this.switchView('explore', 'search-results');
    }
  }
}
