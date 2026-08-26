import { Component, OnInit, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { PropertyListing, ViewingBooking } from '../../models/flowchart.model';

@Component({
  selector: 'app-homepage-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './homepage-preview.component.html',
  styleUrls: ['./homepage-preview.component.scss']
})
export class HomepagePreviewComponent implements OnInit {
  private apiService = inject(ApiService);
  authService = inject(AuthService);
  favoritesService = inject(FavoritesService);

  onNavigateToJourney = output<{ role: 'tenant' | 'owner'; step?: string; property?: PropertyListing }>();
  onRequestAuth = output<{ defaultMode?: 'login' | 'register'; defaultRole?: 'tenant' | 'owner'; nextAction?: string }>();

  properties = signal<PropertyListing[]>([]);
  isLoading = signal<boolean>(true);
  actionToast = signal<string | null>(null);

  // Interactive Auth Required Alert State
  authAlert = signal<{
    message: string;
    defaultRole: 'tenant' | 'owner';
  } | null>(null);

  // Search & Filter State
  searchKeyword = signal<string>('');
  selectedType = signal<string>('All');
  maxPrice = signal<number>(7000);
  selectedBeds = signal<string>('All');
  sortBy = signal<string>('featured');

  // Selected Property for Details Modal
  activeProperty = signal<PropertyListing | null>(null);

  // Sub-Modals on Property Details
  showBookingModal = signal<boolean>(false);
  showContactModal = signal<boolean>(false);
  showApplyModal = signal<boolean>(false);

  // Booking Form State
  bookingDate = signal<string>('2026-09-02');
  bookingTimeSlot = signal<string>('14:00 - 15:00');
  bookingType = signal<string>('In-Person Tour');

  // Contact Form State
  contactMessage = signal<string>('');

  // Application Form State
  applicantEmployment = signal<string>('Software Engineer');
  applicantIncome = signal<string>('$180,000 / yr');
  applicantMessage = signal<string>('Looking to sign a 12-month lease. Verified income documents ready.');

  // Saved Properties Set
  savedPropertyIds = signal<Set<string>>(new Set());

  propertyTypes = ['All', 'Apartment', 'Condo', 'Villa', 'Studio', 'Townhouse'];
  bedOptions = ['All', '1+', '2+', '3+', '4+'];

  categories = [
    { icon: '🏙️', name: 'Condominiums', count: '320 available', type: 'Condo' },
    { icon: '🏡', name: 'Luxury Villas', count: '145 available', type: 'Villa' },
    { icon: '🏢', name: 'Urban Apartments', count: '680 available', type: 'Apartment' },
    { icon: '🛋️', name: 'Waterfront Studios', count: '210 available', type: 'Studio' },
    { icon: '🏘️', name: 'Classic Townhouses', count: '95 available', type: 'Townhouse' }
  ];

  popularLocations = [
    { name: 'BKK1, Phnom Penh', count: '480 rentals', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80' },
    { name: 'Tonle Bassac & Koh Pich', count: '390 rentals', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
    { name: 'Toul Kork (TK), Phnom Penh', count: '260 rentals', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Daun Penh (Riverside)', count: '190 rentals', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' },
    { name: 'Russian Market (TTP)', count: '210 rentals', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
    { name: 'Chbar Ampov (Borey PH)', count: '150 rentals', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80' }
  ];

  ngOnInit(): void {
    this.fetchProperties();
    this.restoreFavorites();
  }

  private restoreFavorites(): void {
    try {
      const saved = localStorage.getItem('renteasy_favorites');
      if (saved) {
        this.savedPropertyIds.set(new Set(JSON.parse(saved)));
      }
    } catch {}
  }

  fetchProperties(): void {
    this.isLoading.set(true);
    this.apiService.getProperties(this.searchKeyword(), this.selectedType(), this.maxPrice()).subscribe({
      next: (res) => {
        let list = res.data;

        // Filter bedrooms
        if (this.selectedBeds() !== 'All') {
          const minBeds = parseInt(this.selectedBeds(), 10);
          list = list.filter(p => p.bedrooms >= minBeds);
        }

        // Sorting
        if (this.sortBy() === 'price-low') {
          list.sort((a, b) => a.price - b.price);
        } else if (this.sortBy() === 'price-high') {
          list.sort((a, b) => b.price - a.price);
        } else if (this.sortBy() === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        }

        this.properties.set(list);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  triggerSearch(): void {
    this.fetchProperties();
  }

  selectCategory(type: string): void {
    this.selectedType.set(type);
    this.fetchProperties();
    const el = document.getElementById('search-results');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  selectLocation(cityName: string): void {
    this.searchKeyword.set(cityName);
    this.fetchProperties();
    const el = document.getElementById('search-results');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  openPropertyDetails(prop: PropertyListing): void {
    this.activeProperty.set(prop);
  }

  closePropertyDetails(): void {
    this.activeProperty.set(null);
    this.showBookingModal.set(false);
    this.showContactModal.set(false);
    this.showApplyModal.set(false);
  }

  confirmAuthAlert(): void {
    const alert = this.authAlert();
    this.authAlert.set(null);
    this.onRequestAuth.emit({
      defaultMode: 'login',
      defaultRole: alert?.defaultRole || 'tenant',
      nextAction: 'favorite'
    });
  }

  // ================= ACTION 1: FAVORITE / SAVE =================
  toggleFavorite(prop: PropertyListing, e?: MouseEvent): void {
    if (e) e.stopPropagation();

    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.authAlert.set({
        message: `You are not signed in. Please sign in first to save "${prop.title}" to your favorites.`,
        defaultRole: 'tenant'
      });
      return;
    }

    const propId = prop._id || prop.id || prop.title;
    const isAdded = this.favoritesService.toggleFavorite(propId);

    if (isAdded) {
      this.showToast(`Saved "${prop.title}" to your Saved Homes! ❤️`);
    } else {
      this.showToast(`Removed "${prop.title}" from Saved Homes`);
    }
  }

  isFavorited(prop: PropertyListing): boolean {
    const propId = prop._id || prop.id || prop.title;
    return this.favoritesService.isFavorited(propId);
  }

  // ================= ACTION 2: CONTACT OWNER =================
  handleContactClick(prop: PropertyListing): void {
    if (!this.authService.isLoggedIn()) {
      this.authAlert.set({
        message: `Please sign in first to send a message to the Landlord for "${prop.title}".`,
        defaultRole: 'tenant'
      });
      return;
    }
    this.activeProperty.set(prop);
    this.showContactModal.set(true);
  }

  sendContactMessage(): void {
    const prop = this.activeProperty();
    if (!prop || !this.contactMessage().trim()) return;

    this.apiService.sendMessage({
      sender: `${this.authService.currentUser()?.name || 'Tenant'} (Tenant)`,
      role: 'tenant',
      text: `Inquiry for ${prop.title}: ${this.contactMessage().trim()}`
    }).subscribe(() => {
      this.showToast(`Message sent directly to ${prop.owner.name}! 💬`);
      this.contactMessage.set('');
      this.showContactModal.set(false);
    });
  }

  // ================= ACTION 3: BOOK VIEWING =================
  handleBookViewingClick(prop: PropertyListing): void {
    if (!this.authService.isLoggedIn()) {
      this.authAlert.set({
        message: `Please sign in first to book a viewing appointment for "${prop.title}".`,
        defaultRole: 'tenant'
      });
      return;
    }
    this.showBookingModal.set(true);
  }

  confirmBooking(): void {
    const prop = this.activeProperty();
    if (!prop) return;

    this.apiService.bookViewing({
      propertyId: prop._id || prop.id || 'prop-1',
      propertyTitle: prop.title,
      tenantName: this.authService.currentUser()?.name || 'Sophie Taylor',
      date: this.bookingDate(),
      timeSlot: this.bookingTimeSlot(),
      type: this.bookingType()
    }).subscribe(() => {
      this.showToast(`🎉 Viewing appointment booked for ${this.bookingDate()} at ${this.bookingTimeSlot()}! Added to My Bookings.`);
      this.showBookingModal.set(false);
      this.closePropertyDetails();
      this.onNavigateToJourney.emit({ role: 'tenant', step: 'booking-success' });
    });
  }

  // ================= ACTION 4: APPLY FOR RENTAL =================
  handleApplyClick(prop: PropertyListing): void {
    if (!this.authService.isLoggedIn()) {
      this.authAlert.set({
        message: `Please sign in first to submit a digital rental application for "${prop.title}".`,
        defaultRole: 'tenant'
      });
      return;
    }
    this.showApplyModal.set(true);
  }

  submitRentalApplication(): void {
    const prop = this.activeProperty();
    if (!prop) return;

    const user = this.authService.currentUser();
    this.apiService.submitApplication({
      propertyId: prop._id || prop.id || 'prop-1',
      propertyTitle: prop.title,
      tenantName: user?.name || 'Sophie Taylor',
      email: user?.email || 'pinky@renteasy.com',
      phone: user?.phone || '+1 (555) 382-9912',
      employment: this.applicantEmployment(),
      annualIncome: this.applicantIncome(),
      creditScore: user?.creditScore || 785,
      message: this.applicantMessage()
    }).subscribe(() => {
      this.showToast(`🎉 Rental application submitted for "${prop.title}"! Waiting for Landlord review.`);
      this.showApplyModal.set(false);
      this.closePropertyDetails();
      this.onNavigateToJourney.emit({ role: 'tenant', step: 'app-submitted' });
    });
  }

  showToast(msg: string): void {
    this.actionToast.set(msg);
    setTimeout(() => this.actionToast.set(null), 3500);
  }

  startOwnerJourney(): void {
    if (!this.authService.isLoggedIn()) {
      this.onRequestAuth.emit({ defaultMode: 'register', defaultRole: 'owner', nextAction: 'list-property' });
    } else {
      this.onNavigateToJourney.emit({ role: 'owner', step: 'add-property' });
    }
  }

  startTenantJourney(): void {
    this.onNavigateToJourney.emit({ role: 'tenant', step: 'details' });
  }
}
