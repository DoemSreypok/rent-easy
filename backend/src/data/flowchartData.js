/**
 * RentEasy UX/UI Flowchart Graph Specification
 * High-fidelity node & edge data structure conforming to Figma UX Case Study specifications.
 */

export const COLOR_PALETTE = {
  public: {
    name: 'Public Website',
    hex: '#2563eb',
    bg: '#eff6ff',
    border: '#3b82f6',
    badge: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Accessible to all visitors without authentication'
  },
  tenant: {
    name: 'Tenant Journey',
    hex: '#16a34a',
    bg: '#f0fdf4',
    border: '#22c55e',
    badge: 'bg-green-100 text-green-800 border-green-300',
    description: 'Tenant search, booking, application, and rental lifecycle'
  },
  owner: {
    name: 'Property Owner Journey',
    hex: '#9333ea',
    bg: '#faf5ff',
    border: '#a855f7',
    badge: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Property listing, tenant screening, and asset management'
  },
  decision: {
    name: 'Decision Points',
    hex: '#ea580c',
    bg: '#fff7ed',
    border: '#f97316',
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Branching logic (Approval, Rejection, Options)'
  },
  rejected: {
    name: 'Rejected / Error State',
    hex: '#dc2626',
    bg: '#fef2f2',
    border: '#ef4444',
    badge: 'bg-red-100 text-red-800 border-red-300',
    description: 'Application denied, validation errors, terminal closures'
  },
  supporting: {
    name: 'Supporting Screens / Modals',
    hex: '#475569',
    bg: '#f8fafc',
    border: '#64748b',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Forms, upload drawers, verification sheets, confirmations'
  }
};

export const FLOWCHART_CONTAINERS = [
  {
    id: 'container-public',
    title: '1. PUBLIC DISCOVERY & HOMEPAGE',
    role: 'public',
    color: '#2563eb',
    x: 40,
    y: 40,
    width: 1720,
    height: 380,
    description: 'Public unauthenticated experience. Users can search, filter, and view properties freely without login.'
  },
  {
    id: 'container-tenant',
    title: '2. TENANT USER JOURNEY',
    role: 'tenant',
    color: '#16a34a',
    x: 40,
    y: 460,
    width: 840,
    height: 1280,
    description: 'End-to-end tenant flow: property discovery, viewing booking, rental application submission, lease signing, and payment.'
  },
  {
    id: 'container-owner',
    title: '3. PROPERTY OWNER JOURNEY',
    role: 'owner',
    color: '#9333ea',
    x: 920,
    y: 460,
    width: 840,
    height: 1280,
    description: 'Owner flow: listing creation wizard, applicant review, lease issuance, and 4-pillar property management.'
  },
  {
    id: 'container-shared',
    title: '4. TWO-WAY RENTAL MANAGEMENT & COLLABORATION (TENANT ↔ OWNER)',
    role: 'shared',
    color: '#0284c7',
    x: 40,
    y: 1780,
    width: 1720,
    height: 480,
    description: 'Active tenancy synchronization: Digital Lease, Escrow Payments, Live Maintenance Tickets, Real-time Messaging.'
  }
];

