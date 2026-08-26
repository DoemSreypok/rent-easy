import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Property } from '../models/property.model.js';
import { Application } from '../models/application.model.js';
import { Booking } from '../models/booking.model.js';
import { Maintenance } from '../models/maintenance.model.js';
import { Message } from '../models/message.model.js';
import { Item } from '../models/item.model.js';
import { User } from '../models/user.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rent_easy_db';

export const SEED_USERS = [
  {
    name: 'Sophie Taylor',
    email: 'sophie@renteasy.com',
    password: 'password123',
    role: 'tenant',
    phone: '+1 (555) 382-9912',
    employment: 'Senior Software Engineer @ Stripe',
    annualIncome: '$195,000 / yr',
    creditScore: 785,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
  },
  {
    name: 'Alexander Sterling',
    email: 'alexander@renteasy.com',
    password: 'password123',
    role: 'owner',
    phone: '+1 (555) 901-4433',
    employment: 'Managing Director @ Sterling Estates LLC',
    annualIncome: '$450,000 / yr',
    creditScore: 810,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander'
  }
];

export const SEED_PROPERTIES = [
  {
    title: 'The Peak Luxury Riverview Penthouse',
    type: 'Condo',
    location: 'The Peak, Tonle Bassac, Phnom Penh, Cambodia',
    price: 2600,
    deposit: 2600,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1620,
    featured: true,
    rating: 4.96,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    amenities: ['Mekong River View', 'Infinity Pool', 'Shangri-La Complex Access', 'Fitness Gym & Sauna', '24/7 Security & Concierge', 'Smart Home Keyless'],
    description: 'Ultra-luxurious high-floor penthouse overlooking the confluence of the Tonle Sap and Mekong rivers in Tonle Bassac, Phnom Penh. Direct access to premier shopping and dining.',
    owner: {
      name: 'Alexander Sterling',
      trustScore: '100% Verified Landlord',
      responseRate: '10 mins',
      totalProperties: 6
    },
    status: 'Available'
  },
  {
    title: 'Silvertown Modern Sky Residence',
    type: 'Apartment',
    location: 'BKK1 (Boeung Keng Kang 1), Phnom Penh, Cambodia',
    price: 1450,
    deposit: 1450,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    featured: true,
    rating: 4.91,
    reviewsCount: 32,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    amenities: ['Rooftop Swimming Pool', 'Sky Bar & Lounge', 'Gym & Fitness Center', 'High-Speed Fiber WiFi', 'Housekeeping Service', 'Underground Parking'],
    description: 'Premier expat residential apartment in the heart of BKK1, surrounded by international cafes, embassies, and fine dining. Features private balcony and bespoke teak finishes.',
    owner: {
      name: 'Sokha Chan',
      trustScore: '99% SuperHost',
      responseRate: '5 mins',
      totalProperties: 4
    },
    status: 'Available'
  },
  {
    title: 'Grand Toul Kork Tropical Villa with Pool',
    type: 'Villa',
    location: 'Toul Kork (TK), Phnom Penh, Cambodia',
    price: 3800,
    deposit: 3800,
    bedrooms: 5,
    bathrooms: 5.5,
    sqft: 3800,
    featured: true,
    rating: 4.98,
    reviewsCount: 21,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Swimming Pool', 'Landscaped Garden', '4-Car Gated Parking', 'Maid Quarter', 'Modern Western Kitchen', '24/7 Security Patrol'],
    description: 'Exquisite private sanctuary in prestigious Toul Kork near international schools. Expansive outdoor entertaining patio, salt-water pool, and floor-to-ceiling glass design.',
    owner: {
      name: 'Rithy Dara',
      trustScore: '100% Verified Landlord',
      responseRate: '15 mins',
      totalProperties: 2
    },
    status: 'Available'
  },
  {
    title: 'Riverside French Colonial Studio',
    type: 'Studio',
    location: 'Daun Penh (Riverside / Wat Phnom), Phnom Penh, Cambodia',
    price: 750,
    deposit: 750,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    featured: false,
    rating: 4.86,
    reviewsCount: 26,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    amenities: ['Riverfront Balcony', 'High 14ft Ceilings', 'Restored Hardwood Floors', 'Fully Furnished', 'In-Unit Washer', 'High-Speed WiFi'],
    description: 'Charming boutique studio on Sisowath Quay overlooking the Tonle Sap river promenade. Steps away from the Royal Palace, National Museum, and artisan coffee houses.',
    owner: {
      name: 'Bopha Pich',
      trustScore: '98% SuperHost',
      responseRate: '20 mins',
      totalProperties: 3
    },
    status: 'Available'
  },
  {
    title: 'Diamond Island Waterfront Sunset Tower',
    type: 'Condo',
    location: 'Koh Pich (Diamond Island), Phnom Penh, Cambodia',
    price: 1800,
    deposit: 1800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1250,
    featured: true,
    rating: 4.93,
    reviewsCount: 35,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    amenities: ['Panoramic River Views', 'Olympic Infinity Pool', 'Tennis Court', 'Smart Keyless Access', 'Direct Boardwalk Access'],
    description: 'Modern luxury high-rise condominium on Diamond Island (Koh Pich) offering spectacular sunset views, riverside jogging trails, and world-class building amenities.',
    owner: {
      name: 'Alexander Sterling',
      trustScore: '100% Verified Landlord',
      responseRate: '10 mins',
      totalProperties: 6
    },
    status: 'Available'
  },
  {
    title: 'Urban Industrial Loft @ Russian Market',
    type: 'Apartment',
    location: 'Toul Tom Poung (Russian Market), Phnom Penh, Cambodia',
    price: 950,
    deposit: 950,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 950,
    featured: false,
    rating: 4.88,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    amenities: ['Rooftop Terrace & Jacuzzi', 'Balcony', 'Modern Western Kitchen', 'Elevator', 'Pet Friendly', 'High-Speed WiFi'],
    description: 'Contemporary loft in vibrant Toul Tom Poung (TTP). Open floor layout with polished concrete floors, custom industrial lighting, and walking distance to lively cafes.',
    owner: {
      name: 'Vannak Heng',
      trustScore: '99% Verified Landlord',
      responseRate: '10 mins',
      totalProperties: 2
    },
    status: 'Available'
  },
  {
    title: 'Grand Star Platinum Gated Townhouse',
    type: 'Townhouse',
    location: 'Borey Peng Huoth, Chbar Ampov, Phnom Penh, Cambodia',
    price: 1900,
    deposit: 1900,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 2400,
    featured: false,
    rating: 4.94,
    reviewsCount: 17,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    amenities: ['Gated Community', 'Euro Park Access', 'Private Clubhouse & Gym', 'Family Park & Playground', '24/7 Security Patrol'],
    description: 'Spacious family townhouse in Cambodia’s most sought-after master-planned community. Peaceful green neighborhood with international convenience and European-styled parks.',
    owner: {
      name: 'Chenda Meng',
      trustScore: '100% SuperHost',
      responseRate: '15 mins',
      totalProperties: 1
    },
    status: 'Available'
  }
];

