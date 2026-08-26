import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    propertyId: {
      type: String,
      required: true
    },
    propertyTitle: {
      type: String,
      required: true
    },
    tenantName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    employment: {
      type: String,
      default: ''
    },
    annualIncome: {
      type: String,
      default: ''
    },
    creditScore: {
      type: Number,
      default: 750
    },
    moveInDate: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    documents: {
      type: [String],
      default: ['Government_ID.pdf', 'Proof_Of_Income.pdf']
    },
    message: {
      type: String,
      default: ''
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Application = mongoose.model('Application', applicationSchema);
