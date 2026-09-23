import bcrypt from 'bcrypt';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendGridMocks = vi.hoisted(() => ({
  send: vi.fn(),
  setApiKey: vi.fn(),
}));

vi.mock('@sendgrid/mail', () => ({
  default: {
    send: sendGridMocks.send,
    setApiKey: sendGridMocks.setApiKey,
  },
}));

import { createApp } from '../app';
import {
  PASSWORD_RESET_MAX_ATTEMPTS,
  PASSWORD_RESET_RESEND_COOLDOWN_MS,
  validatePasswordResetConfiguration,
} from '../auth/passwordReset';
import User from '../models/userModel';

const appOne = createApp();
const appTwo = createApp();
let userSequence = 0;

const createUser = async (password: string = 'original-password') => {
  userSequence += 1;

  return User.create({
    firstName: 'Reset',
    lastName: `Tester ${userSequence}`,
    email: `reset-${userSequence}@example.invalid`,
    password: await bcrypt.hash(password, 4),
    birthday: new Date('2000-01-01T00:00:00.000Z'),
    school: 'Test University',
    photoURL: 'local-default-profile.png',
  });
};

const requestReset = (email: string, app = appOne) =>
  request(app).post('/api/auth/password-reset/request').send({ email });

const getLatestCode = (): string => {
  const latestMessage = sendGridMocks.send.mock.calls.at(-1)?.[0];
  const code = latestMessage?.text?.match(/\b\d{6}\b/)?.[0];

  if (!code) {
    throw new Error('Synthetic reset email did not contain a six-digit code');
  }

  return code;
};

const verifyCode = (email: string, code: string, app = appOne) =>
  request(app).post('/api/auth/password-reset/verify').send({ email, code });

const completeReset = (
  email: string,
  resetToken: string,
  newPassword: string,
  app = appOne
) =>
  request(app).post('/api/auth/password-reset/complete').send({
    email,
    resetToken,
    newPassword,
    confirmNewPassword: newPassword,
  });

beforeEach(() => {
  sendGridMocks.send.mockReset();
  sendGridMocks.send.mockResolvedValue([{ statusCode: 202 }]);
});