export const FLOWCHART_NODES = [
  // ================= 1. PUBLIC WEBSITE =================
  {
    id: 'pub-home',
    type: 'screen',
    category: 'public',
    role: 'public',
    label: 'Public Homepage',
    subtitle: 'RentEasy Main Landing Page',
    route: '/',
    x: 740,
    y: 100,
    width: 280,
    height: 110,
    icon: '🏠',
    description: 'Public landing page featuring universal search, hero banner, featured properties, categories, and dual CTAs.',
    uiComponents: [
      'Navigation Header (Logo, Home, Properties, How It Works, About, Login, List Your Property)',
      'Hero Banner with Headline & Tagline',
      'Universal Property Search Bar (Location, Property Type, Price Range)',
      'Featured Properties Grid',
      'Popular Locations Carousel',
      'Property Categories (Apartment, Condo, Villa, Studio, House)',
      'How RentEasy Works (3-Step Guide)',
      'Why Choose RentEasy Value Props',
      'List Your Property CTA Banner',
      'Footer with Legal & Quick Links'
    ],
    apiEndpoints: ['GET /api/properties/featured', 'GET /api/categories', 'GET /api/locations/popular']
  },
  {
    id: 'pub-search',
    type: 'screen',
    category: 'public',
    role: 'public',
    label: 'Property Search & Results',
    subtitle: 'Browse Properties Catalog',
    route: '/properties',
    x: 320,
    y: 260,
    width: 260,
    height: 90,
    icon: '🔍',
    description: 'Full searchable catalog with dynamic filters (location, price slider, bedrooms, amenities) and sorting.',
    uiComponents: [
      'Filter Sidebar (Price range, Bedrooms, Bathrooms, Amenities)',
      'Sorting Dropdown (Price Low/High, Newest, Rating)',
      'Property Card Grid with badges (Available, Verified, Price/mo)',
      'Interactive Map View Toggle',
      'Pagination & Results Count'
    ],
    apiEndpoints: ['GET /api/properties?search=&type=&minPrice=&maxPrice=']
  },
  {
    id: 'pub-details',
    type: 'screen',
    category: 'public',
    role: 'public',
    label: 'Property Details Page',
    subtitle: 'Comprehensive Listing Specs',
    route: '/properties/:id',
    x: 320,
    y: 520,
    width: 260,
    height: 120,
    icon: '🏢',
    description: 'Detailed listing page with HD photo gallery, full specs, owner profile, reviews, and interactive action buttons.',
    uiComponents: [
      'HD Photo Gallery / Virtual Tour',
      'Property Title, Verified Badge & Monthly Rent',
      'Key Specs (Bedrooms, Bathrooms, SqFt, Furnished Status)',
      'Amenities Checklist (Pool, Gym, Parking, WiFi, Pet-friendly)',
      'Full Rich-text Description & House Rules',
      'Owner / Landlord Profile & Trust Score',
      'Verified Tenant Reviews & Ratings',
      'Sticky Action Bar: Save Property, Contact Owner, Book Viewing, Apply for Rental'
    ],
    apiEndpoints: ['GET /api/properties/:id', 'GET /api/properties/:id/reviews']
  },
  {
    id: 'pub-owner-cta',
    type: 'action',
    category: 'public',
    role: 'public',
    label: 'List Your Property CTA',
    subtitle: 'Owner Onboarding Entry',
    route: '/list-property',
    x: 1200,
    y: 260,
    width: 240,
    height: 80,
    icon: '📢',
    description: 'Landing page CTA directing landlords to create an account and list properties with low commission.',
    uiComponents: ['Hero Pitch for Landlords', 'Earnings Estimator Calculator', 'Get Started Button'],
    apiEndpoints: []
  },

  // ================= 2. TENANT JOURNEY =================
  {
    id: 'ten-auth-modal',
    type: 'supporting',
    category: 'supporting',
    role: 'tenant',
    label: 'Tenant Login / Sign Up',
    subtitle: 'Triggered upon Action',
    route: '/auth/tenant',
    x: 320,
    y: 690,
    width: 260,
    height: 85,
    icon: '🔐',
    description: 'Authentication gate invoked when user clicks Save, Contact, Book Viewing, or Apply for Rental.',
    uiComponents: ['Email & Password Login', 'Google / Apple Social Auth', 'Role Selection (Tenant)', 'Auto-redirect to pending action'],
    apiEndpoints: ['POST /api/auth/login', 'POST /api/auth/register']
  },
  {
    id: 'ten-dash',
    type: 'screen',
    category: 'tenant',
    role: 'tenant',
    label: 'Tenant Dashboard',
    subtitle: 'Tenant Hub & Overview',
    route: '/tenant/dashboard',
    x: 320,
    y: 830,
    width: 260,
    height: 100,
    icon: '📊',
    description: 'Personalized control center for active applications, saved homes, scheduled viewings, and active rentals.',
    uiComponents: [
      'Navigation: Home | Properties | Saved | My Rentals | Messages | Profile',
      'Active Applications Status Tracker',
      'Upcoming Scheduled Viewings',
      'Saved / Wishlist Properties Quick Access',
      'Active Tenancy Summary & Rent Due Alert'
    ],
    apiEndpoints: ['GET /api/tenant/dashboard', 'GET /api/tenant/saved-properties']
  },

  // Tenant Booking Flow
  {
    id: 'ten-book-modal',
    type: 'supporting',
    category: 'supporting',
    role: 'tenant',
    label: 'Book Viewing Modal',
    subtitle: 'Select Date & Time Slot',
    route: '/properties/:id/book-viewing',
    x: 80,
    y: 700,
    width: 200,
    height: 85,
    icon: '📅',
    description: 'Interactive calendar widget to select physical or virtual viewing slots verified against owner availability.',
    uiComponents: ['Calendar Date Picker', 'Available Hourly Time Slots', 'Viewing Type (In-Person / Video Tour)', 'Notes for Landlord'],
    apiEndpoints: ['GET /api/properties/:id/available-slots', 'POST /api/bookings']
  },
  {
    id: 'ten-book-confirm',
    type: 'screen',
    category: 'tenant',
    role: 'tenant',
    label: 'Booking Confirmed',
    subtitle: 'Added to My Bookings',
    route: '/tenant/bookings',
    x: 80,
    y: 850,
    width: 200,
    height: 85,
    icon: '✅',
    description: 'Confirmation screen with calendar sync (Google/iCal), owner contact info, and reschedule options.',
    uiComponents: ['Booking Reference #', 'Date & Time Badge', 'Add to Google Calendar Button', 'Message Landlord Shortcut'],
    apiEndpoints: ['GET /api/tenant/bookings']
  },

  // Tenant Application Flow
  {
    id: 'ten-app-form',
    type: 'supporting',
    category: 'supporting',
    role: 'tenant',
    label: 'Rental Application Form',
    subtitle: 'Multi-step Digital Dossier',
    route: '/properties/:id/apply',
    x: 480,
    y: 990,
    width: 240,
    height: 100,
    icon: '📝',
    description: 'Comprehensive digital rental application with personal, employment, and income verification.',
    uiComponents: [
      'Step 1: Personal Information (Full Name, Contact, DOB, SSN/ID)',
      'Step 2: Employment & Income Verification (Employer, Salary, Paystubs)',
      'Step 3: Document Uploads (Government ID, Proof of Income, Bank Statement)',
      'Step 4: Rental History & References'
    ],
    apiEndpoints: ['POST /api/applications', 'POST /api/uploads/documents']
  },
  {
    id: 'ten-app-submitted',
    type: 'screen',
    category: 'tenant',
    role: 'tenant',
    label: 'Application Submitted',
    subtitle: 'Waiting for Owner Review',
    route: '/tenant/applications/:id',
    x: 480,
    y: 1140,
    width: 240,
    height: 85,
    icon: '⏳',
    description: 'Live status timeline showing landlord review progress, document verification status, and estimated response time.',
    uiComponents: ['Application Timeline Stepper', 'Uploaded Documents Preview', 'Cancel Application Option', 'Direct Landlord Q&A'],
    apiEndpoints: ['GET /api/applications/:id']
  },
  {
    id: 'dec-app-approved',
    type: 'decision',
    category: 'decision',
    role: 'tenant',
    label: 'Application Approved?',
    subtitle: 'Owner Decision Gate',
    route: null,
    x: 520,
    y: 1280,
    width: 160,
    height: 110,
    icon: '⚖️',
    description: 'Critical decision gate. If approved, tenant progresses to Lease Signing & Payment. If rejected, closed.',
    uiComponents: ['Status: Pending / Approved / Rejected'],
    apiEndpoints: []
  },
  {
    id: 'ten-app-rejected',
    type: 'rejected',
    category: 'rejected',
    role: 'tenant',
    label: 'Application Rejected',
    subtitle: 'Return to Property Search',
    route: '/tenant/applications/:id/rejected',
    x: 240,
    y: 1350,
    width: 220,
    height: 80,
    icon: '❌',
    description: 'Polite rejection notice with feedback or recommendations for similar available properties in the same neighborhood.',
    uiComponents: ['Rejection Reason / Note', 'Recommended Alternative Properties', 'Button: Browse More Properties'],
    apiEndpoints: ['GET /api/properties/recommendations']
  },
  {
    id: 'ten-lease-sign',
    type: 'screen',
    category: 'tenant',
    role: 'tenant',
    label: 'Sign Rental Agreement',
    subtitle: 'Digital Signature & Terms',
    route: '/tenant/agreements/:id',
    x: 480,
    y: 1470,
    width: 240,
    height: 90,
    icon: '✍️',
    description: 'Legally compliant e-signing interface with PDF preview, clause checklist, and cryptographic signature pad.',
    uiComponents: ['Full Lease Document PDF Viewer', 'Tenant Signature Pad', 'Security Deposit & Rent Terms Confirmation', 'Download Signed Copy'],
    apiEndpoints: ['GET /api/agreements/:id', 'POST /api/agreements/:id/sign']
  },
  {
    id: 'ten-payment',
    type: 'supporting',
    category: 'supporting',
    role: 'tenant',
    label: 'Deposit & 1st Month Payment',
    subtitle: 'Stripe / Bank Transfer Escrow',
    route: '/tenant/payments/checkout',
    x: 480,
    y: 1600,
    width: 240,
    height: 90,
    icon: '💳',
    description: 'Secure checkout portal for first month rent + security deposit with automated invoice generation.',
    uiComponents: ['Breakdown (Deposit + Month 1 Rent + Fees)', 'Payment Method (Card, Bank ACH, Wire)', 'Instant Receipt & Confirmation'],
    apiEndpoints: ['POST /api/payments/create-intent', 'POST /api/payments/confirm']
  },

  // ================= 3. OWNER JOURNEY =================
  {
    id: 'own-auth',
    type: 'supporting',
    category: 'supporting',
    role: 'owner',
    label: 'Owner Login / Sign Up',
    subtitle: 'Landlord Portal Access',
    route: '/auth/owner',
    x: 1200,
    y: 520,
    width: 240,
    height: 80,
    icon: '🔑',
    description: 'Owner authentication and identity verification portal.',
    uiComponents: ['Owner Email & Password', 'Property Owner Verification Badge', 'Tax / Business Registration optional'],
    apiEndpoints: ['POST /api/auth/owner-login', 'POST /api/auth/owner-register']
  },
  {
    id: 'own-dash',
    type: 'screen',
    category: 'owner',
    role: 'owner',
    label: 'Owner Dashboard',
    subtitle: 'Portfolio Overview & Metrics',
    route: '/owner/dashboard',
    x: 1200,
    y: 650,
    width: 260,
    height: 100,
    icon: '📈',
    description: 'Comprehensive landlord dashboard showing portfolio yield, occupancy rates, pending applications, and maintenance alerts.',
    uiComponents: [
      'Navigation: Dashboard | My Properties | Applications | Tenants | Payments | Messages | Profile',
      'Portfolio Overview (Total Units, Occupancy %, Monthly Revenue)',
      'Pending Applications Counter & Quick Review',
      'Recent Rent Payments Feed',
      'Open Maintenance Tickets Alert'
    ],
    apiEndpoints: ['GET /api/owner/metrics', 'GET /api/owner/properties']
  },

  // Owner Add Property Flow
  {
    id: 'own-add-wizard',
    type: 'supporting',
    category: 'supporting',
    role: 'owner',
    label: 'Add Property Wizard',
    subtitle: '10-Step Listing Generator',
    route: '/owner/properties/new',
    x: 1480,
    y: 790,
    width: 240,
    height: 110,
    icon: '🏗️',
    description: 'Structured multi-step creation flow for listing residential or commercial properties.',
    uiComponents: [
      '1. Property Type (Apartment, Condo, Villa, Studio, House)',
      '2. Location (Address, City, Postal Code, Map Pin)',
      '3. Monthly Rent & Security Deposit Price',
      '4. Bedrooms, Bathrooms & Floor Area (sqft)',
      '5. Amenities Checklist (Parking, Pool, AC, Elevator)',
      '6. Rich Description & Custom House Rules',
      '7. High-Res Photo Uploader & Floorplans',
      '8. Set Availability Date & Lease Duration Terms'
    ],
    apiEndpoints: ['POST /api/properties', 'POST /api/uploads/photos']
  },
  {
    id: 'own-preview-publish',
    type: 'screen',
    category: 'owner',
    role: 'owner',
    label: 'Preview & Publish Listing',
    subtitle: 'Live Listing Published',
    route: '/owner/properties/:id/preview',
    x: 1480,
    y: 950,
    width: 240,
    height: 85,
    icon: '🚀',
    description: 'Final listing inspection mode with one-click publish to the public marketplace.',
    uiComponents: ['Public Preview Mockup', 'SEO Meta Tags Preview', 'Publish Listing Button', 'Save as Draft Button'],
    apiEndpoints: ['PATCH /api/properties/:id/publish']
  },

  // Owner Application Review Flow
  {
    id: 'own-app-list',
    type: 'screen',
    category: 'owner',
    role: 'owner',
    label: 'Applications Inbox',
    subtitle: 'Tenant Applicant Queue',
    route: '/owner/applications',
    x: 1040,
    y: 800,
    width: 240,
    height: 90,
    icon: '📥',
    description: 'Inbox of all incoming tenant applications sorted by property with credit scores and income ratios.',
    uiComponents: ['Application Cards with Tenant Name, Property, Income Ratio', 'Filter by Property or Status (New, Reviewing, Closed)', 'Quick Reject / Inspect'],
    apiEndpoints: ['GET /api/owner/applications']
  },
  {
    id: 'own-app-detail',
    type: 'screen',
    category: 'owner',
    role: 'owner',
    label: 'Review Tenant Dossier',
    subtitle: 'Verify Background & Docs',
    route: '/owner/applications/:id',
    x: 1040,
    y: 950,
    width: 240,
    height: 100,
    icon: '🔍',
    description: 'Deep-dive applicant analysis: salary statements, credit score check, identity verification, background history.',
    uiComponents: [
      'Tenant Full Profile & Employment Details',
      'Document Viewer (Paystubs, Tax Returns, ID)',
      'Tenant Message & Move-in Date Request',
      'Approve Application Button',
      'Reject Application Button'
    ],
    apiEndpoints: ['GET /api/owner/applications/:id', 'PATCH /api/owner/applications/:id/status']
  },
  {
    id: 'dec-own-approval',
    type: 'decision',
    category: 'decision',
    role: 'owner',
    label: 'Approve or Reject?',
    subtitle: 'Owner Decision Matrix',
    route: null,
    x: 1080,
    y: 1100,
    width: 160,
    height: 110,
    icon: '⚖️',
    description: 'Owner makes binding selection: APPROVE generates a digital lease agreement; REJECT closes application.',
    uiComponents: ['Action Buttons: APPROVE / REJECT'],
    apiEndpoints: []
  },
  {
    id: 'own-app-reject',
    type: 'rejected',
    category: 'rejected',
    role: 'owner',
    label: 'Send Rejection Notice',
    subtitle: 'Application Closed',
    route: '/owner/applications/:id/reject',
    x: 880,
    y: 1250,
    width: 200,
    height: 80,
    icon: '🚫',
    description: 'Sends formal polite notification to applicant and closes application record.',
    uiComponents: ['Rejection Reason Template', 'Send Notification Button'],
    apiEndpoints: ['POST /api/owner/applications/:id/reject']
  },
  {
    id: 'own-send-approval',
    type: 'screen',
    category: 'owner',
    role: 'owner',
    label: 'Generate Digital Agreement',
    subtitle: 'Issue Lease to Tenant',
    route: '/owner/agreements/new',
    x: 1200,
    y: 1250,
    width: 240,
    height: 90,
    icon: '📜',
    description: 'Auto-populates standard tenancy agreement terms, rent amount, security deposit, and sends to tenant for e-sign.',
    uiComponents: ['Standard Lease Template Editor', 'Custom Clauses Input', 'Security Deposit Escrow Setup', 'Send for E-Signature CTA'],
    apiEndpoints: ['POST /api/agreements']
  },
  {
    id: 'own-prop-manage',
    type: 'screen',
    category: 'owner',
    role: 'owner',
    label: 'Active Property Management',
    subtitle: '4 Management Pillars',
    route: '/owner/properties/:id/manage',
    x: 1200,
    y: 1400,
    width: 260,
    height: 110,
    icon: '⚙️',
    description: 'Active tenancy management console divided into 4 core operational branches.',
    uiComponents: [
      'Pillar 1: Tenant Management (Contact, Lease Terms, Status)',
      'Pillar 2: Payment Management (Rent Collection, Escrow, Invoices)',
      'Pillar 3: Maintenance Desk (Tickets, Technician Assignment)',
      'Pillar 4: Direct Chat & Messaging'
    ],
    apiEndpoints: ['GET /api/owner/properties/:id/management']
  },

  // ================= 4. SHARED / SYNCHRONIZED RENTAL LIFECYCLE =================
  {
    id: 'shared-agreement',
    type: 'screen',
    category: 'supporting',
    role: 'shared',
    label: 'Mutual Rental Agreement',
    subtitle: 'Tenant Signs ↔ Owner Issues',
    route: '/agreements/:id/sync',
    x: 140,
    y: 1840,
    width: 320,
    height: 95,
    icon: '📑',
    description: 'Two-way legal binding document. Real-time synchronization of countersignatures and version control.',
    uiComponents: ['Cryptographic Hash Timestamp', 'Mutual Signatures Display', 'Download Certified PDF', 'Lease Term Countdown'],
    apiEndpoints: ['GET /api/agreements/:id']
  },
  {
    id: 'shared-payment',
    type: 'screen',
    category: 'supporting',
    role: 'shared',
    label: 'Rent Payment & Escrow',
    subtitle: 'Tenant Pays ↔ Owner Receives',
    route: '/payments/history',
    x: 540,
    y: 1840,
    width: 320,
    height: 95,
    icon: '💰',
    description: 'Automated recurring monthly billing, instant receipts, bank payouts, and security deposit escrow protection.',
    uiComponents: ['Auto-Pay Settings', 'Real-time Escrow Ledger', 'Download Official Invoices', 'Late Fee Policy Settings'],
    apiEndpoints: ['GET /api/payments', 'POST /api/payments/auto-pay']
  },
  {
    id: 'shared-maintenance',
    type: 'screen',
    category: 'supporting',
    role: 'shared',
    label: 'Maintenance Management',
    subtitle: 'Tenant Reports ↔ Owner Assigns',
    route: '/maintenance/tickets',
    x: 940,
    y: 1840,
    width: 320,
    height: 95,
    icon: '🛠️',
    description: 'Live issue reporting workflow: View Issue → Assign Technician → In Progress → Completed.',
    uiComponents: ['Photo/Video Damage Upload', 'Urgency Level Badge (Low, Medium, Emergency)', 'Technician Dispatcher', 'Status Stepper & Signoff'],
    apiEndpoints: ['GET /api/maintenance', 'POST /api/maintenance', 'PATCH /api/maintenance/:id']
  },
  {
    id: 'shared-messages',
    type: 'screen',
    category: 'supporting',
    role: 'shared',
    label: 'Real-time Messaging',
    subtitle: 'Tenant ↔ Owner Direct Chat',
    route: '/messages',
    x: 1340,
    y: 1840,
    width: 320,
    height: 95,
    icon: '💬',
    description: 'Secure in-app communication channel with file sharing, notification alerts, and message history.',
    uiComponents: ['Direct Instant Messaging Chat', 'File & Photo Attachment', 'Read Receipts & Push Notifications', 'System Event Auto-Messages'],
    apiEndpoints: ['GET /api/messages', 'POST /api/messages']
  },
  {
    id: 'shared-active-rental',
    type: 'screen',
    category: 'supporting',
    role: 'shared',
    label: 'ACTIVE RENTAL STATE',
    subtitle: 'Fulfilled Tenancy Lifecycle',
    route: '/rentals/active',
    x: 740,
    y: 2020,
    width: 340,
    height: 100,
    icon: '🏆',
    description: 'The synchronized operational state of the tenancy uniting both Tenant and Property Owner.',
    uiComponents: ['Active Lease Countdown', 'Live Balance: Paid in Full', 'Maintenance: 0 Open Issues', 'Mutual Satisfaction Rating'],
    apiEndpoints: ['GET /api/rentals/active']
  }
];

