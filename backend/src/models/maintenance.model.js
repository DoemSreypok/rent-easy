import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    propertyTitle: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      default: 'Main Unit'
    },
    issue: {
      type: String,
      required: true
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Reported', 'In Progress', 'Completed'],
      default: 'In Progress'
    },
    technician: {
      type: String,
      default: 'Auto-Dispatch Apex Services'
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
