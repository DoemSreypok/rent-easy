import mongoose from 'mongoose';

const rentalContractSchema = new mongoose.Schema(
  {
    contractNumber: {
      type: String,
      required: [true, 'Contract number is required'],
      unique: true,
      index: true
    },
    landlordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord ID is required'],
      index: true
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tenant ID is required'],
      index: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
      index: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      index: true
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required']
    },
    deposit: {
      type: Number,
      default: 0
    },
    paymentDueDay: {
      type: Number,
      default: 1,
      min: 1,
      max: 31
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'EXPIRED', 'TERMINATED'],
      default: 'PENDING',
      index: true
    },
    termsAndConditions: {
      type: String,
      default: 'Standard RentEasy 12-Month Tenancy Agreement with Escrow Deposit Protection.'
    }
  },
  {
    timestamps: true
  }
);

export const RentalContract = mongoose.model('RentalContract', rentalContractSchema);