export const FLOWCHART_EDGES = [
  // Public flows
  { id: 'e1', source: 'pub-home', target: 'pub-search', label: 'Browse Properties', style: 'solid', role: 'public' },
  { id: 'e2', source: 'pub-home', target: 'pub-owner-cta', label: 'List Your Property', style: 'solid', role: 'public' },
  { id: 'e3', source: 'pub-search', target: 'pub-details', label: 'Select Property', style: 'solid', role: 'public' },

  // Tenant entry from Details
  { id: 'e4', source: 'pub-details', target: 'ten-auth-modal', label: 'Save / Contact / Book / Apply', style: 'solid', role: 'tenant' },
  { id: 'e5', source: 'ten-auth-modal', target: 'ten-dash', label: 'Login / Sign Up Success', style: 'solid', role: 'tenant' },

  // Tenant Booking Flow
  { id: 'e6', source: 'pub-details', target: 'ten-book-modal', label: 'Book Viewing', style: 'dashed', role: 'tenant' },
  { id: 'e7', source: 'ten-book-modal', target: 'ten-book-confirm', label: 'Select Date & Confirm', style: 'solid', role: 'tenant' },
  { id: 'e8', source: 'ten-book-confirm', target: 'ten-dash', label: 'View in Dashboard', style: 'solid', role: 'tenant' },

  // Tenant Application Flow
  { id: 'e9', source: 'pub-details', target: 'ten-app-form', label: 'Apply for Rental', style: 'solid', role: 'tenant' },
  { id: 'e10', source: 'ten-app-form', target: 'ten-app-submitted', label: 'Submit Dossier', style: 'solid', role: 'tenant' },
  { id: 'e11', source: 'ten-app-submitted', target: 'dec-app-approved', label: 'Waiting for Owner', style: 'solid', role: 'tenant' },
  
  // Tenant Application Decision Branches
  { id: 'e12', source: 'dec-app-approved', target: 'ten-lease-sign', label: 'YES (Approved)', style: 'solid', role: 'tenant', branch: 'YES', color: '#16a34a' },
  { id: 'e13', source: 'dec-app-approved', target: 'ten-app-rejected', label: 'NO (Rejected)', style: 'solid', role: 'tenant', branch: 'NO', color: '#dc2626' },
  { id: 'e14', source: 'ten-app-rejected', target: 'pub-search', label: 'Return to Search', style: 'dashed', role: 'tenant' },

  // Tenant Payment to Active
  { id: 'e15', source: 'ten-lease-sign', target: 'ten-payment', label: 'Sign Agreement', style: 'solid', role: 'tenant' },
  { id: 'e16', source: 'ten-payment', target: 'shared-agreement', label: 'Payment Confirmed', style: 'solid', role: 'shared' },

  // Owner Flow
  { id: 'e17', source: 'pub-owner-cta', target: 'own-auth', label: 'Get Started', style: 'solid', role: 'owner' },
  { id: 'e18', source: 'own-auth', target: 'own-dash', label: 'Owner Authentication', style: 'solid', role: 'owner' },
  
  // Owner Add Property
  { id: 'e19', source: 'own-dash', target: 'own-add-wizard', label: 'Add New Property', style: 'solid', role: 'owner' },
  { id: 'e20', source: 'own-add-wizard', target: 'own-preview-publish', label: 'Fill 10 Steps & Preview', style: 'solid', role: 'owner' },
  { id: 'e21', source: 'own-preview-publish', target: 'pub-search', label: 'Publish Listing Live', style: 'dashed', role: 'public' },

  // Owner Review Application
  { id: 'e22', source: 'own-dash', target: 'own-app-list', label: 'Applications', style: 'solid', role: 'owner' },
  { id: 'e23', source: 'own-app-list', target: 'own-app-detail', label: 'Inspect Dossier & Docs', style: 'solid', role: 'owner' },
  { id: 'e24', source: 'own-app-detail', target: 'dec-own-approval', label: 'Evaluation', style: 'solid', role: 'owner' },
  
  // Owner Decision Branches
  { id: 'e25', source: 'dec-own-approval', target: 'own-send-approval', label: 'APPROVE', style: 'solid', role: 'owner', branch: 'APPROVE', color: '#16a34a' },
  { id: 'e26', source: 'dec-own-approval', target: 'own-app-reject', label: 'REJECT', style: 'solid', role: 'owner', branch: 'REJECT', color: '#dc2626' },
  
  // Cross Sync between Owner Approval and Tenant Signing
  { id: 'e27', source: 'own-send-approval', target: 'ten-lease-sign', label: 'Issues Lease for Signing', style: 'dashed', role: 'shared', color: '#0284c7' },
  { id: 'e28', source: 'own-send-approval', target: 'own-prop-manage', label: 'Active Tenant Onboarded', style: 'solid', role: 'owner' },

  // Shared Connections
  { id: 'e29', source: 'own-prop-manage', target: 'shared-agreement', label: 'Manage Lease', style: 'solid', role: 'shared' },
  { id: 'e30', source: 'own-prop-manage', target: 'shared-payment', label: 'Track Rent & Escrow', style: 'solid', role: 'shared' },
  { id: 'e31', source: 'own-prop-manage', target: 'shared-maintenance', label: 'Assign Technicians', style: 'solid', role: 'shared' },
  { id: 'e32', source: 'own-prop-manage', target: 'shared-messages', label: 'Chat with Tenant', style: 'solid', role: 'shared' },

  // Synchronized Active State
  { id: 'e33', source: 'shared-agreement', target: 'shared-active-rental', label: 'Binding', style: 'solid', role: 'shared' },
  { id: 'e34', source: 'shared-payment', target: 'shared-active-rental', label: 'Escrow Validated', style: 'solid', role: 'shared' },
  { id: 'e35', source: 'shared-maintenance', target: 'shared-active-rental', label: 'Resolved Tickets', style: 'solid', role: 'shared' },
  { id: 'e36', source: 'shared-messages', target: 'shared-active-rental', label: 'Active Channel', style: 'solid', role: 'shared' }
];

