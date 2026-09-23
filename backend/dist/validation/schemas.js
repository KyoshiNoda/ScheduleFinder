"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hobbyParamsSchema = exports.hobbyBodySchema = exports.hobbyNameSchema = exports.deleteTimeSlotBodySchema = exports.updateTimeSlotBodySchema = exports.createTimeSlotBodySchema = exports.parseTimeToMinutes = exports.timeSchema = exports.daysSchema = exports.updateScheduleBodySchema = exports.emptyBodySchema = exports.updateUserBodySchema = exports.GENDER_VALUES = exports.completePasswordResetBodySchema = exports.changePasswordWithTokenBodySchema = exports.verifyPasswordResetBodySchema = exports.emailBodySchema = exports.loginBodySchema = exports.registerBodySchema = exports.friendIdParamsSchema = exports.idParamsSchema = exports.objectIdSchema = exports.DAYS_OF_WEEK = exports.TIME_SLOT_COLORS = void 0;
const zod_1 = require("zod");
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
const TIME_PATTERN = /^(?:0?[1-9]|1[0-2]):[0-5]\d (?:AM|PM)$/;
exports.TIME_SLOT_COLORS = [
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
];
exports.DAYS_OF_WEEK = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
];
const requiredText = (fieldName, maximumLength) => zod_1.z
    .string({
    required_error: `${fieldName} is required.`,
    invalid_type_error: `${fieldName} must be a string.`,
})
    .trim()
    .min(1, `${fieldName} is required.`)
    .max(maximumLength, `${fieldName} must be at most ${maximumLength} characters.`);
const emailSchema = zod_1.z
    .string({ required_error: 'Email is required.' })
    .trim()
    .max(254, 'Email must be at most 254 characters.')
    .email('Invalid email address.');
const bcryptPassword = (minimumLength, fieldName) => zod_1.z
    .string({ required_error: `${fieldName} is required.` })
    .min(minimumLength, `${fieldName} must be at least ${minimumLength} characters.`)
    .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, `${fieldName} must be at most 72 UTF-8 bytes.`);
const currentPasswordSchema = bcryptPassword(1, 'Password');
const newPasswordSchema = bcryptPassword(8, 'New password');
const birthdaySchema = zod_1.z
    .string({ required_error: 'Birthday is required.' })
    .trim()
    .refine((value) => /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(value), {
    message: 'Birthday must be a valid ISO date.',
})
    .transform((value, context) => {
    const birthday = new Date(value);
    const calendarDate = value.slice(0, 10);
    if (Number.isNaN(birthday.getTime()) || birthday.toISOString().slice(0, 10) !== calendarDate) {
        context.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: 'Birthday must be a valid date.' });
        return zod_1.z.NEVER;
    }
    const earliestBirthday = new Date('1900-01-01T00:00:00.000Z');
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    if (birthday < earliestBirthday || birthday >= tomorrow) {
        context.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Birthday must be between 1900-01-01 and today.',
        });
        return zod_1.z.NEVER;
    }
    return birthday;
});
const confirmedPasswordFields = {
    newPassword: newPasswordSchema,
    confirmNewPassword: bcryptPassword(8, 'Password confirmation'),
};
const passwordsMatch = (value, context) => {
    if (value.newPassword !== value.confirmNewPassword) {
        context.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['confirmNewPassword'],
            message: 'Password confirmation must match the new password.',
        });
    }
};
exports.objectIdSchema = zod_1.z
    .string({ required_error: 'ID is required.' })
    .regex(OBJECT_ID_PATTERN, 'ID must be a valid MongoDB ObjectId.');
exports.idParamsSchema = zod_1.z.object({ id: exports.objectIdSchema }).strict();
exports.friendIdParamsSchema = zod_1.z.object({ friendID: exports.objectIdSchema }).strict();
exports.registerBodySchema = zod_1.z
    .object({
    firstName: requiredText('First name', 100),
    lastName: requiredText('Last name', 100),
    email: emailSchema,
    password: bcryptPassword(8, 'Password'),
    school: requiredText('School', 150),
    birthday: birthdaySchema,
})
    .strict();
exports.loginBodySchema = zod_1.z
    .object({
    email: emailSchema,
    password: currentPasswordSchema,
})
    .strict();
exports.emailBodySchema = zod_1.z.object({ email: emailSchema }).strict();
exports.verifyPasswordResetBodySchema = zod_1.z
    .object({
    email: emailSchema,
    code: zod_1.z
        .string({ required_error: 'Reset code is required.' })
        .regex(/^\d{6}$/, 'Reset code must contain exactly six digits.'),
})
    .strict();
