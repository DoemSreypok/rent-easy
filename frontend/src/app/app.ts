import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, RentalItem, HealthResponse } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private apiService = inject(ApiService);

  // Reactive State Signals
  healthData = signal<HealthResponse | null>(null);
  isConnected = signal<boolean>(false);
  isDbConnected = signal<boolean>(false);
  connectionError = signal<string | null>(null);
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);

  items = signal<RentalItem[]>([]);

  // Form State
  newItem = {
    title: '',
    category: 'Apartment',
    price: null as number | null,
    description: ''
  };

  categories = ['Apartment', 'House', 'Studio', 'Vehicle', 'Equipment', 'Other'];

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.checkHealth();
    this.loadItems();
  }

  checkHealth(): void {
    this.apiService.checkHealth().subscribe({
      next: (res) => {
        this.healthData.set(res);
        this.isConnected.set(true);
        this.isDbConnected.set(res.database === 'connected');
        this.connectionError.set(null);
      },
      error: (err) => {
        this.isConnected.set(false);
        this.isDbConnected.set(false);
        this.connectionError.set(
          err.status === 0
            ? 'Cannot connect to backend server. Make sure it is running on http://localhost:5000'
            : err.message || 'Error connecting to backend'
        );
      }
    });
  }

  loadItems(): void {
    this.isLoading.set(true);
    this.apiService.getItems().subscribe({
      next: (res) => {
        this.items.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.isLoading.set(false);
      }
    });
  }

  onAddItem(): void {
    if (!this.newItem.title || this.newItem.price === null || this.newItem.price < 0) {
      alert('Please provide a valid title and price.');
      return;
    }

    this.isSubmitting.set(true);
    this.apiService
      .addItem({
        title: this.newItem.title.trim(),
        category: this.newItem.category,
        price: Number(this.newItem.price),
        description: this.newItem.description.trim()
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          // Prepend new item to list
          this.items.update((prev) => [res.data, ...prev]);
          // Reset form
          this.newItem = {
            title: '',
            category: 'Apartment',
            price: null,
            description: ''
          };
        },
        error: (err) => {
          this.isSubmitting.set(false);
          alert('Failed to add item: ' + (err.error?.message || err.message));
        }
      });
  }

  onDeleteItem(id?: string): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this item?')) return;

    this.apiService.deleteItem(id).subscribe({
      next: () => {
        this.items.update((prev) => prev.filter((item) => item._id !== id));
      },
      error: (err) => {
        alert('Failed to delete item: ' + (err.error?.message || err.message));
      }
    });
  }
}
