export enum Environment {
  Local = 'local',
  Dev = 'dev',
  Prod = 'prod',
}
export type RegisterUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthday: Date;
  school: string;
};
export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  age?: number;
  photoURL: string;
  email: string;
  password: string;
  gender?: string | undefined;
  school: string;
  major?: string | undefined;
  friends: User[];
  receivedFriendRequests : User[];
  sentFriendRequests : User[];
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
