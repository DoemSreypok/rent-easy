import mongoose from 'mongoose';

const roomImageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required'],
      index: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    }
  },
  {
    timestamps: true
  }
);

export const RoomImage = mongoose.model('RoomImage', roomImageSchema);
