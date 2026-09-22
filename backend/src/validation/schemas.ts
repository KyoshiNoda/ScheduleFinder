import { z } from 'zod';

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
const TIME_PATTERN = /^(?:0?[1-9]|1[0-2]):[0-5]\d (?:AM|PM)$/;

export const TIME_SLOT_COLORS = [
  'slate',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'blue',
  'violet',
  'purple',
  'fuchsia',
  'rose',
] as const;

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const requiredText = (fieldName: string, maximumLength: number) =>
  z
    .string({
      required_error: `${fieldName} is required.`,
      invalid_type_error: `${fieldName} must be a string.`,
    })
    .trim()
    .min(1, `${fieldName} is required.`)
    .max(maximumLength, `${fieldName} must be at most ${maximumLength} characters.`);

const emailSchema = z
  .string({ required_error: 'Email is required.' })
  .trim()
  .max(254, 'Email must be at most 254 characters.')
  .email('Invalid email address.');

const bcryptPassword = (minimumLength: number, fieldName: string) =>
  z
    .string({ required_error: `${fieldName} is required.` })
    .min(minimumLength, `${fieldName} must be at least ${minimumLength} characters.`)
    .refine(
      (password) => Buffer.byteLength(password, 'utf8') <= 72,
      `${fieldName} must be at most 72 UTF-8 bytes.`
    );

const currentPasswordSchema = bcryptPassword(1, 'Password');
const newPasswordSchema = bcryptPassword(8, 'New password');

const birthdaySchema = z
  .string({ required_error: 'Birthday is required.' })
  .trim()
  .refine((value) => /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(value), {
    message: 'Birthday must be a valid ISO date.',
  })
  .transform((value, context) => {
    const birthday = new Date(value);
    const calendarDate = value.slice(0, 10);

    if (Number.isNaN(birthday.getTime()) || birthday.toISOString().slice(0, 10) !== calendarDate) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: 'Birthday must be a valid date.' });
      return z.NEVER;
    }

    const earliestBirthday = new Date('1900-01-01T00:00:00.000Z');
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);

    if (birthday < earliestBirthday || birthday >= tomorrow) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Birthday must be between 1900-01-01 and today.',
      });
      return z.NEVER;
    }

    return birthday;
  });

const confirmedPasswordFields = {
  newPassword: newPasswordSchema,
  confirmNewPassword: bcryptPassword(8, 'Password confirmation'),
};

const passwordsMatch = <T extends { newPassword: string; confirmNewPassword: string }>(
  value: T,
  context: z.RefinementCtx
) => {
  if (value.newPassword !== value.confirmNewPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmNewPassword'],
      message: 'Password confirmation must match the new password.',
    });
  }
};

export const objectIdSchema = z
  .string({ required_error: 'ID is required.' })
  .regex(OBJECT_ID_PATTERN, 'ID must be a valid MongoDB ObjectId.');

export const idParamsSchema = z.object({ id: objectIdSchema }).strict();
export const friendIdParamsSchema = z.object({ friendID: objectIdSchema }).strict();

export const registerBodySchema = z
  .object({
    firstName: requiredText('First name', 100),
    lastName: requiredText('Last name', 100),
    email: emailSchema,
    password: bcryptPassword(8, 'Password'),
    school: requiredText('School', 150),
    birthday: birthdaySchema,
  })
  .strict();

export const loginBodySchema = z
  .object({
    email: emailSchema,
    password: currentPasswordSchema,
  })
  .strict();

export const emailBodySchema = z.object({ email: emailSchema }).strict();

export const resetCodeBodySchema = z
  .object({
    email: emailSchema,
    code: z.string({ required_error: 'Reset code is required.' }).regex(/^\d{5}$/, 'Reset code must contain exactly five digits.'),
  })
  .strict();

export const changePasswordWithTokenBodySchema = z
  .object({
    currentPassword: currentPasswordSchema,
    ...confirmedPasswordFields,
  })
  .strict()
  .superRefine(passwordsMatch);

export const changePasswordWithoutTokenBodySchema = z
  .object({
    email: emailSchema,
    ...confirmedPasswordFields,
  })
  .strict()
  .superRefine(passwordsMatch);

export const GENDER_VALUES = [
  'Male',
  'Female',
  'Binary',
  'Transgender',
  'Intersex',
  'Other',
  'I prefer not to say',
] as const;

const nullableProfileText = (fieldName: string) =>
  z.union([requiredText(fieldName, 150), z.null()]);

