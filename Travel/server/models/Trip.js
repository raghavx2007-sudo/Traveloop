import mongoose from 'mongoose';

// Sub-schema: activity added to a stop
const tripActivitySchema = new mongoose.Schema(
  {
    activity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: true
    },
    // Snapshot of activity data at time of adding (so it survives catalog changes)
    name: String,
    category: String,
    avg_cost: Number,
    duration: Number,
    description: String,
    selected_date: Date,
    selected_time: String,
    custom_cost: { type: Number, default: null },
    notes: { type: String, default: '' }
  },
  { _id: true, timestamps: true }
);

// Sub-schema: a destination/stop in the trip
const tripStopSchema = new mongoose.Schema(
  {
    city_name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    arrival_date: { type: Date, default: null },
    departure_date: { type: Date, default: null },
    position: { type: Number, default: 0 },
    activities: [tripActivitySchema]
  },
  { _id: true, timestamps: true }
);

// Sub-schema: budget item
const budgetItemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['transport', 'accommodation', 'food', 'activities', 'shopping', 'other'],
      required: true
    },
    item_name: { type: String, required: true, trim: true },
    estimated_cost: { type: Number, default: 0 },
    actual_cost: { type: Number, default: null },
    notes: { type: String, default: '' }
  },
  { _id: true, timestamps: true }
);

// Sub-schema: checklist item
const checklistItemSchema = new mongoose.Schema(
  {
    item_name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['clothing', 'electronics', 'documents', 'essentials', 'toiletries', 'other'],
      default: 'other'
    },
    is_packed: { type: Boolean, default: false }
  },
  { _id: true, timestamps: true }
);

// Sub-schema: note
const noteSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    note_date: { type: Date, default: null }
  },
  { _id: true, timestamps: true }
);

// Main Trip schema
const tripSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    trip_name: {
      type: String,
      required: [true, 'Trip name is required'],
      trim: true,
      maxlength: 200
    },
    description: { type: String, default: '' },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    cover_image: { type: String, default: null },
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'private'
    },
    stops: [tripStopSchema],
    budget_items: [budgetItemSchema],
    checklist_items: [checklistItemSchema],
    notes: [noteSchema]
  },
  {
    timestamps: true,
    // Virtual fields for counts
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual: destination count
tripSchema.virtual('destination_count').get(function () {
  return this.stops ? this.stops.length : 0;
});

// Virtual: activity count
tripSchema.virtual('activity_count').get(function () {
  if (!this.stops) return 0;
  return this.stops.reduce((sum, stop) => sum + (stop.activities ? stop.activities.length : 0), 0);
});

// Index for fast user queries
tripSchema.index({ user_id: 1, createdAt: -1 });
tripSchema.index({ visibility: 1 });

export default mongoose.model('Trip', tripSchema);
