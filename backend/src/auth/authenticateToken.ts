import { RequestHandler, Response } from 'express';
import { verifyAccessToken } from './accessToken';

export interface AuthenticatedRequestContext {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      auth: AuthenticatedRequestContext;
    }
  }
}

const BEARER_TOKEN_PATTERN = /^Bearer[ \t]+([^ \t]+)[ \t]*$/i;
const AUTHENTICATION_ERROR = { error: 'Authentication required.' } as const;

const rejectAuthentication = (res: Response) =>
  res.set('WWW-Authenticate', 'Bearer').status(401).json(AUTHENTICATION_ERROR);

export const authenticateToken: RequestHandler = (req, res, next) => {
  const authorizationHeader = req.get('authorization');
  const token = authorizationHeader?.match(BEARER_TOKEN_PATTERN)?.[1];

  if (!token) {
    rejectAuthentication(res);
    return;
  }

  try {
    const claims = verifyAccessToken(token);
    req.auth = { userId: claims.sub };
    next();
  } catch {
    rejectAuthentication(res);
  }
};
