import mongoose from 'mongoose';

const maintenanceRequestSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tenant ID is required'],
      index: true
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord ID is required'],
      index: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      index: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      index: true
    },
    title: {
      type: String,
      required: [true, 'Maintenance title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Maintenance description is required'],
      trim: true
    },
    imageUrl: {
      type: String
    },
    urgency: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'],
      default: 'MEDIUM'
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    technician: {
      type: String,
      default: 'Unassigned'
    },
    landlordResponse: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const MaintenanceRequest = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
