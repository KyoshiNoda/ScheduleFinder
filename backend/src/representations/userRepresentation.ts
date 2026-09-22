import { IUser } from '../models/userModel';

export interface PublicUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  photoURL: string | null;
  age: number;
  school: string | null;
  major: string | null;
  gender: string | null;
  hobbies: string[];
}

export interface PrivateUserResponse extends PublicUserResponse {
  email: string;
  birthday: string;
}

export interface AuthUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoURL: string | null;
}

export const calculateAge = (birthday: Date, now: Date = new Date()): number => {
  const birthDate = new Date(birthday);
  let age = now.getUTCFullYear() - birthDate.getUTCFullYear();
  const birthdayHasOccurred =
    now.getUTCMonth() > birthDate.getUTCMonth() ||
    (now.getUTCMonth() === birthDate.getUTCMonth() &&
      now.getUTCDate() >= birthDate.getUTCDate());

  if (!birthdayHasOccurred) {
    age -= 1;
  }

  return age;
};

export const toPublicUser = (user: IUser): PublicUserResponse => ({
  _id: user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  photoURL: user.photoURL ?? null,
  age: calculateAge(user.birthday),
  school: user.school ?? null,
  major: user.major ?? null,
  gender: user.gender ?? null,
  hobbies: user.hobbies ?? [],
});

export const toPrivateUser = (user: IUser): PrivateUserResponse => ({
  ...toPublicUser(user),
  email: user.email,
  birthday: new Date(user.birthday).toISOString(),
});

export const toAuthUser = (user: IUser): AuthUserResponse => ({
  _id: user._id.toString(),
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  photoURL: user.photoURL ?? null,
});
