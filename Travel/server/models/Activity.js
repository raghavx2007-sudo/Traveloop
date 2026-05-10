import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'adventure', 'nightlife', 'shopping', 'culture', 'nature', 'other'],
      default: 'other'
    },
    avg_cost: { type: Number, default: 0 },
    duration: { type: Number, default: 60 }, // minutes
    description: { type: String, default: '' },
    image: { type: String, default: null }
  },
  { timestamps: true }
);

activitySchema.index({ category: 1 });
activitySchema.index({ name: 'text', description: 'text' }); // text search

export default mongoose.model('Activity', activitySchema);
