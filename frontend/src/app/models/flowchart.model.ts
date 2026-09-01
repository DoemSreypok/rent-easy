export type UserRole = 'ADMIN' | 'LANDLORD' | 'TENANT' | 'owner' | 'tenant' | 'admin';
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'CONDO' | 'VILLA' | 'ROOM' | 'SHOP' | 'Apartment' | 'House' | 'Condo' | 'Villa' | 'Room' | 'Shop' | 'Studio' | 'Townhouse';
export type PropertyStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
export type RoomStatus = 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'MAINTENANCE';
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
export type ContractStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'REJECTED';
export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'ABA' | 'ACLEDA' | 'CARD';
export type MaintenanceStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
export type MaintenanceUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY' | 'Low' | 'Medium' | 'High' | 'Emergency';

export interface User {
  _id?: string;
  id?: string;
  fullName: string;
  name?: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'LANDLORD' | 'TENANT' | 'owner' | 'tenant' | 'admin';
  status?: 'ACTIVE' | 'INACTIVE';
  avatar?: string;
  employment?: string;
  annualIncome?: string;
  creditScore?: number;
}

export interface PropertyListing {
  _id?: string;
  id?: string;
  landlordId?: any;
  name?: string;
  title: string;
  type: string;
  address?: string;
  city?: string;
  district?: string;
  province?: string;
  location: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  amenities: string[];
  description: string;
  owner?: {
    name?: string;
    trustScore?: string;
    responseRate?: string;
    totalProperties?: number;
  };
  status: string;
  isFavorited?: boolean;
}

export interface Room {
  _id?: string;
  id?: string;
  propertyId: any;
  roomNumber: string;
  floor?: number;
  roomType?: string;
  price: number;
  deposit?: number;
  size?: number;
  description?: string;
  images?: string[];
  status: 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'MAINTENANCE';
}

export interface RentalRequest {
  _id?: string;
  id?: string;
  tenantId: any;
  landlordId: any;
  propertyId: any;
  roomId?: any;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}

export interface RentalContract {
  _id?: string;
  id?: string;
  contractNumber: string;
  landlordId: any;
  tenantId: any;
  propertyId: any;
  roomId?: any;
  startDate: string | Date;
  endDate: string | Date;
  monthlyRent: number;
  deposit: number;
  paymentDueDay: number;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  termsAndConditions?: string;
  createdAt?: string;
}

export interface PaymentRecord {
  _id?: string;
  id?: string;
  contractId?: any;
  tenantId: any;
  landlordId: any;
  amount: number;
  paymentDate?: string | Date;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'ABA' | 'ACLEDA' | 'CARD' | string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  receiptNumber?: string;
  description?: string;
}

export interface MaintenanceTicket {
  _id?: string;
  id?: string;
  tenantId?: any;
  landlordId?: any;
  propertyId?: any;
  propertyTitle?: string;
  roomId?: any;
  unit?: string;
  title?: string;
  issue?: string;
  description?: string;
  imageUrl?: string;
  urgency: string;
  status: string;
  technician?: string;
  landlordResponse?: string;
  createdAt?: string;
}

export interface AppNotification {
  _id?: string;
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt?: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  totalProperties: number;
  pendingProperties: number;
  totalRooms: number;
  availableRooms: number;
  rentedRooms: number;
  activeContracts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  maintenanceTickets: number;
}

// Flowchart & Legacy Support Interfaces
export interface FlowColorToken {
  name: string;
  hex: string;
  bg: string;
  border: string;
  badge: string;
  description: string;
}

export interface FlowContainer {
  id: string;
  title: string;
  role: 'public' | 'tenant' | 'owner' | 'shared';
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface FlowNode {
  id: string;
  type: 'screen' | 'decision' | 'action' | 'supporting' | 'rejected';
  category: 'public' | 'tenant' | 'owner' | 'decision' | 'rejected' | 'supporting';
  role: 'public' | 'tenant' | 'owner' | 'shared';
  label: string;
  subtitle: string;
  route: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  icon: string;
  description: string;
  uiComponents: string[];
  apiEndpoints: string[];
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  style?: 'solid' | 'dashed';
  role?: string;
  branch?: 'YES' | 'NO' | 'APPROVE' | 'REJECT';
  color?: string;
}

export interface FlowchartStats {
  totalNodes: number;
  totalEdges: number;
  publicScreens: number;
  tenantScreens: number;
  ownerScreens: number;
  decisionPoints: number;
  sharedSyncPoints: number;
}

export interface FlowchartData {
  appName: string;
  version: string;
  palette: Record<string, FlowColorToken>;
  containers: FlowContainer[];
  nodes: FlowNode[];
  edges: FlowEdge[];
  stats: FlowchartStats;
}

export interface RentalApplication {
  id?: string;
  _id?: string;
  propertyId: string;
  propertyTitle: string;
  applicantName?: string;
  tenantName?: string;
  email?: string;
  phone?: string;
  employment?: string;
  annualIncome?: string;
  creditScore?: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date?: string;
  submittedAt?: string;
  message?: string;
  documents?: string[];
}

export interface ViewingBooking {
  id?: string;
  _id?: string;
  propertyId: string;
  propertyTitle: string;
  tenantName?: string;
  email?: string;
  phone?: string;
  date: string;
  timeSlot: string;
  type: 'In-Person Tour' | 'Live Video Call' | string;
  status: 'Confirmed' | 'Pending' | 'Completed';
  landlordName: string;
}

export interface ChatMessage {
  id?: string;
  _id?: string;
  sender: string;
  role: 'tenant' | 'owner' | 'landlord' | 'admin';
  text: string;
  timestamp: string;
}
