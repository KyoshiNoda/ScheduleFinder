import { RequestHandler } from 'express';
import multer from 'multer';
import { outboundEnabled } from '../integrations/outbound';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
});

export const requireImageProvider: RequestHandler = (_req, res, next) => {
  if (!outboundEnabled()) {
    return res.status(503).json({ error: 'Image uploads are unavailable.' });
  }
  return next();
};

export const parseProfileImage: RequestHandler = (req, res, next) => {
  upload.single('photoURL')(req, res, (error: unknown) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'Profile image must be 5 MiB or smaller.' });
    }
    return res.status(400).json({ error: 'Invalid profile image upload.' });
  });
};
