import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    name: {
      type: String,
      trim: true
    },
    // Backwards compatibility alias for title
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['APARTMENT', 'HOUSE', 'CONDO', 'VILLA', 'ROOM', 'SHOP', 'Apartment', 'House', 'Condo', 'Villa', 'Room', 'Shop', 'Studio', 'Townhouse'],
      default: 'APARTMENT',
      index: true
    },
    address: {
      type: String,
      default: 'Phnom Penh, Cambodia'
    },
    location: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      default: 'Phnom Penh',
      index: true
    },
    district: {
      type: String,
      trim: true
    },
    province: {
      type: String,
      trim: true
    },
    latitude: {
      type: Number,
      default: 11.5564
    },
    longitude: {
      type: Number,
      default: 104.9282
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE', 'AVAILABLE', 'Pending', 'Approved', 'Rejected', 'Inactive', 'Available'],
      default: 'APPROVED',
      index: true
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
    },
    images: [{
      type: String
    }],
    // Base/highlight rent price
    price: {
      type: Number,
      default: 0,
      index: true
    },
    deposit: {
      type: Number,
      default: 0
    },
    bedrooms: {
      type: Number,
      default: 1
    },
    bathrooms: {
      type: Number,
      default: 1
    },
    sqft: {
      type: Number,
      default: 500
    },
    amenities: [{
      type: String
    }],
    featured: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.9
    },
    reviewsCount: {
      type: Number,
      default: 10
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-validate & pre-save normalization
propertySchema.pre('validate', function (next) {
  if (this.name && !this.title) {
    this.title = this.name;
  }
  if (this.title && !this.name) {
    this.name = this.title;
  }
  if (!this.name && !this.title) {
    this.name = 'Modern Rental Property';
    this.title = 'Modern Rental Property';
  }
  if (!this.address && this.location) {
    this.address = this.location;
  }
  if (!this.location && this.address) {
    this.location = this.address;
  }
  if (!this.city) {
    this.city = 'Phnom Penh';
  }
  if (!this.status || this.status === 'Available') {
    this.status = 'APPROVED';
  }
  if (!this.image && this.images && this.images.length > 0) {
    this.image = this.images[0];
  }
  if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
  next();
});

// Indexes for high performance search and filter
propertySchema.index({ name: 'text', title: 'text', description: 'text', address: 'text', city: 'text' });
propertySchema.index({ type: 1, city: 1, price: 1, status: 1 });

export const Property = mongoose.model('Property', propertySchema);