export const SEED_APPLICATIONS = [
  {
    propertyId: 'prop-1',
    propertyTitle: 'The Peak Luxury Riverview Penthouse',
    tenantName: 'Sophie Taylor',
    email: 'sophie@renteasy.com',
    phone: '+855 12 345 678',
    employment: 'Regional Director @ Grab Southeast Asia',
    annualIncome: '$120,000 / yr',
    creditScore: 785,
    moveInDate: '2026-09-01',
    status: 'Pending',
    documents: ['Passport_Verified.pdf', 'Work_Permit_Cambodia.pdf', 'Employment_Letter_Grab.pdf'],
    message: 'Relocating to Phnom Penh for a 2-year assignment. Verified international employment docs attached.'
  },
  {
    propertyId: 'prop-2',
    propertyTitle: 'Grand Toul Kork Tropical Villa with Pool',
    tenantName: 'Dr. Lucas Vance',
    email: 'lucas.vance@ispp.edu.kh',
    phone: '+855 23 881 209',
    employment: 'Head of Faculty @ ISPP International School',
    annualIncome: '$150,000 / yr',
    creditScore: 810,
    moveInDate: '2026-10-01',
    status: 'Approved',
    documents: ['Passport_Copy.pdf', 'ISPP_Faculty_Contract.pdf', 'Bank_Statement.pdf'],
    message: 'Relocating with family near the Toul Kork campus.'
  }
];

export const SEED_BOOKINGS = [
  {
    propertyId: 'prop-1',
    propertyTitle: 'The Peak Luxury Riverview Penthouse',
    tenantName: 'Sophie Taylor',
    date: '2026-08-28',
    timeSlot: '14:00 - 15:00',
    type: 'In-Person Tour',
    status: 'Confirmed'
  },
  {
    propertyId: 'prop-2',
    propertyTitle: 'Silvertown Modern Sky Residence',
    tenantName: 'Sreypok Doem',
    date: '2026-08-29',
    timeSlot: '10:00 - 11:00',
    type: 'Live Video Call',
    status: 'Confirmed'
  }
];

