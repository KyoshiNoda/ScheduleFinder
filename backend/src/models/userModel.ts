import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: Date;
  gender?: string;
  photoURL: string;
  age?: number;
  school?: string;
  major?: string;
  friends: [string],
  friendRequests: [string]
}

const userSchema: Schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthday: { type: Date, required: true },
  friends: [{ type: String }], // Array of strings for storing user IDs
  friendRequests: [{ type: String }], // Array of strings for storing user IDs
  age: Number,
  photoURL: String,
  gender: String,
  school: String,
  major: String,
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
