import mongoose, { Schema, Document } from 'mongoose';

export interface IHobby extends Document {
  tag_id: mongoose.Types.ObjectId;
  name: string;
}

const hobbySchema: Schema = new mongoose.Schema({
  tag_id: { type: Number, require: true },
  name: { type: String, require: true },
});

const Hobby = mongoose.model<IHobby>('Hobby', hobbySchema);

export default Hobby;
