import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FlowchartData,
  FlowNode,
  PropertyListing,
  RentalApplication,
  ViewingBooking,
  MaintenanceTicket,
  ChatMessage
} from '../models/flowchart.model';

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
  endpoints?: Record<string, string>;
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

  // Health check
  checkHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.apiUrl}/health`);
  }

  // Seed MongoDB Database
  seedDatabase(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/seed`, {});
  }

  // Flowchart Graph APIs
  getFlowchart(role?: string): Observable<ApiResponse<FlowchartData>> {
    const query = role && role !== 'all' ? `?role=${role}` : '';
    return this.http.get<ApiResponse<FlowchartData>>(`${this.apiUrl}/flowchart${query}`);
  }

  getMermaidDiagram(): Observable<ApiResponse<{ mermaid: string }>> {
    return this.http.get<ApiResponse<{ mermaid: string }>>(`${this.apiUrl}/flowchart/mermaid`);
  }

  getNodeDetails(id: string): Observable<ApiResponse<{ node: FlowNode; incoming: any[]; outgoing: any[] }>> {
    return this.http.get<ApiResponse<{ node: FlowNode; incoming: any[]; outgoing: any[] }>>(`${this.apiUrl}/flowchart/nodes/${id}`);
  }

  // Properties APIs
  getProperties(search?: string, type?: string, maxPrice?: number): Observable<ApiResponse<PropertyListing[]>> {
    let params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (type) params.push(`type=${encodeURIComponent(type)}`);
    if (maxPrice) params.push(`maxPrice=${maxPrice}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.http.get<ApiResponse<PropertyListing[]>>(`${this.apiUrl}/properties${qs}`);
  }

  getPropertyById(id: string): Observable<ApiResponse<PropertyListing>> {
    return this.http.get<ApiResponse<PropertyListing>>(`${this.apiUrl}/properties/${id}`);
  }

  createProperty(prop: Partial<PropertyListing>): Observable<ApiResponse<PropertyListing>> {
    return this.http.post<ApiResponse<PropertyListing>>(`${this.apiUrl}/properties`, prop);
  }

  // Applications APIs
  getApplications(): Observable<ApiResponse<RentalApplication[]>> {
    return this.http.get<ApiResponse<RentalApplication[]>>(`${this.apiUrl}/applications`);
  }

  submitApplication(app: Partial<RentalApplication>): Observable<ApiResponse<RentalApplication>> {
    return this.http.post<ApiResponse<RentalApplication>>(`${this.apiUrl}/applications`, app);
  }

  updateApplicationStatus(id: string, status: 'Pending' | 'Approved' | 'Rejected'): Observable<ApiResponse<RentalApplication>> {
    return this.http.patch<ApiResponse<RentalApplication>>(`${this.apiUrl}/applications/${id}/status`, { status });
  }

  // Bookings APIs
  getBookings(): Observable<ApiResponse<ViewingBooking[]>> {
    return this.http.get<ApiResponse<ViewingBooking[]>>(`${this.apiUrl}/bookings`);
  }

  bookViewing(booking: Partial<ViewingBooking>): Observable<ApiResponse<ViewingBooking>> {
    return this.http.post<ApiResponse<ViewingBooking>>(`${this.apiUrl}/bookings`, booking);
  }

  // Maintenance APIs
  getMaintenance(): Observable<ApiResponse<MaintenanceTicket[]>> {
    return this.http.get<ApiResponse<MaintenanceTicket[]>>(`${this.apiUrl}/maintenance`);
  }

  createMaintenanceTicket(ticket: Partial<MaintenanceTicket>): Observable<ApiResponse<MaintenanceTicket>> {
    return this.http.post<ApiResponse<MaintenanceTicket>>(`${this.apiUrl}/maintenance`, ticket);
  }

  // Messages APIs
  getMessages(): Observable<ApiResponse<ChatMessage[]>> {
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.apiUrl}/messages`);
  }

  sendMessage(msg: Partial<ChatMessage>): Observable<ApiResponse<ChatMessage>> {
    return this.http.post<ApiResponse<ChatMessage>>(`${this.apiUrl}/messages`, msg);
  }

  // User Management APIs
  getUsers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/users`);
  }

  deleteUser(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/users/${id}`);
  }

  // Generic DB Items
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
