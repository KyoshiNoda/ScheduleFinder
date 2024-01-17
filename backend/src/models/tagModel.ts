import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  tag_id: mongoose.Types.ObjectId;
  name: string;
}

const tagSchema: Schema = new mongoose.Schema({
  tag_id: { type: Number, require: true },
  name: { type: String, require: true },
});

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;