describe('password reset', () => {
  it('requires a dedicated password-reset secret', () => {
    const configuredSecret = process.env.PASSWORD_RESET_SECRET;

    try {
      delete process.env.PASSWORD_RESET_SECRET;
      expect(() => validatePasswordResetConfiguration()).toThrow(
        'PASSWORD_RESET_SECRET must contain at least 32 UTF-8 bytes'
      );
    } finally {
      process.env.PASSWORD_RESET_SECRET = configuredSecret;
    }
  });

  it('does nothing until an incoming request and returns the same response for unknown accounts', async () => {
    const user = await createUser();
    const beforeRequest = await User.findById(user.id).select('+passwordReset');

    expect(beforeRequest?.passwordReset).toBeUndefined();
    expect(sendGridMocks.send).not.toHaveBeenCalled();

    const existingResponse = await requestReset(user.email);
    const missingResponse = await requestReset('missing@example.invalid');

    expect(existingResponse.status).toBe(202);
    expect(missingResponse.status).toBe(202);
    expect(existingResponse.body).toEqual(missingResponse.body);
    expect(existingResponse.body).toEqual({
      message: 'If an account exists, a reset code will be sent.',
    });
    expect(sendGridMocks.send).toHaveBeenCalledTimes(1);
  });

  it('stores only hidden credential digests and removes a challenge after provider failure', async () => {
    const user = await createUser();
    const successfulResponse = await requestReset(user.email);
    const code = getLatestCode();
    const defaultUser = await User.findById(user.id);
    const userWithResetState = await User.findById(user.id).select('+passwordReset');

    expect(successfulResponse.status).toBe(202);
    expect(defaultUser?.passwordReset).toBeUndefined();
    expect(userWithResetState?.passwordReset?.codeDigest).toEqual(expect.any(String));
    expect(userWithResetState?.passwordReset?.codeDigest).not.toContain(code);

    await User.updateOne({ _id: user.id }, { $unset: { passwordReset: 1 } });
    sendGridMocks.send.mockRejectedValueOnce(new Error('Synthetic provider failure'));

    const failedProviderResponse = await requestReset(user.email);
    const stateAfterFailure = await User.findById(user.id).select('+passwordReset');

    expect(failedProviderResponse.status).toBe(202);
    expect(stateAfterFailure?.passwordReset).toBeUndefined();
  });

  it('enforces resend cooldown and invalidates the previous code after an accepted resend', async () => {
    const user = await createUser();
    await requestReset(user.email);
    const firstCode = getLatestCode();

    const cooldownResponse = await requestReset(user.email);
    expect(cooldownResponse.status).toBe(202);
    expect(sendGridMocks.send).toHaveBeenCalledTimes(1);

    await User.updateOne(
      { _id: user.id },
      {
        $set: {
          'passwordReset.requestedAt': new Date(
            Date.now() - PASSWORD_RESET_RESEND_COOLDOWN_MS - 1
          ),
        },
      }
    );

    await requestReset(user.email);
    const secondCode = getLatestCode();
    expect(sendGridMocks.send).toHaveBeenCalledTimes(2);

    const oldCodeResponse = await verifyCode(user.email, firstCode);
    const newCodeResponse = await verifyCode(user.email, secondCode);

    expect(oldCodeResponse.status).toBe(400);
    expect(oldCodeResponse.body.code).toBe('INVALID_RESET_CODE');
    expect(newCodeResponse.status).toBe(200);
  });

  it('invalidates an issued reset proof when a later resend is accepted', async () => {
    const user = await createUser();
    await requestReset(user.email);
    const verifyResponse = await verifyCode(user.email, getLatestCode());

    await User.updateOne(
      { _id: user.id },
      {
        $set: {
          'passwordReset.requestedAt': new Date(
            Date.now() - PASSWORD_RESET_RESEND_COOLDOWN_MS - 1
          ),
        },
      }
    );
    await requestReset(user.email);

    const oldProofResponse = await completeReset(
      user.email,
      verifyResponse.body.resetToken,
      'replacement-password'
    );
    expect(oldProofResponse.status).toBe(400);
    expect(oldProofResponse.body.code).toBe('INVALID_RESET_PROOF');
  });

  it('rejects expired codes and locks a challenge after five failed attempts', async () => {
    const expiredUser = await createUser();
    await requestReset(expiredUser.email);
    const expiredCode = getLatestCode();
    await User.updateOne(
      { _id: expiredUser.id },
      { $set: { 'passwordReset.codeExpiresAt': new Date(Date.now() - 1) } }
    );

    const expiredResponse = await verifyCode(expiredUser.email, expiredCode);
    expect(expiredResponse.status).toBe(400);

    const lockedUser = await createUser();
    await requestReset(lockedUser.email);
    const correctCode = getLatestCode();
    const wrongCode = correctCode === '000000' ? '999999' : '000000';

    for (let attempt = 0; attempt < PASSWORD_RESET_MAX_ATTEMPTS; attempt += 1) {
      const response = await verifyCode(lockedUser.email, wrongCode);
      expect(response.status).toBe(400);
    }

    const lockedResponse = await verifyCode(lockedUser.email, correctCode);
    const lockedState = await User.findById(lockedUser.id).select('+passwordReset');

    expect(lockedResponse.status).toBe(400);
    expect(lockedState?.passwordReset?.failedAttempts).toBe(PASSWORD_RESET_MAX_ATTEMPTS);
  });

  it('shares reset state across app instances and consumes the code and proof once', async () => {
    const originalPassword = 'original-password';
    const newPassword = 'replacement-password';
    const user = await createUser(originalPassword);

    await requestReset(user.email, appOne);
    const code = getLatestCode();
    const verifyResponse = await verifyCode(user.email, code, appTwo);

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.resetToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(verifyResponse.body.expiresInSeconds).toBe(600);

    const repeatedVerification = await verifyCode(user.email, code, appOne);
    expect(repeatedVerification.status).toBe(400);

    const stateAfterVerification = await User.findById(user.id).select('+passwordReset');
    expect(stateAfterVerification?.passwordReset?.codeDigest).toBeUndefined();
    expect(stateAfterVerification?.passwordReset?.resetTokenDigest).toEqual(expect.any(String));
    expect(stateAfterVerification?.passwordReset?.resetTokenDigest).not.toContain(
      verifyResponse.body.resetToken
    );

    const completeResponse = await completeReset(
      user.email,
      verifyResponse.body.resetToken,
      newPassword,
      appOne
    );
    expect(completeResponse.status).toBe(200);

    const updatedUser = await User.findById(user.id).select('+password +passwordReset');
    expect(updatedUser?.passwordReset).toBeUndefined();
    await expect(bcrypt.compare(newPassword, updatedUser!.password)).resolves.toBe(true);
    await expect(bcrypt.compare(originalPassword, updatedUser!.password)).resolves.toBe(false);

    const replayResponse = await completeReset(
      user.email,
      verifyResponse.body.resetToken,
      'another-password',
      appTwo
    );
    expect(replayResponse.status).toBe(400);
    expect(replayResponse.body.code).toBe('INVALID_RESET_PROOF');
  });

  it('allows exactly one concurrent completion and leaves the winning password stored', async () => {
    const user = await createUser();
    await requestReset(user.email);
    const verifyResponse = await verifyCode(user.email, getLatestCode());
    const resetToken = verifyResponse.body.resetToken;

    const [firstResponse, secondResponse] = await Promise.all([
      completeReset(user.email, resetToken, 'concurrent-password-one'),
      completeReset(user.email, resetToken, 'concurrent-password-two', appTwo),
    ]);

    expect([firstResponse.status, secondResponse.status].sort()).toEqual([200, 400]);

    const updatedUser = await User.findById(user.id).select('+password');
    const firstMatches = await bcrypt.compare('concurrent-password-one', updatedUser!.password);
    const secondMatches = await bcrypt.compare('concurrent-password-two', updatedUser!.password);
    expect(Number(firstMatches) + Number(secondMatches)).toBe(1);
  });

  it('rejects missing, expired, and legacy proofless password changes', async () => {
    const user = await createUser();
    const invalidProofResponse = await completeReset(
      user.email,
      'A'.repeat(43),
      'replacement-password'
    );
    const legacyResponse = await request(appOne).post('/api/users/changePassword').send({
      email: user.email,
      newPassword: 'replacement-password',
      confirmNewPassword: 'replacement-password',
    });
    const legacyRequestResponse = await request(appOne)
      .post('/api/auth/resetPasswordRequest')
      .send({ email: user.email });
    const legacyVerifyResponse = await request(appOne)
      .post('/api/auth/verifyResetPasswordCode')
      .send({ email: user.email, code: '123456' });
    const legacyEmailCheckResponse = await request(appOne)
      .post('/api/auth/emailCheck')
      .send({ email: user.email });

    await requestReset(user.email);
    const verifyResponse = await verifyCode(user.email, getLatestCode());
    await User.updateOne(
      { _id: user.id },
      { $set: { 'passwordReset.resetTokenExpiresAt': new Date(Date.now() - 1) } }
    );
    const expiredProofResponse = await completeReset(
      user.email,
      verifyResponse.body.resetToken,
      'replacement-password'
    );

    expect(invalidProofResponse.status).toBe(400);
    expect(expiredProofResponse.status).toBe(400);
    expect(legacyResponse.status).toBe(404);
    expect(legacyRequestResponse.status).toBe(404);
    expect(legacyVerifyResponse.status).toBe(404);
    expect(legacyEmailCheckResponse.status).toBe(404);

    const unchangedUser = await User.findById(user.id).select('+password');
    await expect(bcrypt.compare('original-password', unchangedUser!.password)).resolves.toBe(true);
  });
});
