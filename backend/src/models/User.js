import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    stripeCustomerId: { type: String, default: null },
    subscriptionStatus: {
      type: String,
      enum: ['none', 'active', 'canceled', 'past_due'],
      default: 'none',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
