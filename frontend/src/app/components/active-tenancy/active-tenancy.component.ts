import { Component, OnInit, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {
  PropertyListing,
  MaintenanceTicket
} from '../../models/flowchart.model';

@Component({
  selector: 'app-active-tenancy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './active-tenancy.component.html',
  styleUrls: ['./active-tenancy.component.scss']
})
export class ActiveTenancyComponent implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);

  onRequestAuth = output<{ defaultMode?: 'login' | 'register'; defaultRole?: 'tenant' | 'owner' }>();

  // Active Tenancy Data Signals
  activeRentalProperty = signal<PropertyListing | null>(null);
  maintenanceTickets = signal<MaintenanceTicket[]>([]);

  // Maintenance Ticket Form
  newMaintIssue = signal<string>('');
  newMaintUrgency = signal<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');

  // Rent Payment State
  isProcessingPayment = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.apiService.getProperties().subscribe(res => {
      if (res.data.length > 0) {
        this.activeRentalProperty.set(res.data[0]);
      }
    });
    this.apiService.getMaintenance().subscribe(res => this.maintenanceTickets.set(res.data));
  }

  openLoginModal(role: 'tenant' | 'owner'): void {
    this.onRequestAuth.emit({ defaultMode: 'login', defaultRole: role });
  }

  payRent(): void {
    this.isProcessingPayment.set(true);
    setTimeout(() => {
      this.isProcessingPayment.set(false);
      this.paymentSuccess.set(true);
      setTimeout(() => this.paymentSuccess.set(false), 5000);
    }, 1200);
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
      next: (res: any) => {
        const ticket = res.data?.request || res.data;
        this.maintenanceTickets.update(list => [ticket, ...list]);
        this.newMaintIssue.set('');
      }
    });
  }
}