exports.changePasswordWithTokenBodySchema = zod_1.z
    .object(Object.assign({ currentPassword: currentPasswordSchema }, confirmedPasswordFields))
    .strict()
    .superRefine(passwordsMatch);
exports.completePasswordResetBodySchema = zod_1.z
    .object(Object.assign({ email: emailSchema, resetToken: zod_1.z
        .string({ required_error: 'Reset token is required.' })
        .regex(/^[A-Za-z0-9_-]{43}$/, 'Reset token is invalid.') }, confirmedPasswordFields))
    .strict()
    .superRefine(passwordsMatch);
exports.GENDER_VALUES = [
    'Male',
    'Female',
    'Binary',
    'Transgender',
    'Intersex',
    'Other',
    'I prefer not to say',
];
const nullableProfileText = (fieldName) => zod_1.z.union([requiredText(fieldName, 150), zod_1.z.null()]);
exports.updateUserBodySchema = zod_1.z
    .object({
    firstName: requiredText('First name', 100).optional(),
    lastName: requiredText('Last name', 100).optional(),
    email: emailSchema.optional(),
    birthday: birthdaySchema.optional(),
    school: nullableProfileText('School').optional(),
    major: nullableProfileText('Major').optional(),
    gender: zod_1.z.enum(exports.GENDER_VALUES).nullable().optional(),
})
    .strict()
    .refine((body) => Object.keys(body).length > 0, 'At least one profile field is required.');
exports.emptyBodySchema = zod_1.z.object({}).strict();
exports.updateScheduleBodySchema = zod_1.z
    .object({ visibility: zod_1.z.enum(['public', 'private']) })
    .strict();
exports.daysSchema = zod_1.z
    .object({
    monday: zod_1.z.boolean(),
    tuesday: zod_1.z.boolean(),
    wednesday: zod_1.z.boolean(),
    thursday: zod_1.z.boolean(),
    friday: zod_1.z.boolean(),
    saturday: zod_1.z.boolean(),
    sunday: zod_1.z.boolean(),
})
    .strict()
    .refine((days) => exports.DAYS_OF_WEEK.some((day) => days[day]), 'At least one day must be selected.');
exports.timeSchema = zod_1.z
    .string()
    .regex(TIME_PATTERN, 'Time must use h:mm AM/PM format.')
    .transform((time) => {
    const [clock, meridiem] = time.split(' ');
    const [hour, minute] = clock.split(':');
    return `${Number(hour)}:${minute} ${meridiem}`;
});
const optionalTimeSlotText = (fieldName) => zod_1.z.preprocess((value) => (value === '' ? null : value), requiredText(fieldName, 150).nullable().optional());
const timeSlotFields = {
    days: exports.daysSchema,
    title: requiredText('Title', 150),
    startTime: exports.timeSchema,
    endTime: exports.timeSchema,
    color: zod_1.z.enum(exports.TIME_SLOT_COLORS),
    location: optionalTimeSlotText('Location'),
    professor: optionalTimeSlotText('Professor'),
};
const parseTimeToMinutes = (time) => {
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
exports.parseTimeToMinutes = parseTimeToMinutes;
const validTimeRange = (value, context) => {
    if ((0, exports.parseTimeToMinutes)(value.startTime) >= (0, exports.parseTimeToMinutes)(value.endTime)) {
        context.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ['startTime'],
            message: 'Start time must be before end time.',
        });
    }
};
exports.createTimeSlotBodySchema = zod_1.z
    .object(timeSlotFields)
    .strict()
    .superRefine(validTimeRange);
exports.updateTimeSlotBodySchema = zod_1.z
    .object({
    _id: exports.objectIdSchema,
    days: exports.daysSchema.optional(),
    title: timeSlotFields.title.optional(),
    startTime: exports.timeSchema.optional(),
    endTime: exports.timeSchema.optional(),
    color: timeSlotFields.color.optional(),
    location: optionalTimeSlotText('Location'),
    professor: optionalTimeSlotText('Professor'),
})
    .strict()
    .refine((body) => Object.keys(body).some((key) => key !== '_id'), 'At least one time-slot field is required.')
    .superRefine((body, context) => {
    if (body.startTime && body.endTime) {
        validTimeRange(body, context);
    }
});
exports.deleteTimeSlotBodySchema = zod_1.z.object({ _id: exports.objectIdSchema }).strict();
exports.hobbyNameSchema = requiredText('Hobby name', 100).transform((name) => name.toLowerCase());
exports.hobbyBodySchema = zod_1.z.object({ name: exports.hobbyNameSchema }).strict();
exports.hobbyParamsSchema = zod_1.z.object({ name: exports.hobbyNameSchema }).strict();
