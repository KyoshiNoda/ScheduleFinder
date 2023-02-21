import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface TimeSlot {
  _id: mongoose.Types.ObjectId
  day: string;
  category: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  location?: string;
  professor?: string;
}

export interface ISchedule extends Document {
  user_id: string;
  visibility: string;
  timeSlot: TimeSlot[];
}

const timeSlotSchema: Schema = new mongoose.Schema({
  _id: { type: Number, required: true },
  day: { type: String, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  color: { type: String, required: true },
  location: String,
  professor: String,
});


const scheduleSchema: Schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  visibility: { type: String, required: true },
  timeSlot : {type : Array, "default" : []}
});

const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);

export default Schedule;
