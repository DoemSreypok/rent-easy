import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RentalContract',
      index: true
    },
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
    amount: {
      type: Number,
      required: [true, 'Payment amount is required']
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['CASH', 'BANK_TRANSFER', 'ABA', 'ACLEDA', 'CARD'],
      default: 'ABA',
      index: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true
    },
    description: {
      type: String,
      default: 'Monthly Rent Payment'
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate receipt number if marked as PAID
paymentSchema.pre('save', function (next) {
  if (this.status === 'PAID' && !this.receiptNumber) {
    this.receiptNumber = `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

export const Payment = mongoose.model('Payment', paymentSchema);
