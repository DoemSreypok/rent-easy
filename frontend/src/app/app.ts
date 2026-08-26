import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, HealthResponse, RentalItem } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { FavoritesService } from './services/favorites.service';
import { HomepagePreviewComponent } from './components/homepage-preview/homepage-preview.component';
import { JourneySimulatorComponent } from './components/journey-simulator/journey-simulator.component';
import { AuthModalComponent } from './components/auth-modal/auth-modal.component';
import { PropertyListing } from './models/flowchart.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HomepagePreviewComponent,
    JourneySimulatorComponent,
    AuthModalComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  favoritesService = inject(FavoritesService);

  // Active Main Navigation View
  activeView = signal<'explore' | 'tenant-portal' | 'owner-portal' | 'active-tenancy' | 'database'>('explore');

  // User Dropdown State
  showUserDropdown = signal<boolean>(false);

  // Auth Modal State
  showAuthModal = signal<boolean>(false);
  authModalDefaultMode = signal<'login' | 'register'>('login');
  authModalDefaultRole = signal<'tenant' | 'owner'>('tenant');

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
  }

  loadRegisteredUsers(): void {
    this.apiService.getUsers().subscribe({
      next: (res) => {
        this.registeredUsers.set(res.data || []);
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
    this.seedStatus.set('Seeding MongoDB database with rich RentEasy records...');
    this.apiService.seedDatabase().subscribe({
      next: () => {
        this.seedStatus.set('🎉 MongoDB Seeded Successfully! (Users, 6 Properties, 2 Applications, 2 Bookings, 2 Maintenance Tickets, 3 Messages, 3 Items)');
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

  openRegister(role: 'tenant' | 'owner' = 'tenant'): void {
    this.authModalDefaultMode.set('register');
    this.authModalDefaultRole.set(role);
    this.showAuthModal.set(true);
  }

  handleRequestAuth(event?: { defaultMode?: 'login' | 'register'; defaultRole?: 'tenant' | 'owner'; nextAction?: string } | any): void {
    if (event) {
      if (event.defaultMode) this.authModalDefaultMode.set(event.defaultMode);
      if (event.defaultRole) this.authModalDefaultRole.set(event.defaultRole);
    } else {
      this.authModalDefaultMode.set('login');
      this.authModalDefaultRole.set('tenant');
    }
    this.showAuthModal.set(true);
  }

  handleAuthSuccess(): void {
    this.loadRegisteredUsers();
    if (this.authService.isOwner()) {
      this.activeView.set('owner-portal');
    } else {
      this.activeView.set('tenant-portal');
    }
  }

  toggleUserDropdown(): void {
    this.showUserDropdown.update(v => !v);
  }

  closeUserDropdown(): void {
    this.showUserDropdown.set(false);
  }

  switchView(view: 'explore' | 'tenant-portal' | 'owner-portal' | 'active-tenancy' | 'database', sectionId?: string): void {
    this.activeView.set(view);
    this.showUserDropdown.set(false);
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
    this.activeView.set('explore');
  }

  handleHomepageJourneyTransition(event: { role: 'tenant' | 'owner'; step?: string; property?: PropertyListing }): void {
    if (event.role === 'owner') {
      if (!this.authService.isLoggedIn()) {
        this.openRegister('owner');
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
      this.authModalDefaultRole.set('tenant');
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
