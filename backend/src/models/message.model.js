import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'tenant', 'system'],
      default: 'tenant'
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: String,
      default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  },
  {
    timestamps: true
  }
);

export const Message = mongoose.model('Message', messageSchema);
