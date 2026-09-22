"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.sendValidationError = void 0;
const sendValidationError = (res, issues) => res.status(400).json({
    error: 'Validation failed.',
    code: 'VALIDATION_ERROR',
    issues,
});
exports.sendValidationError = sendValidationError;
const parsePart = (schema, value, part) => {
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
const validateRequest = ({ body, params }) => (req, res, next) => {
    var _a;
    const issues = [];
    let parsedBody;
    let parsedParams;
    if (body) {
        const result = parsePart(body, (_a = req.body) !== null && _a !== void 0 ? _a : {}, 'body');
        if (result.success) {
            parsedBody = result.data;
        }
        else {
            issues.push(...result.issues);
        }
    }
    if (params) {
        const result = parsePart(params, req.params, 'params');
        if (result.success) {
            parsedParams = result.data;
        }
        else {
            issues.push(...result.issues);
        }
    }
    if (issues.length > 0) {
        return (0, exports.sendValidationError)(res, issues);
    }
    if (body) {
        req.body = parsedBody;
    }
    if (params) {
        req.params = parsedParams;
    }
    return next();
};
exports.validateRequest = validateRequest;
