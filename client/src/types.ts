export enum Environment {
  Local = 'local',
  Dev = 'dev',
  Prod = 'prod',
}

export enum FriendsEnum {
  ACCEPTED_REQUEST = 'Accepted Friend Request!',
  REJECTED_REQUEST = 'Rejected Friend Request.',
  SEND_REQUEST = 'Friend Request Sent!',
  CANCEL_REQUEST = 'Canceled Friend Request!',
  REMOVED = 'Removed Friend!',
}

export enum AccountEnum {
  SAVED = "Saved Information!",
  UPDATE_PROFILE_PICTURE = "Updated Profile Picture!",
  UPDATE_EMAIL = "Updated Email!",
  UPDATE_PASSWORD = "Updated Password!",
  DELETE_ACCOUNT = "Deleted Account!",
}

export enum ScheduleEnum {
  CLEAR_SCHEDULE = "Cleared Schedule!",
  CREATED_TIMESLOT = "Created Time Slot!",
  UPDATE_TIMESLOT = "Updated Time Slot!",
  DELETED_TIMESLOT = "Deleted Time Slot!",
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
  [key: string]: boolean;
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
  timeSlots: TimeSlot[];
};
