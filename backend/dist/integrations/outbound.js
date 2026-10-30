"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroyProfileImage = exports.uploadProfileImage = exports.sendEmail = exports.validateOutboundConfiguration = exports.outboundEnabled = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const cloudinary_1 = require("cloudinary");
const outboundEnabled = () => process.env.NODE_ENV === 'production' && process.env.OUTBOUND_MODE === 'live';
exports.outboundEnabled = outboundEnabled;
const validateOutboundConfiguration = () => {
    if (!(0, exports.outboundEnabled)())
        return;
    if (!process.env.SENDGRID_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Live outbound integrations require SendGrid and Cloudinary credentials.');
    }
    mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
};
exports.validateOutboundConfiguration = validateOutboundConfiguration;
const sendEmail = (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, exports.outboundEnabled)())
        return;
    yield mail_1.default.send(message);
});
exports.sendEmail = sendEmail;
const uploadProfileImage = (dataUri) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, exports.outboundEnabled)())
        throw new Error('Outbound integrations are disabled.');
    const result = yield cloudinary_1.v2.uploader.upload(dataUri, {
        folder: 'uploads',
        resource_type: 'image',
        transformation: [{ width: 300, height: 300, crop: 'fill' }],
    });
    return { secureUrl: result.secure_url, publicId: result.public_id };
});
exports.uploadProfileImage = uploadProfileImage;
const destroyProfileImage = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, exports.outboundEnabled)())
        return;
    yield cloudinary_1.v2.uploader.destroy(publicId);
});
exports.destroyProfileImage = destroyProfileImage;
