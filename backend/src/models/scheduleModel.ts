import mongoose, { Schema, Document } from 'mongoose';
export interface TimeSlot {
  id: number;
  category: number;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  location?: string;
  professor?: string;
}

export interface Day {
  day: string;
  timeSlot: TimeSlot[];
}

export interface ISchedule extends Document {
  user_id: string;
  visibility: string;
  week: Day[];
}

const timeSlotSchema: Schema = new mongoose.Schema({
  id: { type: Number, required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  color: { type: String, required: true },
  location: String,
  professor: String,
});

const daySchema: Schema = new mongoose.Schema({
  day: { type: String, required: true },
  timeSlot: [timeSlotSchema],
});

const scheduleSchema: Schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  visibility: { type: String, required: true },
  week: [daySchema],
});

const Schedule = mongoose.model<ISchedule>('Schedule', scheduleSchema);

export default Schedule;
