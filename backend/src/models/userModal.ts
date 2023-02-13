import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  gender: String,
  school: String
});

// create a model with studentSchema
const User = mongoose.model('users', userSchema);

export default User;