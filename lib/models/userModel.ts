import mongoose, { Schema } from 'mongoose';
import { UserProfile } from '../types';

// Define the schema for health predictions
const HealthPredictionSchema = new Schema({
  condition: String,
  risk: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  score: Number,
  description: String,
});

// Define the schema for user preferences
const PreferenceSchema = new Schema({
  dietaryRestrictions: [String],
  healthGoals: [String],
  activityLevel: String,
  age: Number,
});

// Define the schema for categories
const CategorySchema = new Schema({
  name: String,
  dietIds: [String],
});

// Define the user schema
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

// Create and export the model
export default mongoose.models.User || mongoose.model('User', UserSchema);