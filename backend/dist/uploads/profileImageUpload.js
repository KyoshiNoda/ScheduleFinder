"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseProfileImage = exports.requireImageProvider = void 0;
const multer_1 = __importDefault(require("multer"));
const outbound_1 = require("../integrations/outbound");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});
const requireImageProvider = (_req, res, next) => {
    if (!(0, outbound_1.outboundEnabled)()) {
        return res.status(503).json({ error: 'Image uploads are unavailable.' });
    }
    return next();
};
exports.requireImageProvider = requireImageProvider;
const parseProfileImage = (req, res, next) => {
    upload.single('photoURL')(req, res, (error) => {
        if (!error)
            return next();
        if (error instanceof multer_1.default.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'Profile image must be 5 MiB or smaller.' });
        }
        return res.status(400).json({ error: 'Invalid profile image upload.' });
    });
};
exports.parseProfileImage = parseProfileImage;
