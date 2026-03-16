"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const scheduleRoute_1 = __importDefault(require("./routes/scheduleRoute"));
const friendRoute_1 = __importDefault(require("./routes/friendRoute"));
const friendRequestRoute_1 = __importDefault(require("./routes/friendRequestRoute"));
const hobbyRoutes_1 = __importDefault(require("./routes/hobbyRoutes"));
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
const allowedOrigins = ((_a = process.env.CORS_ALLOWED_ORIGINS) !== null && _a !== void 0 ? _a : [
    'http://localhost:5173',
    'https://schedulefinder.netlify.app',
    'https://www.schedulefinder.netlify.app',
].join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 204,
};
cloudinary_1.v2.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
    secure: true,
});
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/users/friendRequest', friendRequestRoute_1.default);
app.use('/api/users/friends', friendRoute_1.default);
app.use('/api/users', userRoute_1.default);
app.use('/api/auth', authRoute_1.default);
app.use('/api/schedules', scheduleRoute_1.default);
app.use('/api/hobbies', hobbyRoutes_1.default);
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(`${process.env.DB_URI}`, {})
    .then(() => console.log('connected to DB!'))
    .catch((err) => console.log(err));
const server = app.listen(port, () => {
    console.log('listening on port 3001');
});
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('Server shutdown complete.');
        process.exit(0);
    });
});
