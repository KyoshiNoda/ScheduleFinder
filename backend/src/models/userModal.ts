import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  password: String,
  gender: String,
  school: String
});

const User = mongoose.model('users', userSchema);

export default User;