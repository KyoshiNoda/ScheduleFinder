import { createHmac, randomBytes, randomInt } from 'crypto';
import bcrypt from 'bcrypt';
import sgMail from '@sendgrid/mail';
import User from '../models/userModel';

sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

export const PASSWORD_RESET_CODE_TTL_MS = 10 * 60 * 1000;
export const PASSWORD_RESET_TOKEN_TTL_MS = 10 * 60 * 1000;
export const PASSWORD_RESET_RESEND_COOLDOWN_MS = 60 * 1000;
export const PASSWORD_RESET_MAX_ATTEMPTS = 5;

const PASSWORD_RESET_SECRET_MINIMUM_BYTES = 32;

const getPasswordResetSecret = (): string => {
  const secret = process.env.PASSWORD_RESET_SECRET;

  if (!secret || Buffer.byteLength(secret, 'utf8') < PASSWORD_RESET_SECRET_MINIMUM_BYTES) {
    throw new Error('PASSWORD_RESET_SECRET must contain at least 32 UTF-8 bytes');
  }

  return secret;
};

export const validatePasswordResetConfiguration = (): void => {
  getPasswordResetSecret();
};

const digestCredential = (
  purpose: 'code' | 'token',
  email: string,
  credential: string
): string =>
  createHmac('sha256', getPasswordResetSecret())
    .update(`${purpose}:${email}:${credential}`)
    .digest('hex');

const createResetCode = (): string => randomInt(0, 1_000_000).toString().padStart(6, '0');
const createResetToken = (): string => randomBytes(32).toString('base64url');

const sendResetCode = async (email: string, code: string): Promise<void> => {
  const message = `Here is your six digit ScheduleFinder password reset code: ${code}`;

  await sgMail.send({
    to: email,
    from: 'schedulefinder@gmail.com',
    subject: 'ScheduleFinder - Password Reset',
    text: message,
    html: `<p>Here is your six digit ScheduleFinder password reset code:</p><strong>${code}</strong>`,
  });
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  const now = new Date();
  const code = createResetCode();
  const codeDigest = digestCredential('code', email, code);
  const resendCutoff = new Date(now.getTime() - PASSWORD_RESET_RESEND_COOLDOWN_MS);

  const user = await User.findOneAndUpdate(
    {
      email,
      $or: [
        { 'passwordReset.requestedAt': { $exists: false } },
        { 'passwordReset.requestedAt': { $lte: resendCutoff } },
      ],
    },
    {
      $set: {
        passwordReset: {
          codeDigest,
          codeExpiresAt: new Date(now.getTime() + PASSWORD_RESET_CODE_TTL_MS),
          failedAttempts: 0,
          requestedAt: now,
        },
      },
    },
    { new: true }
  )
    .select('email')
    .exec();

  if (!user) {
    return;
  }

  try {
    await sendResetCode(user.email, code);
  } catch {
    await User.updateOne(
      { _id: user._id, 'passwordReset.codeDigest': codeDigest },
      { $unset: { passwordReset: 1 } }
    ).exec();
  }
};

export interface VerifiedPasswordReset {
  resetToken: string;
  expiresInSeconds: number;
}

export const verifyPasswordResetCode = async (
  email: string,
  code: string
): Promise<VerifiedPasswordReset | null> => {
  const now = new Date();
  const codeDigest = digestCredential('code', email, code);
  const resetToken = createResetToken();
  const resetTokenDigest = digestCredential('token', email, resetToken);

  const verifiedUser = await User.findOneAndUpdate(
    {
      email,
      'passwordReset.codeDigest': codeDigest,
      'passwordReset.codeExpiresAt': { $gt: now },
      'passwordReset.failedAttempts': { $lt: PASSWORD_RESET_MAX_ATTEMPTS },
    },
    {
      $set: {
        'passwordReset.resetTokenDigest': resetTokenDigest,
        'passwordReset.resetTokenExpiresAt': new Date(
          now.getTime() + PASSWORD_RESET_TOKEN_TTL_MS
        ),
      },
      $unset: {
        'passwordReset.codeDigest': 1,
        'passwordReset.codeExpiresAt': 1,
        'passwordReset.failedAttempts': 1,
      },
    },
    { new: true }
  )
    .select('_id')
    .exec();

  if (verifiedUser) {
    return {
      resetToken,
      expiresInSeconds: PASSWORD_RESET_TOKEN_TTL_MS / 1000,
    };
  }

  await User.updateOne(
    {
      email,
      'passwordReset.codeDigest': { $exists: true },
      'passwordReset.codeExpiresAt': { $gt: now },
      'passwordReset.failedAttempts': { $lt: PASSWORD_RESET_MAX_ATTEMPTS },
    },
    { $inc: { 'passwordReset.failedAttempts': 1 } }
  ).exec();

  return null;
};

export const completePasswordReset = async (
  email: string,
  resetToken: string,
  newPassword: string
): Promise<boolean> => {
  const now = new Date();
  const resetTokenDigest = digestCredential('token', email, resetToken);
  const proofFilter = {
    email,
    'passwordReset.resetTokenDigest': resetTokenDigest,
    'passwordReset.resetTokenExpiresAt': { $gt: now },
  };

  const proofExists = await User.exists(proofFilter);

  if (!proofExists) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt());
  const updatedUser = await User.findOneAndUpdate(
    proofFilter,
    {
      $set: { password: hashedPassword },
      $unset: { passwordReset: 1 },
    },
    { new: true }
  )
    .select('_id')
    .exec();

  return updatedUser !== null;
};
