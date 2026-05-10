import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    profile_image: {
      type: String,
      default: null
    },
    notifications: {
      email_trips:    { type: Boolean, default: true },
      email_reminders:{ type: Boolean, default: true },
      email_community:{ type: Boolean, default: false },
    },
    privacy: {
      show_profile:   { type: String, enum: ['public', 'private'], default: 'public' },
      show_trips:     { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
      allow_community:{ type: Boolean, default: true },
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

export default mongoose.model('User', userSchema);
