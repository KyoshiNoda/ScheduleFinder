import dayjs from 'dayjs';

export type RegisterUser = {
  _id?: string | undefined;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: Date,
  school: string;
};
export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  photoURL: string;
  email: string;
  password: string;
  gender: string;
  school: string;
  major: string;
};

export type DaysChecked = {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday?: boolean;
  sunday?: boolean;
};

export type TimeSlot = {
  _id?: undefined | string;
  days: DaysChecked;
  title: string;
  startTime: string;
  endTime: string;
  location: string | null;
  professor: string | null;
  color: string;
};

export type Schedule = {
  _id?: string | undefined;
  user_id: string;
  visibility: string;
  timeSlot: TimeSlot[];
};
