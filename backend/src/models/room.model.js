import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
      index: true
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true
    },
    floor: {
      type: Number,
      default: 1
    },
    roomType: {
      type: String,
      default: 'Standard Unit',
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Room price is required']
    },
    deposit: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 35
    },
    description: {
      type: String,
      trim: true
    },
    images: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE'],
      default: 'AVAILABLE',
      index: true
    }
  },
  {
    timestamps: true
  }
);

roomSchema.index({ propertyId: 1, roomNumber: 1 }, { unique: true });

export const Room = mongoose.model('Room', roomSchema);
