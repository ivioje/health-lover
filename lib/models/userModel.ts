import mongoose, { Schema } from 'mongoose';

const HealthPredictionSchema = new Schema({
  condition: String,
  risk: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  score: Number,
  description: String,
});

// schema for user preferences
const PreferenceSchema = new Schema({
  dietaryRestrictions: [String],
  healthGoals: [String],
  activityLevel: String,
  age: Number,
});

// schema for categories
const CategorySchema = new Schema({
  name: String,
  dietIds: [String],
});

// user schema
const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  preferences: PreferenceSchema,
  categories: [CategorySchema],
  savedDiets: [String],
  healthPredictions: [HealthPredictionSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);