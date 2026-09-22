import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = '1d';
const DURATION_PATTERN = /^(\d+)(?:ms|s|m|h|d|w|y)$/; // time units such as seconds, minutes, hours etc.
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i; // accepts only ObjectID from mongoDB

export interface AccessTokenClaims extends JwtPayload {
  sub: string;
}

const getAccessTokenSecret = (): string => {
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is required');
  }

  return secret;
};

const getAccessTokenExpiry = (): SignOptions['expiresIn'] => {
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN ?? DEFAULT_ACCESS_TOKEN_EXPIRES_IN;
  const durationMatch = expiresIn.match(DURATION_PATTERN);

  if (!durationMatch || Number(durationMatch[1]) <= 0) {
    throw new Error(
      'ACCESS_TOKEN_EXPIRES_IN must be a positive duration such as 15m, 1h, or 1d'
    );
  }

  return expiresIn as SignOptions['expiresIn'];
};

export const signAccessToken = (userId: string): string => {
  if (!OBJECT_ID_PATTERN.test(userId)) {
    throw new Error('Cannot issue an access token without a valid user ID');
  }

  return jwt.sign({}, getAccessTokenSecret(), {
    algorithm: 'HS256',
    subject: userId,
    expiresIn: getAccessTokenExpiry(),
  });
};

export const verifyAccessToken = (token: string): AccessTokenClaims => {
  const decoded = jwt.verify(token, getAccessTokenSecret(), {
    algorithms: ['HS256'],
  });

  if (
    typeof decoded === 'string' ||
    typeof decoded.sub !== 'string' ||
    !OBJECT_ID_PATTERN.test(decoded.sub) ||
    typeof decoded.iat !== 'number' ||
    typeof decoded.exp !== 'number' ||
    decoded.exp <= decoded.iat
  ) {
    throw new jwt.JsonWebTokenError('Invalid access token subject');
  }

  return decoded as AccessTokenClaims;
};
