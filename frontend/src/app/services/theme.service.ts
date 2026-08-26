import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<'dark' | 'light'>('dark');
  isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const saved = localStorage.getItem('renteasy_theme') as 'dark' | 'light' | null;
    if (saved === 'light' || saved === 'dark') {
      this.setTheme(saved);
    } else {
      // Default to dark mode
      this.setTheme('dark');
    }
  }

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(newTheme: 'dark' | 'light'): void {
    this.theme.set(newTheme);
    localStorage.setItem('renteasy_theme', newTheme);
    
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    }
  }
}
