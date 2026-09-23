import mongoose, { Schema, Document } from 'mongoose';

export interface PasswordResetState {
  codeDigest?: string;
  codeExpiresAt?: Date;
  failedAttempts?: number;
  requestedAt: Date;
  resetTokenDigest?: string;
  resetTokenExpiresAt?: Date;
}

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
  friends: string[];
  receivedFriendRequests: string[];
  sentFriendRequests: string[];
  hobbies: string[];
  passwordReset?: PasswordResetState;
}

const passwordResetSchema = new mongoose.Schema<PasswordResetState>(
  {
    codeDigest: String,
    codeExpiresAt: Date,
    failedAttempts: Number,
    requestedAt: { type: Date, required: true },
    resetTokenDigest: String,
    resetTokenExpiresAt: Date,
  },
  { _id: false }
);

const userSchema: Schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  birthday: { type: Date, required: true },
  friends: [{ type: String }],
  receivedFriendRequests: [{ type: String }],
  sentFriendRequests: [{ type: String }],
  age: Number,
  photoURL: String,
  gender: String,
  school: String,
  major: String,
  hobbies: [{ type: String }],
  passwordReset: {
    type: passwordResetSchema,
    select: false,
    default: undefined,
  },
});

const User =
  (mongoose.models.User as mongoose.Model<IUser> | undefined) ??
  mongoose.model<IUser>('User', userSchema);

export default User;
