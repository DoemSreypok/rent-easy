import { Component, OnInit, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import {
  PropertyListing,
  RentalApplication,
  ViewingBooking,
  MaintenanceTicket,
  ChatMessage
} from '../../models/flowchart.model';

@Component({
  selector: 'app-tenant-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tenant-portal.component.html',
  styleUrls: ['./tenant-portal.component.scss']
})
export class TenantPortalComponent implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);
  favoritesService = inject(FavoritesService);

  onRequestAuth = output<{ defaultMode?: 'login' | 'register'; defaultRole?: 'tenant' | 'owner' }>();

  // Tenant Tab Navigation (Saved Homes | Bookings | Applications | My Rental | Messages)
  tenantNavTab = signal<'saved' | 'bookings' | 'applications' | 'my-rental' | 'messages'>('saved');

  // Data Signals
  propertiesList = signal<PropertyListing[]>([]);
  savedProperties = signal<PropertyListing[]>([]);
  applications = signal<RentalApplication[]>([]);
  bookings = signal<ViewingBooking[]>([]);
  maintenanceTickets = signal<MaintenanceTicket[]>([]);
  messages = signal<ChatMessage[]>([]);

  // Maintenance & Rental
  newMaintIssue = signal<string>('');
  newMaintUrgency = signal<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');
  newMessageText = signal<string>('');
  activeRentalProperty = signal<PropertyListing | null>(null);

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.apiService.getProperties().subscribe(res => {
      this.propertiesList.set(res.data);
      this.refreshSavedHomes(res.data);
      if (res.data.length > 0) {
        this.activeRentalProperty.set(res.data[0]);
      }
    });

    this.apiService.getApplications().subscribe(res => this.applications.set(res.data));
    this.apiService.getBookings().subscribe(res => this.bookings.set(res.data));
    this.apiService.getMaintenance().subscribe(res => this.maintenanceTickets.set(res.data));
    this.apiService.getMessages().subscribe(res => this.messages.set(res.data));
  }

  refreshSavedHomes(allProps: PropertyListing[]): void {
    const ids = this.favoritesService.savedPropertyIds();
    const matched = allProps.filter(p => ids.has(p._id || p.id || p.title));
    this.savedProperties.set(matched);
  }

  removeFavorite(prop: PropertyListing): void {
    const propId = prop._id || prop.id || prop.title;
    this.favoritesService.removeFavorite(propId);
    this.savedProperties.update(list => list.filter(p => (p._id || p.id || p.title) !== propId));
  }

  openLoginModal(role: 'tenant' | 'owner'): void {
    this.onRequestAuth.emit({ defaultMode: 'login', defaultRole: role });
  }

  submitMaintenanceTicket(): void {
    if (!this.newMaintIssue().trim()) return;

    this.apiService.createMaintenanceTicket({
      propertyTitle: this.activeRentalProperty()?.title || 'The Peak Luxury Riverview Penthouse',
      unit: 'Penthouse #42B',
      issue: this.newMaintIssue().trim(),
      urgency: this.newMaintUrgency(),
      technician: 'Assigned: Heng Dara (Senior HVAC Tech)',
      status: 'In Progress'
    }).subscribe({
      next: (res) => {
        this.maintenanceTickets.update(list => [res.data, ...list]);
        this.newMaintIssue.set('');
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessageText().trim()) return;

    const payload: Partial<ChatMessage> = {
      sender: this.authService.currentUser()?.name || 'Sophie Taylor (Tenant)',
      role: 'tenant',
      text: this.newMessageText().trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.apiService.sendMessage(payload).subscribe({
      next: (res) => {
        this.messages.update(msgs => [...msgs, res.data]);
        this.newMessageText.set('');
      }
    });
  }
}
