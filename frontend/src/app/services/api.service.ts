import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RentalItem {
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  database: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  status: string;
  count?: number;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  checkHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/health`);
  }

  getItems(): Observable<ApiResponse<RentalItem[]>> {
    return this.http.get<ApiResponse<RentalItem[]>>(`${this.apiUrl}/items`);
  }

  addItem(item: Partial<RentalItem>): Observable<ApiResponse<RentalItem>> {
    return this.http.post<ApiResponse<RentalItem>>(`${this.apiUrl}/items`, item);
  }

  deleteItem(id: string): Observable<ApiResponse<RentalItem>> {
    return this.http.delete<ApiResponse<RentalItem>>(`${this.apiUrl}/items/${id}`);
  }
}
