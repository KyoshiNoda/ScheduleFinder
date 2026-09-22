import { NextFunction, Request, RequestHandler, Response } from 'express';
import { z } from 'zod';

interface RequestSchemas {
  body?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}

export interface ValidationIssueResponse {
  path: string;
  message: string;
}

export const sendValidationError = (
  res: Response,
  issues: ValidationIssueResponse[]
): Response =>
  res.status(400).json({
    error: 'Validation failed.',
    code: 'VALIDATION_ERROR',
    issues,
  });

const parsePart = (
  schema: z.ZodTypeAny,
  value: unknown,
  part: 'body' | 'params'
): { success: true; data: unknown } | { success: false; issues: ValidationIssueResponse[] } => {
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    issues: result.error.issues.map((issue) => ({
      path: [part, ...issue.path].join('.'),
      message: issue.message,
    })),
  };
};

export const validateRequest = ({ body, params }: RequestSchemas): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const issues: ValidationIssueResponse[] = [];
    let parsedBody: unknown;
    let parsedParams: unknown;

    if (body) {
      const result = parsePart(body, req.body ?? {}, 'body');
      if (result.success) {
        parsedBody = result.data;
      } else {
        issues.push(...result.issues);
      }
    }

    if (params) {
      const result = parsePart(params, req.params, 'params');
      if (result.success) {
        parsedParams = result.data;
      } else {
        issues.push(...result.issues);
      }
    }

    if (issues.length > 0) {
      return sendValidationError(res, issues);
    }

    if (body) {
      req.body = parsedBody;
    }
    if (params) {
      req.params = parsedParams as Request['params'];
    }

    return next();
  };

