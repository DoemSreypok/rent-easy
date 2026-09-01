import mongoose from 'mongoose';

const propertyImageSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
      index: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required']
    },
    isCover: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const PropertyImage = mongoose.model('PropertyImage', propertyImageSchema);
