import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { Property } from '../models/property.model.js';
import { Room } from '../models/room.model.js';
import { RentalRequest } from '../models/rentalRequest.model.js';
import { RentalContract } from '../models/rentalContract.model.js';
import { Payment } from '../models/payment.model.js';
import { MaintenanceRequest } from '../models/maintenanceRequest.model.js';
import { Notification } from '../models/notification.model.js';
import { Item } from '../models/item.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rent-easy-db';

export const SEED_PROPERTIES = [
  {
    title: 'The Peak Luxury Riverview Penthouse',
    name: 'The Peak Luxury Riverview Penthouse',
    type: 'CONDO',
    location: 'The Peak, Tonle Bassac, Phnom Penh, Cambodia',
    city: 'Phnom Penh',
    district: 'Tonle Bassac',
    address: 'The Peak Executive Towers, Samdech Hun Sen St, Tonle Bassac',
    price: 2600,
    deposit: 2600,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 1620,
    featured: true,
    status: 'APPROVED',
    rating: 4.96,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Mekong River View', 'Infinity Pool', 'Shangri-La Complex Access', 'Fitness Gym & Sauna', '24/7 Security & Concierge', 'Smart Home Keyless'],
    description: 'Ultra-luxurious high-floor penthouse overlooking the confluence of the Tonle Sap and Mekong rivers in Tonle Bassac, Phnom Penh. Direct access to premier shopping and dining.'
  },
  {
    title: 'Silvertown Modern Sky Residence',
    name: 'Silvertown Modern Sky Residence',
    type: 'APARTMENT',
    location: 'BKK1 (Boeung Keng Kang 1), Phnom Penh, Cambodia',
    city: 'Phnom Penh',
    district: 'Boeung Keng Kang',
    address: 'St 288, BKK1, Phnom Penh',
    price: 1450,
    deposit: 1450,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    featured: true,
    status: 'APPROVED',
    rating: 4.91,
    reviewsCount: 32,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Rooftop Swimming Pool', 'Sky Bar & Lounge', 'Gym & Fitness Center', 'High-Speed Fiber WiFi', 'Housekeeping Service', 'Underground Parking'],
    description: 'Premier expat residential apartment in the heart of BKK1, surrounded by international cafes, embassies, and fine dining. Features private balcony and bespoke teak finishes.'
  },
  {
    title: 'Grand Toul Kork Tropical Villa with Pool',
    name: 'Grand Toul Kork Tropical Villa with Pool',
    type: 'VILLA',
    location: 'Toul Kork (TK), Phnom Penh, Cambodia',
    city: 'Phnom Penh',
    district: 'Toul Kork',
    address: 'St 315, Toul Kork, Phnom Penh',
    price: 3800,
    deposit: 3800,
    bedrooms: 5,
    bathrooms: 5.5,
    sqft: 3800,
    featured: true,
    status: 'APPROVED',
    rating: 4.98,
    reviewsCount: 21,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    amenities: ['Private Swimming Pool', 'Landscaped Garden', '4-Car Gated Parking', 'Maid Quarter', 'Modern Western Kitchen', '24/7 Security Patrol'],
    description: 'Exquisite private sanctuary in prestigious Toul Kork near international schools. Expansive outdoor entertaining patio, salt-water pool, and floor-to-ceiling glass design.'
  },
  {
    title: 'Riverside French Colonial Studio',
    name: 'Riverside French Colonial Studio',
    type: 'ROOM',
    location: 'Daun Penh (Riverside / Wat Phnom), Phnom Penh, Cambodia',
    city: 'Phnom Penh',
    district: 'Daun Penh',
    address: 'Sisowath Quay, Daun Penh, Phnom Penh',
    price: 750,
    deposit: 750,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    featured: false,
    status: 'APPROVED',
    rating: 4.86,
    reviewsCount: 26,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Riverfront Balcony', 'High 14ft Ceilings', 'Restored Hardwood Floors', 'Fully Furnished', 'In-Unit Washer', 'High-Speed WiFi'],
    description: 'Charming boutique studio on Sisowath Quay overlooking the Tonle Sap river promenade. Steps away from the Royal Palace, National Museum, and artisan coffee houses.'
  },
  {
    title: 'Diamond Island Waterfront Sunset Tower',
    name: 'Diamond Island Waterfront Sunset Tower',
    type: 'CONDO',
    location: 'Koh Pich (Diamond Island), Phnom Penh, Cambodia',
    city: 'Phnom Penh',
    district: 'Koh Pich',
    address: 'Elite Town Road, Koh Pich, Phnom Penh',
    price: 1800,
    deposit: 1800,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1250,
    featured: true,
    status: 'APPROVED',
    rating: 4.93,
    reviewsCount: 35,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Panoramic River Views', 'Olympic Infinity Pool', 'Tennis Court', 'Smart Keyless Access', 'Direct Boardwalk Access'],
    description: 'Modern luxury high-rise condominium on Diamond Island (Koh Pich) offering spectacular sunset views, riverside jogging trails, and world-class building amenities.'
  },
  {
    title: 'Urban Industrial Loft @ Russian Market',
    name: 'Urban Industrial Loft @ Russian Market',
    type: 'APARTMENT',
    location: 'Toul Tom Poung (Russian Market), Phnom Penh, Cambodia',
    city: 'Phnom Penh',
    district: 'Toul Tom Poung',
    address: 'St 450, Toul Tom Poung 1, Phnom Penh',
    price: 950,
    deposit: 950,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 950,
    featured: false,
    status: 'APPROVED',
    rating: 4.88,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Rooftop Terrace & Jacuzzi', 'Balcony', 'Modern Western Kitchen', 'Elevator', 'Pet Friendly', 'High-Speed WiFi'],
    description: 'Contemporary loft in vibrant Toul Tom Poung (TTP). Open floor layout with polished concrete floors, custom industrial lighting, and walking distance to lively cafes.'
  },
  {
    title: 'Grand Star Platinum Gated Townhouse',
    name: 'Grand Star Platinum Gated Townhouse',
    type: 'HOUSE',
    location: 'Borey Peng Huoth, Chbar Ampov, Phnom Penh, Cambodia',
    city: 'Phnom Penh',
    district: 'Chbar Ampov',
    address: 'National Highway 1, Borey Peng Huoth, Phnom Penh',
    price: 1900,
    deposit: 1900,
    bedrooms: 4,
    bathrooms: 4,
    sqft: 2400,
    featured: false,
    status: 'APPROVED',
    rating: 4.94,
    reviewsCount: 17,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    amenities: ['Gated Community', 'Euro Park Access', 'Private Clubhouse & Gym', 'Family Park & Playground', '24/7 Security Patrol'],
    description: 'Spacious family townhouse in Cambodia’s most sought-after master-planned community. Peaceful green neighborhood with international convenience and European-styled parks.'
  }
];

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }

    console.log('🌱 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Property.deleteMany({}),
      Room.deleteMany({}),
      RentalRequest.deleteMany({}),
      RentalContract.deleteMany({}),
      Payment.deleteMany({}),
      MaintenanceRequest.deleteMany({}),
      Notification.deleteMany({}),
      Item.deleteMany({})
    ]);

    console.log('👤 Creating Seed Users (Admin, Landlord, Tenants)...');
    const salt = await bcrypt.genSalt(10);

    const admin = new User({
      fullName: 'System Administrator',
      name: 'System Administrator',
      email: 'admin@renteasy.com',
      password: 'Admin123!',
      role: 'ADMIN',
      phone: '+1 (555) 999-0000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'ACTIVE'
    });
    await admin.save();

    const landlord = new User({
      fullName: 'Alexander Sterling',
      name: 'Alexander Sterling',
      email: 'landlord@renteasy.com',
      password: 'Landlord123!',
      role: 'LANDLORD',
      phone: '+1 (555) 901-4433',
      employment: 'Managing Director @ Sterling Estates LLC',
      annualIncome: '$450,000 / yr',
      creditScore: 810,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      status: 'ACTIVE'
    });
    await landlord.save();

    const tenant1 = new User({
      fullName: 'Sophie Taylor',
      name: 'Sophie Taylor',
      email: 'tenant@renteasy.com',
      password: 'Tenant123!',
      role: 'TENANT',
      phone: '+1 (555) 234-5678',
      employment: 'Product Design Lead @ Canva',
      annualIncome: '$165,000 / yr',
      creditScore: 790,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      status: 'ACTIVE'
    });
    await tenant1.save();

    const tenant2 = new User({
      fullName: 'Pinky Dev',
      name: 'Pinky Dev',
      email: 'pinky@renteasy.com',
      password: 'password123',
      role: 'TENANT',
      phone: '+1 (555) 382-9912',
      employment: 'Senior Software Engineer @ Stripe',
      annualIncome: '$195,000 / yr',
      creditScore: 785,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'ACTIVE'
    });
    await tenant2.save();

    console.log('🏢 Creating Properties and Rooms...');
    const savedProperties = [];
    const savedRooms = [];

    for (const p of SEED_PROPERTIES) {
      const property = new Property({
        ...p,
        landlordId: landlord._id
      });
      await property.save();
      savedProperties.push(property);

      // Create 2-3 rooms per property
      for (let i = 1; i <= 3; i++) {
        const room = new Room({
          propertyId: property._id,
          roomNumber: `Unit #${i}0${i}`,
          floor: i,
          roomType: i === 1 ? 'Master Suite' : (i === 2 ? 'Deluxe Room' : 'Studio Loft'),
          price: property.price - (3 - i) * 150,
          deposit: property.deposit,
          size: Math.round(property.sqft / 3),
          description: `Spacious ${property.type} room unit on floor ${i} with premium fixtures.`,
          images: property.images,
          status: i === 1 ? 'RENTED' : 'AVAILABLE'
        });
        await room.save();
        savedRooms.push(room);
      }
    }

    console.log('📝 Creating Rental Requests & Contracts...');
    const req1 = new RentalRequest({
      tenantId: tenant1._id,
      landlordId: landlord._id,
      propertyId: savedProperties[0]._id,
      roomId: savedRooms[0]._id,
      message: 'Hello Alexander, I loved the Penthouse view. Verified employment documents attached.',
      status: 'ACCEPTED'
    });
    await req1.save();

    const req2 = new RentalRequest({
      tenantId: tenant2._id,
      landlordId: landlord._id,
      propertyId: savedProperties[1]._id,
      roomId: savedRooms[3]._id,
      message: 'Inquiring about a 6-month lease for the Silvertown residence.',
      status: 'PENDING'
    });
    await req2.save();

    const contract1 = new RentalContract({
      contractNumber: 'CTR-2026-0901',
      landlordId: landlord._id,
      tenantId: tenant1._id,
      propertyId: savedProperties[0]._id,
      roomId: savedRooms[0]._id,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2027-08-31'),
      monthlyRent: savedProperties[0].price,
      deposit: savedProperties[0].deposit,
      paymentDueDay: 1,
      status: 'ACTIVE'
    });
    await contract1.save();

    console.log('💳 Creating Payments & Maintenance Requests...');
    const payment1 = new Payment({
      contractId: contract1._id,
      tenantId: tenant1._id,
      landlordId: landlord._id,
      amount: savedProperties[0].price,
      paymentDate: new Date(),
      paymentMethod: 'ABA',
      status: 'PAID',
      receiptNumber: `REC-${Date.now()}-9812`,
      description: 'September 2026 Monthly Rent (ABA Pay KHQR Settlement)'
    });
    await payment1.save();

    const ticket1 = new MaintenanceRequest({
      tenantId: tenant1._id,
      landlordId: landlord._id,
      propertyId: savedProperties[0]._id,
      roomId: savedRooms[0]._id,
      title: 'Air Conditioning Scheduled Filter Maintenance',
      description: 'Living room inverter AC unit requires bi-annual filter deep cleaning.',
      urgency: 'MEDIUM',
      status: 'IN_PROGRESS',
      technician: 'Assigned: Heng Dara (Senior HVAC Tech)',
      landlordResponse: 'Technician scheduled for inspection tomorrow at 2:00 PM.'
    });
    await ticket1.save();

    const notif1 = new Notification({
      userId: tenant1._id,
      title: 'Welcome to RentEasy! 🏠',
      message: 'Your active 12-month lease contract CTR-2026-0901 has been executed.',
      type: 'CONTRACT_ACTIVE'
    });
    await notif1.save();

    // Test DB items
    await Item.create([
      { title: 'Penthouse Unit 42B', description: 'Luxury 3-bedroom unit', category: 'Condo', price: 2600 },
      { title: 'BKK1 Sky Suite', description: 'Modern expat suite', category: 'Apartment', price: 1450 }
    ]);

    console.log('🎉 Database Seed Completed Successfully!');
    return {
      users: 4,
      properties: savedProperties.length,
      rooms: savedRooms.length,
      requests: 2,
      contracts: 1,
      payments: 1,
      tickets: 1
    };
  } catch (error) {
    console.error('❌ Error during database seed:', error);
    throw error;
  }
};

// If run directly: node src/scripts/seed.js
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Seed error:', err);
      process.exit(1);
    });
}
