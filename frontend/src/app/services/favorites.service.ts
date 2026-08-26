import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private authService = inject(AuthService);

  // Set of favorited property IDs for the active user
  savedPropertyIds = signal<Set<string>>(new Set());

  // Computed count of saved favorites
  favoriteCount = computed(() => this.savedPropertyIds().size);

  constructor() {
    // Automatically switch favorites when user logs in or out
    effect(() => {
      const user = this.authService.currentUser();
      if (user && user.email) {
        this.loadUserFavorites(user.email);
      } else {
        this.savedPropertyIds.set(new Set());
      }
    });
  }

  private getUserStorageKey(email: string): string {
    return `renteasy_favorites_${email.toLowerCase().trim()}`;
  }

  private loadUserFavorites(email: string): void {
    try {
      const key = this.getUserStorageKey(email);
      const saved = localStorage.getItem(key);
      if (saved) {
        this.savedPropertyIds.set(new Set(JSON.parse(saved)));
      } else {
        // Initial fallback for demo seed user Sophie
        if (email.includes('sophie')) {
          const legacy = localStorage.getItem('renteasy_favorites');
          if (legacy) {
            this.savedPropertyIds.set(new Set(JSON.parse(legacy)));
            return;
          }
        }
        this.savedPropertyIds.set(new Set());
      }
    } catch {
      this.savedPropertyIds.set(new Set());
    }
  }

  private persistUserFavorites(set: Set<string>): void {
    try {
      const user = this.authService.currentUser();
      if (user && user.email) {
        const key = this.getUserStorageKey(user.email);
        localStorage.setItem(key, JSON.stringify(Array.from(set)));
      }
    } catch {}
  }

  isFavorited(propertyId: string): boolean {
    return this.savedPropertyIds().has(propertyId);
  }

  toggleFavorite(propertyId: string): boolean {
    const user = this.authService.currentUser();
    if (!user) return false;

    const current = new Set(this.savedPropertyIds());
    let isAdded = false;

    if (current.has(propertyId)) {
      current.delete(propertyId);
      isAdded = false;
    } else {
      current.add(propertyId);
      isAdded = true;
    }

    this.savedPropertyIds.set(current);
    this.persistUserFavorites(current);
    return isAdded;
  }

  removeFavorite(propertyId: string): void {
    const current = new Set(this.savedPropertyIds());
    current.delete(propertyId);
    this.savedPropertyIds.set(current);
    this.persistUserFavorites(current);
  }

  clearFavorites(): void {
    const user = this.authService.currentUser();
    if (user && user.email) {
      localStorage.removeItem(this.getUserStorageKey(user.email));
    }
    this.savedPropertyIds.set(new Set());
  }
}
