import { Component, OnInit, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import {
  PropertyListing,
  RentalApplication,
  ViewingBooking,
  MaintenanceTicket,
  ChatMessage
} from '../../models/flowchart.model';

@Component({
  selector: 'app-owner-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-portal.component.html',
  styleUrls: ['./owner-portal.component.scss']
})
export class OwnerPortalComponent implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);

  onRequestAuth = output<{ defaultMode?: 'login' | 'register'; defaultRole?: 'tenant' | 'owner' }>();

  // Owner Tab Navigation (Add Property | Applications | Contract & Payments | Maintenance | Messages)
  ownerNavTab = signal<'add-property' | 'applications' | 'contracts-payments' | 'maintenance' | 'messages'>('applications');

  // Data Signals
  propertiesList = signal<PropertyListing[]>([]);
  applications = signal<RentalApplication[]>([]);
  maintenanceTickets = signal<MaintenanceTicket[]>([]);
  messages = signal<ChatMessage[]>([]);

  // Add Property Form (Owner Flow - Starts Empty)
  newPropType = signal<string>('Apartment');
  newPropTitle = signal<string>('');
  newPropLocation = signal<string>('');
  newPropPrice = signal<number | null>(null);
  newPropDeposit = signal<number | null>(null);
  newPropBeds = signal<number | null>(null);
  newPropBaths = signal<number | null>(null);
  newPropSqft = signal<number | null>(null);
  newPropImage = signal<string>('');
  newPropAmenities = signal<string>('');
  newPropDescription = signal<string>('');
  isPublishing = signal<boolean>(false);
  publishSuccess = signal<boolean>(false);
  publishSuccessMessage = signal<string>('Property successfully saved and published live to MongoDB catalog!');
  publishError = signal<string | null>(null);
  hasSubmittedAddProperty = signal<boolean>(false);

  // New Chat Message
  newMessageText = signal<string>('');

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.apiService.getProperties().subscribe(res => this.propertiesList.set(res.data));
    this.apiService.getApplications().subscribe(res => this.applications.set(res.data));
    this.apiService.getMaintenance().subscribe(res => this.maintenanceTickets.set(res.data));
    this.apiService.getMessages().subscribe(res => this.messages.set(res.data));
  }

  openLoginModal(role: 'tenant' | 'owner'): void {
    this.onRequestAuth.emit({ defaultMode: 'login', defaultRole: role });
  }

  // ================= OWNER: PHOTO UPLOAD HANDLER =================
  onPhotoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawDataUrl = e.target?.result as string;
        this.compressImage(rawDataUrl, 1600, 0.85).then((compressed) => {
          this.newPropImage.set(compressed);
          this.publishError.set(null);
        }).catch(() => {
          this.newPropImage.set(rawDataUrl);
          this.publishError.set(null);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  private compressImage(dataUrl: string, maxWidth: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject();
      img.src = dataUrl;
    });
  }

  removeUploadedPhoto(): void {
    this.newPropImage.set('');
  }

  // ================= OWNER: SAVE PROPERTY =================
  publishProperty(): void {
    this.hasSubmittedAddProperty.set(true);
    this.publishError.set(null);
    this.publishSuccess.set(false);

    if (!this.authService.isOwner()) {
      this.publishError.set('Permission Denied: Only registered Property Owners can save properties.');
      return;
    }

    const missingFields: string[] = [];
    if (!this.newPropTitle().trim()) missingFields.push('Property Title');
    if (!this.newPropLocation().trim()) missingFields.push('Address / Location');
    
    const price = this.newPropPrice();
    if (!price || price <= 0) missingFields.push('Monthly Rent Price');
    
    if (!this.newPropImage()) missingFields.push('Property Photo');

    if (missingFields.length > 0) {
      this.publishError.set(`Please fill in all required fields: ${missingFields.join(', ')}.`);
      return;
    }

    this.isPublishing.set(true);
    const amenitiesArr = this.newPropAmenities().split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      title: this.newPropTitle().trim(),
      type: this.newPropType(),
      location: this.newPropLocation().trim(),
      price: price!,
      deposit: this.newPropDeposit() || price!,
      bedrooms: this.newPropBeds() || 1,
      bathrooms: this.newPropBaths() || 1,
      sqft: this.newPropSqft() || 800,
      image: this.newPropImage(),
      amenities: amenitiesArr.length > 0 ? amenitiesArr : ['WiFi', 'Air Conditioning', 'Parking'],
      description: this.newPropDescription().trim() || 'Modern residential property available for rent.',
      owner: {
        name: this.authService.currentUser()?.name || 'Alexander Sterling',
        trustScore: '100% SuperHost',
        responseRate: '10 mins',
        totalProperties: 5
      },
      status: 'Available',
      featured: true
    };

    this.apiService.createProperty(payload as any).subscribe({
      next: (res) => {
        this.isPublishing.set(false);
        this.publishSuccess.set(true);
        this.publishSuccessMessage.set(res.message || `Property "${payload.title}" saved successfully to MongoDB!`);
        this.publishError.set(null);
        this.hasSubmittedAddProperty.set(false);
        this.resetAddPropertyForm();
        this.loadAllData();
        setTimeout(() => this.publishSuccess.set(false), 6000);
      },
      error: (err) => {
        this.isPublishing.set(false);
        this.publishError.set(err.error?.message || 'Failed to save property to database. Please check your backend connection.');
      }
    });
  }

  resetAddPropertyForm(): void {
    this.newPropType.set('Apartment');
    this.newPropTitle.set('');
    this.newPropLocation.set('');
    this.newPropPrice.set(null);
    this.newPropDeposit.set(null);
    this.newPropBeds.set(null);
    this.newPropBaths.set(null);
    this.newPropSqft.set(null);
    this.newPropImage.set('');
    this.newPropAmenities.set('');
    this.newPropDescription.set('');
  }

  // ================= OWNER: APPROVE / REJECT APPLICANT =================
  handleApplicationDecision(app: RentalApplication, status: 'Approved' | 'Rejected' | 'Pending'): void {
    if (!this.authService.isOwner()) {
      alert('Permission Denied: Only Property Owners can approve or reject tenant applications.');
      return;
    }

    const appId = app.id || (app as any)._id;
    this.apiService.updateApplicationStatus(appId, status).subscribe({
      next: () => {
        app.status = status;
        if (status === 'Approved') {
          setTimeout(() => this.ownerNavTab.set('contracts-payments'), 1200);
        }
      }
    });
  }

  sendMessage(): void {
    if (!this.newMessageText().trim()) return;

    const payload: Partial<ChatMessage> = {
      sender: this.authService.currentUser()?.name || 'Alexander Sterling (Owner)',
      role: 'owner',
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
