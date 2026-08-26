import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Apartment', 'Condo', 'Villa', 'Studio', 'House', 'Townhouse'],
      default: 'Apartment'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Monthly rent price is required'],
      min: 0
    },
    deposit: {
      type: Number,
      required: true,
      min: 0
    },
    bedrooms: {
      type: Number,
      required: true,
      default: 1
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 1
    },
    sqft: {
      type: Number,
      default: 800
    },
    featured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 12
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    },
    amenities: {
      type: [String],
      default: ['WiFi', 'Air Conditioning', 'Parking']
    },
    description: {
      type: String,
      default: ''
    },
    owner: {
      name: { type: String, default: 'Alexander Sterling' },
      trustScore: { type: String, default: '99% Verified Landlord' },
      responseRate: { type: String, default: '15 mins' },
      totalProperties: { type: Number, default: 4 }
    },
    status: {
      type: String,
      enum: ['Available', 'Rented', 'Pending'],
      default: 'Available'
    }
  },
  {
    timestamps: true
  }
);

export const Property = mongoose.model('Property', propertySchema);
