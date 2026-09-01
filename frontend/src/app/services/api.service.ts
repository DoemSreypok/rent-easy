import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  FlowchartData,
  FlowNode,
  PropertyListing,
  Room,
  RentalRequest,
  RentalContract,
  PaymentRecord,
  MaintenanceTicket,
  AppNotification,
  AdminDashboardStats,
  RentalApplication,
  ViewingBooking,
  ChatMessage,
  User
} from '../models/flowchart.model';

export interface HealthResponse {
  status: string;
  message: string;
  database: string;
  timestamp: string;
  endpoints?: Record<string, string>;
}

export interface RentalItem {
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  status?: string;
  count?: number;
  data: T;
  message?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Health & System
  checkHealth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/health`);
  }

  seedDatabase(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/seed`, {});
  }

  // ==========================================
  // PROPERTIES APIs
  // ==========================================
  getProperties(search?: string, type?: string, maxPrice?: number, city?: string, status?: string): Observable<ApiResponse<PropertyListing[]>> {
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (type && type !== 'All' && type !== 'ALL') params.push(`type=${encodeURIComponent(type)}`);
    if (maxPrice) params.push(`maxPrice=${maxPrice}`);
    if (city) params.push(`city=${encodeURIComponent(city)}`);
    if (status && status !== 'ALL') params.push(`status=${encodeURIComponent(status)}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.http.get<ApiResponse<PropertyListing[]>>(`${this.apiUrl}/properties${qs}`);
  }

  getPropertyById(id: string): Observable<ApiResponse<PropertyListing>> {
    return this.http.get<ApiResponse<PropertyListing>>(`${this.apiUrl}/properties/${id}`);
  }

  createProperty(prop: Partial<PropertyListing>): Observable<ApiResponse<{ property: PropertyListing }>> {
    return this.http.post<ApiResponse<{ property: PropertyListing }>>(`${this.apiUrl}/properties`, prop);
  }

  updateProperty(id: string, prop: Partial<PropertyListing>): Observable<ApiResponse<{ property: PropertyListing }>> {
    return this.http.put<ApiResponse<{ property: PropertyListing }>>(`${this.apiUrl}/properties/${id}`, prop);
  }

  deleteProperty(id: string): Observable<ApiResponse<{ property: PropertyListing }>> {
    return this.http.delete<ApiResponse<{ property: PropertyListing }>>(`${this.apiUrl}/properties/${id}`);
  }

  approveProperty(id: string): Observable<ApiResponse<{ property: PropertyListing }>> {
    return this.http.put<ApiResponse<{ property: PropertyListing }>>(`${this.apiUrl}/properties/${id}/approve`, {});
  }

  rejectProperty(id: string): Observable<ApiResponse<{ property: PropertyListing }>> {
    return this.http.put<ApiResponse<{ property: PropertyListing }>>(`${this.apiUrl}/properties/${id}/reject`, {});
  }

  // ==========================================
  // ROOMS APIs
  // ==========================================
  getRooms(propertyId?: string, status?: string): Observable<ApiResponse<Room[]>> {
    const params: string[] = [];
    if (propertyId) params.push(`propertyId=${propertyId}`);
    if (status) params.push(`status=${status}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.http.get<ApiResponse<Room[]>>(`${this.apiUrl}/rooms${qs}`);
  }

  createRoom(room: Partial<Room>): Observable<ApiResponse<{ room: Room }>> {
    return this.http.post<ApiResponse<{ room: Room }>>(`${this.apiUrl}/rooms`, room);
  }

  updateRoom(id: string, room: Partial<Room>): Observable<ApiResponse<{ room: Room }>> {
    return this.http.put<ApiResponse<{ room: Room }>>(`${this.apiUrl}/rooms/${id}`, room);
  }

  deleteRoom(id: string): Observable<ApiResponse<{ room: Room }>> {
    return this.http.delete<ApiResponse<{ room: Room }>>(`${this.apiUrl}/rooms/${id}`);
  }

  updateRoomStatus(id: string, status: string): Observable<ApiResponse<{ room: Room }>> {
    return this.http.patch<ApiResponse<{ room: Room }>>(`${this.apiUrl}/rooms/${id}/status`, { status });
  }

  // ==========================================
  // RENTAL REQUESTS APIs
  // ==========================================
  getRentalRequests(status?: string): Observable<ApiResponse<RentalRequest[]>> {
    const qs = status && status !== 'ALL' ? `?status=${status}` : '';
    return this.http.get<ApiResponse<RentalRequest[]>>(`${this.apiUrl}/rental-requests${qs}`);
  }

  createRentalRequest(payload: { propertyId: string; roomId?: string; message?: string }): Observable<ApiResponse<{ request: RentalRequest }>> {
    return this.http.post<ApiResponse<{ request: RentalRequest }>>(`${this.apiUrl}/rental-requests`, payload);
  }

  acceptRentalRequest(id: string): Observable<ApiResponse<{ request: RentalRequest; contract: RentalContract }>> {
    return this.http.put<ApiResponse<{ request: RentalRequest; contract: RentalContract }>>(`${this.apiUrl}/rental-requests/${id}/accept`, {});
  }

  rejectRentalRequest(id: string): Observable<ApiResponse<{ request: RentalRequest }>> {
    return this.http.put<ApiResponse<{ request: RentalRequest }>>(`${this.apiUrl}/rental-requests/${id}/reject`, {});
  }

  cancelRentalRequest(id: string): Observable<ApiResponse<{ request: RentalRequest }>> {
    return this.http.put<ApiResponse<{ request: RentalRequest }>>(`${this.apiUrl}/rental-requests/${id}/cancel`, {});
  }

  // ==========================================
  // CONTRACTS APIs
  // ==========================================
  getContracts(status?: string): Observable<ApiResponse<RentalContract[]>> {
    const qs = status && status !== 'ALL' ? `?status=${status}` : '';
    return this.http.get<ApiResponse<RentalContract[]>>(`${this.apiUrl}/contracts${qs}`);
  }

  createContract(contract: Partial<RentalContract>): Observable<ApiResponse<{ contract: RentalContract }>> {
    return this.http.post<ApiResponse<{ contract: RentalContract }>>(`${this.apiUrl}/contracts`, contract);
  }

  terminateContract(id: string): Observable<ApiResponse<{ contract: RentalContract }>> {
    return this.http.put<ApiResponse<{ contract: RentalContract }>>(`${this.apiUrl}/contracts/${id}/terminate`, {});
  }

  // ==========================================
  // PAYMENTS APIs
  // ==========================================
  getPayments(status?: string, contractId?: string): Observable<ApiResponse<PaymentRecord[]>> {
    const params: string[] = [];
    if (status && status !== 'ALL') params.push(`status=${status}`);
    if (contractId) params.push(`contractId=${contractId}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.http.get<ApiResponse<PaymentRecord[]>>(`${this.apiUrl}/payments${qs}`);
  }

  submitPayment(payment: { contractId?: string; amount: number; paymentMethod: string; description?: string }): Observable<ApiResponse<{ payment: PaymentRecord }>> {
    return this.http.post<ApiResponse<{ payment: PaymentRecord }>>(`${this.apiUrl}/payments`, payment);
  }

  confirmPayment(id: string): Observable<ApiResponse<{ payment: PaymentRecord }>> {
    return this.http.put<ApiResponse<{ payment: PaymentRecord }>>(`${this.apiUrl}/payments/${id}/confirm`, {});
  }

  rejectPayment(id: string): Observable<ApiResponse<{ payment: PaymentRecord }>> {
    return this.http.put<ApiResponse<{ payment: PaymentRecord }>>(`${this.apiUrl}/payments/${id}/reject`, {});
  }

  // ==========================================
  // MAINTENANCE APIs
  // ==========================================
  getMaintenance(status?: string, urgency?: string): Observable<ApiResponse<MaintenanceTicket[]>> {
    const params: string[] = [];
    if (status && status !== 'ALL') params.push(`status=${status}`);
    if (urgency && urgency !== 'ALL') params.push(`urgency=${urgency}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.http.get<ApiResponse<MaintenanceTicket[]>>(`${this.apiUrl}/maintenance${qs}`);
  }

  createMaintenanceTicket(ticket: Partial<MaintenanceTicket>): Observable<ApiResponse<{ request: MaintenanceTicket }>> {
    return this.http.post<ApiResponse<{ request: MaintenanceTicket }>>(`${this.apiUrl}/maintenance`, ticket);
  }

  updateMaintenanceStatus(id: string, payload: { status?: string; technician?: string; landlordResponse?: string }): Observable<ApiResponse<{ request: MaintenanceTicket }>> {
    return this.http.put<ApiResponse<{ request: MaintenanceTicket }>>(`${this.apiUrl}/maintenance/${id}/status`, payload);
  }

  // ==========================================
  // NOTIFICATIONS APIs
  // ==========================================
  getNotifications(): Observable<ApiResponse<{ notifications: AppNotification[]; unreadCount: number }>> {
    return this.http.get<ApiResponse<{ notifications: AppNotification[]; unreadCount: number }>>(`${this.apiUrl}/notifications`);
  }

  markNotificationAsRead(id: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  markAllNotificationsAsRead(): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.apiUrl}/notifications/read-all`, {});
  }

  // ==========================================
  // USERS & ADMIN APIs
  // ==========================================
  getUsers(search?: string, role?: string, status?: string, page: number = 1, limit: number = 20): Observable<ApiResponse<{ users: User[]; pagination: any }>> {
    const params: string[] = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (role && role !== 'ALL') params.push(`role=${encodeURIComponent(role)}`);
    if (status && status !== 'ALL') params.push(`status=${encodeURIComponent(status)}`);
    params.push(`page=${page}`);
    params.push(`limit=${limit}`);
    const qs = `?${params.join('&')}`;
    return this.http.get<ApiResponse<{ users: User[]; pagination: any }>>(`${this.apiUrl}/users${qs}`);
  }

  createUser(user: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.post<ApiResponse<{ user: User }>>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: string, user: Partial<User>): Observable<ApiResponse<{ user: User }>> {
    return this.http.put<ApiResponse<{ user: User }>>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/users/${id}`);
  }

  toggleUserStatus(id: string): Observable<ApiResponse<{ user: User }>> {
    return this.http.patch<ApiResponse<{ user: User }>>(`${this.apiUrl}/users/${id}/toggle-status`, {});
  }

  getAdminStats(): Observable<ApiResponse<AdminDashboardStats>> {
    return this.http.get<ApiResponse<AdminDashboardStats>>(`${this.apiUrl}/admin/dashboard`);
  }

  getAdminReports(type?: string): Observable<ApiResponse<any>> {
    const qs = type ? `?type=${type}` : '';
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/admin/reports${qs}`);
  }

  // Flowchart & Supporting
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

  getApplications(): Observable<ApiResponse<RentalApplication[]>> {
    return this.http.get<ApiResponse<RentalApplication[]>>(`${this.apiUrl}/applications`);
  }

  submitApplication(app: Partial<RentalApplication>): Observable<ApiResponse<RentalApplication>> {
    return this.http.post<ApiResponse<RentalApplication>>(`${this.apiUrl}/applications`, app);
  }

  updateApplicationStatus(id: string, status: string): Observable<ApiResponse<RentalApplication>> {
    return this.http.put<ApiResponse<RentalApplication>>(`${this.apiUrl}/applications/${id}/status`, { status });
  }

  getBookings(): Observable<ApiResponse<ViewingBooking[]>> {
    return this.http.get<ApiResponse<ViewingBooking[]>>(`${this.apiUrl}/bookings`);
  }

  bookViewing(booking: Partial<ViewingBooking>): Observable<ApiResponse<ViewingBooking>> {
    return this.http.post<ApiResponse<ViewingBooking>>(`${this.apiUrl}/bookings`, booking);
  }

  getMessages(): Observable<ApiResponse<ChatMessage[]>> {
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.apiUrl}/messages`);
  }

  sendMessage(msg: Partial<ChatMessage>): Observable<ApiResponse<ChatMessage>> {
    return this.http.post<ApiResponse<ChatMessage>>(`${this.apiUrl}/messages`, msg);
  }

  getItems(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/items`);
  }

  addItem(item: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/items`, item);
  }

  deleteItem(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/items/${id}`);
  }
}