export const updateUserBodySchema = z
  .object({
    firstName: requiredText('First name', 100).optional(),
    lastName: requiredText('Last name', 100).optional(),
    email: emailSchema.optional(),
    birthday: birthdaySchema.optional(),
    school: nullableProfileText('School').optional(),
    major: nullableProfileText('Major').optional(),
    gender: z.enum(GENDER_VALUES).nullable().optional(),
  })
  .strict()
  .refine((body) => Object.keys(body).length > 0, 'At least one profile field is required.');

export const emptyBodySchema = z.object({}).strict();

export const updateScheduleBodySchema = z
  .object({ visibility: z.enum(['public', 'private']) })
  .strict();

export const daysSchema = z
  .object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
  })
  .strict()
  .refine((days) => DAYS_OF_WEEK.some((day) => days[day]), 'At least one day must be selected.');

export const timeSchema = z
  .string()
  .regex(TIME_PATTERN, 'Time must use h:mm AM/PM format.')
  .transform((time) => {
    const [clock, meridiem] = time.split(' ');
    const [hour, minute] = clock.split(':');
    return `${Number(hour)}:${minute} ${meridiem}`;
  });

const optionalTimeSlotText = (fieldName: string) =>
  z.preprocess(
    (value) => (value === '' ? null : value),
    requiredText(fieldName, 150).nullable().optional()
  );

const timeSlotFields = {
  days: daysSchema,
  title: requiredText('Title', 150),
  startTime: timeSchema,
  endTime: timeSchema,
  color: z.enum(TIME_SLOT_COLORS),
  location: optionalTimeSlotText('Location'),
  professor: optionalTimeSlotText('Professor'),
};

export const parseTimeToMinutes = (time: string): number => {
  const match = TIME_PATTERN.exec(time);

  if (!match) {
    return Number.NaN;
  }

  const [clock, meridiem] = time.split(' ');
  const [hourText, minuteText] = clock.split(':');
  let hour = Number(hourText);

  if (hour === 12) {
    hour = 0;
  }
  if (meridiem === 'PM') {
    hour += 12;
  }

  return hour * 60 + Number(minuteText);
};

const validTimeRange = <T extends { startTime: string; endTime: string }>(
  value: T,
  context: z.RefinementCtx
) => {
  if (parseTimeToMinutes(value.startTime) >= parseTimeToMinutes(value.endTime)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['startTime'],
      message: 'Start time must be before end time.',
    });
  }
};

export const createTimeSlotBodySchema = z
  .object(timeSlotFields)
  .strict()
  .superRefine(validTimeRange);

export const updateTimeSlotBodySchema = z
  .object({
    _id: objectIdSchema,
    days: daysSchema.optional(),
    title: timeSlotFields.title.optional(),
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    color: timeSlotFields.color.optional(),
    location: optionalTimeSlotText('Location'),
    professor: optionalTimeSlotText('Professor'),
  })
  .strict()
  .refine((body) => Object.keys(body).some((key) => key !== '_id'), 'At least one time-slot field is required.')
  .superRefine((body, context) => {
    if (body.startTime && body.endTime) {
      validTimeRange(body as { startTime: string; endTime: string }, context);
    }
  });

export const deleteTimeSlotBodySchema = z.object({ _id: objectIdSchema }).strict();

export const hobbyNameSchema = requiredText('Hobby name', 100).transform((name) => name.toLowerCase());
export const hobbyBodySchema = z.object({ name: hobbyNameSchema }).strict();
export const hobbyParamsSchema = z.object({ name: hobbyNameSchema }).strict();

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type EmailBody = z.infer<typeof emailBodySchema>;
export type ResetCodeBody = z.infer<typeof resetCodeBodySchema>;
export type ChangePasswordWithTokenBody = z.infer<typeof changePasswordWithTokenBodySchema>;
export type ChangePasswordWithoutTokenBody = z.infer<typeof changePasswordWithoutTokenBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type IdParams = z.infer<typeof idParamsSchema>;
export type FriendIdParams = z.infer<typeof friendIdParamsSchema>;
export type UpdateScheduleBody = z.infer<typeof updateScheduleBodySchema>;
export type CreateTimeSlotBody = z.infer<typeof createTimeSlotBodySchema>;
export type UpdateTimeSlotBody = z.infer<typeof updateTimeSlotBodySchema>;
export type DeleteTimeSlotBody = z.infer<typeof deleteTimeSlotBodySchema>;
export type HobbyBody = z.infer<typeof hobbyBodySchema>;
export type HobbyParams = z.infer<typeof hobbyParamsSchema>;