export const MERMAID_FLOWCHART_DEFINITION = `graph TD
    %% ================= STYLES & COLOR CODING =================
    classDef publicStyle fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#1e3a8a,rx:8,ry:8;
    classDef tenantStyle fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#14532d,rx:8,ry:8;
    classDef ownerStyle fill:#faf5ff,stroke:#9333ea,stroke-width:2px,color:#581c87,rx:8,ry:8;
    classDef decisionStyle fill:#fff7ed,stroke:#ea580c,stroke-width:3px,color:#7c2d12;
    classDef rejectStyle fill:#fef2f2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d,rx:8,ry:8;
    classDef supportStyle fill:#f8fafc,stroke:#64748b,stroke-width:2px,color:#334155,rx:8,ry:8;
    classDef sharedStyle fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,color:#0c4a6e,rx:8,ry:8;

    %% ================= 1. PUBLIC HOMEPAGE =================
    subgraph PublicDiscovery ["🌐 1. PUBLIC HOMEPAGE & DISCOVERY"]
        PUB_HOME["🏠 Public Homepage<br/>• Hero & Search Bar (Location, Type, Price)<br/>• Featured Properties & Categories<br/>• How It Works & Why Choose RentEasy"]:::publicStyle
        PUB_SEARCH["🔍 Browse & Search Properties<br/>• Filter & Sort Catalog<br/>• Results Grid & Map View"]:::publicStyle
        PUB_DETAILS["🏢 Property Details<br/>• Photos, Specs, Amenities, Reviews<br/>• Owner Info, Save, Contact, Book, Apply"]:::publicStyle
        PUB_CTA["📢 List Your Property CTA<br/>• Landlord Pitch & Calculator"]:::publicStyle

        PUB_HOME -->|Browse Properties| PUB_SEARCH
        PUB_HOME -->|List Your Property| PUB_CTA
        PUB_SEARCH -->|Select Listing| PUB_DETAILS
    end

    %% ================= 2. TENANT JOURNEY =================
    subgraph TenantJourney ["🟢 2. TENANT JOURNEY"]
        TEN_AUTH["🔐 Tenant Login / Sign Up<br/>Triggered upon Save/Book/Apply"]:::supportStyle
        TEN_DASH["📊 Tenant Dashboard<br/>Nav: Home | Properties | Saved | My Rentals | Messages | Profile"]:::tenantStyle

        %% Booking Subflow
        TEN_BOOK["📅 Book Viewing<br/>Select Date & Time Slot"]:::supportStyle
        TEN_BOOK_CONF["✅ Booking Successful<br/>Saved in My Bookings"]:::tenantStyle

        %% Application Subflow
        TEN_APP["📝 Rental Application<br/>Personal Info, Income, Docs"]:::supportStyle
        TEN_WAIT["⏳ Application Submitted<br/>Waiting for Owner Review"]:::tenantStyle
        DEC_TEN_APP{"⚖️ Application Approved?"}:::decisionStyle
        TEN_REJECT["❌ Application Rejected<br/>Return to Search"]:::rejectStyle
        TEN_LEASE["✍️ Sign Rental Agreement<br/>Digital Signature & Terms"]:::tenantStyle
        TEN_PAY["💳 Deposit & Rent Payment<br/>Payment Confirmation"]:::supportStyle
        TEN_RENTAL["🏠 My Rental Dashboard"]:::tenantStyle

        PUB_DETAILS -->|Save / Contact / Book / Apply| TEN_AUTH
        TEN_AUTH -->|Authenticated| TEN_DASH

        PUB_DETAILS -->|Book Viewing| TEN_BOOK
        TEN_BOOK -->|Confirm Slot| TEN_BOOK_CONF
        TEN_BOOK_CONF -->|View in Dashboard| TEN_DASH

        PUB_DETAILS -->|Apply for Rental| TEN_APP
        TEN_APP -->|Submit Documents| TEN_WAIT
        TEN_WAIT --> DEC_TEN_APP

        DEC_TEN_APP -->|YES| TEN_LEASE
        DEC_TEN_APP -->|NO| TEN_REJECT
        TEN_REJECT -.->|Return to Catalog| PUB_SEARCH

        TEN_LEASE -->|E-Signed| TEN_PAY
        TEN_PAY -->|Confirmed| TEN_RENTAL
    end

    %% ================= 3. OWNER JOURNEY =================
    subgraph OwnerJourney ["🟣 3. PROPERTY OWNER JOURNEY"]
        OWN_AUTH["🔑 Owner Login / Sign Up<br/>Landlord Portal"]:::supportStyle
        OWN_DASH["📈 Owner Dashboard<br/>Nav: Dashboard | My Properties | Applications | Tenants | Payments | Messages | Profile"]:::ownerStyle

        %% Add Property Wizard
        OWN_ADD["🏗️ Add New Property Wizard<br/>Type, Location, Price, Rooms, Amenities, Photos"]:::supportStyle
        OWN_PUB["🚀 Preview & Publish<br/>Property Successfully Published"]:::ownerStyle

        %% Application Review Subflow
        OWN_APPS["📥 Applications Queue<br/>View Tenant Applicants"]:::ownerStyle
        OWN_REVIEW["🔍 Review Dossier<br/>Tenant Info, Docs, Income"]:::ownerStyle
        DEC_OWN_APP{"⚖️ Approve or Reject?"}:::decisionStyle
        OWN_REJECT["🚫 Send Rejection<br/>Application Closed"]:::rejectStyle
        OWN_AGREE["📜 Issue Rental Agreement<br/>Standard Lease Generator"]:::ownerStyle

        %% 4 Property Management Pillars
        OWN_MANAGE["⚙️ Active Property Management<br/>Four Operational Branches"]:::ownerStyle

        PUB_CTA -->|Get Started| OWN_AUTH
        OWN_AUTH -->|Authenticated| OWN_DASH

        OWN_DASH -->|Add Property| OWN_ADD
        OWN_ADD -->|Step-by-Step Wizard| OWN_PUB
        OWN_PUB -.->|Listed in Public Catalog| PUB_SEARCH

        OWN_DASH -->|Applications| OWN_APPS
        OWN_APPS -->|Inspect Applicant| OWN_REVIEW
        OWN_REVIEW --> DEC_OWN_APP

        DEC_OWN_APP -->|APPROVE| OWN_AGREE
        DEC_OWN_APP -->|REJECT| OWN_REJECT

        OWN_AGREE -->|Tenant Signs & Pays| OWN_MANAGE
    end

    %% ================= 4. TWO-WAY RENTAL MANAGEMENT & SYNC =================
    subgraph RentalSync ["🔄 4. TENANT ↔ OWNER SYNCHRONIZATION"]
        SYNC_LEASE["📑 Rental Agreement<br/>Tenant E-Signs ↔ Owner Issues"]:::sharedStyle
        SYNC_PAY["💰 Rent Payment & Escrow<br/>Tenant Pays ↔ Owner Receives"]:::sharedStyle
        SYNC_MAINT["🛠️ Maintenance Management<br/>Tenant Reports ↔ Owner Assigns Tech"]:::sharedStyle
        SYNC_MSG["💬 Real-time Messaging<br/>Tenant ↔ Owner Chat"]:::sharedStyle
        SYNC_ACTIVE["🏆 ACTIVE RENTAL STATE<br/>Synchronized Tenancy"]:::sharedStyle

        TEN_LEASE <-->|Two-Way Lease Binding| SYNC_LEASE
        OWN_AGREE <-->|Two-Way Lease Binding| SYNC_LEASE

        TEN_PAY <-->|Escrow & Ledger| SYNC_PAY
        OWN_MANAGE <-->|Payment Management| SYNC_PAY

        TEN_RENTAL <-->|Report Issue| SYNC_MAINT
        OWN_MANAGE <-->|Assign Technician| SYNC_MAINT

        TEN_DASH <-->|Direct Chat| SYNC_MSG
        OWN_MANAGE <-->|Direct Chat| SYNC_MSG

        SYNC_LEASE --> SYNC_ACTIVE
        SYNC_PAY --> SYNC_ACTIVE
        SYNC_MAINT --> SYNC_ACTIVE
        SYNC_MSG --> SYNC_ACTIVE
    end
`;
