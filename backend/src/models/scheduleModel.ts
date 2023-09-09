import mongoose, { Schema, Document } from 'mongoose';
type Days ={
  monday : boolean;
  tuesday : boolean;
  wednesday : boolean;
  thursday : boolean;
  friday : boolean;
  saturday : boolean;
  sunday : boolean;
}
export interface TimeSlot {
  _id: mongoose.Types.ObjectId;
  days: Days;
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
  timeSlots: TimeSlot[];
}

const timeSlotSchema: Schema = new mongoose.Schema({
  _id: { type: Number, required: true },
  day: { type: String, required: true },
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
  timeSlots: { type: Array, default: [timeSlotSchema] },
});

const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);

export default Schedule;
