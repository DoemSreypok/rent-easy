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

export interface PropertyListing {
  _id?: string;
  id?: string;
  title: string;
  type: string;
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
  amenities: string[];
  description: string;
  owner: {
    name: string;
    trustScore: string;
    responseRate: string;
    totalProperties: number;
  };
  status: string;
  isFavorited?: boolean;
}

export interface RentalApplication {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  email: string;
  phone: string;
  employment: string;
  annualIncome: string;
  creditScore: number;
  moveInDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  documents: string[];
  submittedAt: string;
  message: string;
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  date: string;
  timeSlot: string;
  type: string;
  status: string;
}

export interface MaintenanceTicket {
  id: string;
  propertyTitle: string;
  unit: string;
  issue: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Reported' | 'In Progress' | 'Completed';
  technician: string;
  reportedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: 'owner' | 'tenant' | 'system';
  text: string;
  timestamp: string;
}