export const SEED_MAINTENANCE = [
  {
    propertyTitle: 'The Peak Luxury Riverview Penthouse',
    unit: 'Penthouse #42B',
    issue: 'Air Conditioner Filter Cleaning & Balcony Sensor Check',
    urgency: 'Medium',
    status: 'In Progress',
    technician: 'Vannara HVAC Services (Phnom Penh)',
    reportedAt: new Date('2026-08-23T10:00:00Z')
  },
  {
    propertyTitle: 'Silvertown Modern Sky Residence',
    unit: 'Unit #804',
    issue: 'Water Pressure Booster Check',
    urgency: 'Low',
    status: 'Completed',
    technician: 'BKK1 Apex Maintenance Team',
    reportedAt: new Date('2026-08-20T14:30:00Z')
  }
];

export const SEED_MESSAGES = [
  {
    sender: 'Alexander Sterling (Owner)',
    role: 'owner',
    text: 'Hello Sophie! I reviewed your application. Everything looks stellar. I am issuing the digital lease now.',
    timestamp: '10:45 AM'
  },
  {
    sender: 'Sophie Taylor (Tenant)',
    role: 'tenant',
    text: 'Thank you Alexander! I will review and e-sign as soon as it arrives.',
    timestamp: '10:48 AM'
  },
  {
    sender: 'RentEasy System',
    role: 'system',
    text: 'Security Deposit of $3,800 is now securely held in Escrow Trust.',
    timestamp: '11:02 AM'
  }
];

export const SEED_ITEMS = [
  {
    title: 'Skyline Luxury Penthouse Unit 42B',
    description: '3-Bedroom Panoramic View Penthouse with Concierge',
    category: 'Condo',
    price: 3800
  },
  {
    title: 'Palisades Sunset Garden Villa',
    description: '4-Bedroom Mid-Century Architectural Oasis with Pool',
    category: 'Villa',
    price: 5200
  },
  {
    title: 'SoHo Cast-Iron Industrial Loft',
    description: '1-Bedroom Loft with Exposed Brick & High Ceilings',
    category: 'Apartment',
    price: 2400
  }
];

export const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully.');

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Application.deleteMany({});
    await Booking.deleteMany({});
    await Maintenance.deleteMany({});
    await Message.deleteMany({});
    await Item.deleteMany({});

    console.log('🌱 Seeding Users (Tenant & Owner)...');
    const createdUsers = await User.insertMany(SEED_USERS);

    console.log('🌱 Seeding Properties...');
    const createdProperties = await Property.insertMany(SEED_PROPERTIES);

    // Link first property's MongoDB ID to sample applications and bookings
    if (createdProperties.length > 0) {
      SEED_APPLICATIONS[0].propertyId = createdProperties[0]._id.toString();
      SEED_BOOKINGS[0].propertyId = createdProperties[0]._id.toString();
    }

    console.log('🌱 Seeding Applications...');
    await Application.insertMany(SEED_APPLICATIONS);

    console.log('🌱 Seeding Bookings...');
    await Booking.insertMany(SEED_BOOKINGS);

    console.log('🌱 Seeding Maintenance Tickets...');
    await Maintenance.insertMany(SEED_MAINTENANCE);

    console.log('🌱 Seeding Messages...');
    await Message.insertMany(SEED_MESSAGES);

    console.log('🌱 Seeding Generic Items for Backend Health...');
    await Item.insertMany(SEED_ITEMS);

    console.log('\n======================================================');
    console.log('🎉 MongoDB RentEasy Database Seeded Successfully!');
    console.log(`🏠 Properties seeded:     ${createdProperties.length}`);
    console.log(`📝 Applications seeded:   ${SEED_APPLICATIONS.length}`);
    console.log(`📅 Bookings seeded:       ${SEED_BOOKINGS.length}`);
    console.log(`🛠️ Maintenance tickets:   ${SEED_MAINTENANCE.length}`);
    console.log(`💬 Messages seeded:       ${SEED_MESSAGES.length}`);
    console.log(`📦 Generic items seeded:  ${SEED_ITEMS.length}`);
    console.log('======================================================\n');

    return {
      success: true,
      counts: {
        properties: createdProperties.length,
        applications: SEED_APPLICATIONS.length,
        bookings: SEED_BOOKINGS.length,
        maintenance: SEED_MAINTENANCE.length,
        messages: SEED_MESSAGES.length,
        items: SEED_ITEMS.length
      }
    };
  } catch (error) {
    console.error('❌ Error during MongoDB seeding:', error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('Seeding complete. Closing database connection.');
      mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      mongoose.connection.close();
      process.exit(1);
    });
}
