import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { v2 as cloudinary } from 'cloudinary';

export const outboundEnabled = (): boolean =>
  process.env.NODE_ENV === 'production' && process.env.OUTBOUND_MODE === 'live';

export const validateOutboundConfiguration = (): void => {
  if (!outboundEnabled()) return;
  if (!process.env.SENDGRID_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error('Live outbound integrations require SendGrid and Cloudinary credentials.');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export const sendEmail = async (message: MailDataRequired): Promise<void> => {
  if (!outboundEnabled()) return;
  await sgMail.send(message);
};

export const uploadProfileImage = async (dataUri: string): Promise<{ secureUrl: string; publicId: string }> => {
  if (!outboundEnabled()) throw new Error('Outbound integrations are disabled.');
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'uploads',
    resource_type: 'image',
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  });
  return { secureUrl: result.secure_url, publicId: result.public_id };
};

export const destroyProfileImage = async (publicId: string): Promise<void> => {
  if (!outboundEnabled()) return;
  await cloudinary.uploader.destroy(publicId);
};
