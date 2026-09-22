"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const scheduleRoute_1 = __importDefault(require("./routes/scheduleRoute"));
const friendRoute_1 = __importDefault(require("./routes/friendRoute"));
const friendRequestRoute_1 = __importDefault(require("./routes/friendRequestRoute"));
const hobbyRoutes_1 = __importDefault(require("./routes/hobbyRoutes"));
const defaultAllowedOrigins = [
    'http://localhost:5173',
    'https://schedulefinder.netlify.app',
    'https://www.schedulefinder.netlify.app',
];
const getCorsOptions = () => {
    var _a;
    const allowedOrigins = ((_a = process.env.CORS_ALLOWED_ORIGINS) !== null && _a !== void 0 ? _a : defaultAllowedOrigins.join(','))
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    return {
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
};
const createApp = () => {
    const app = (0, express_1.default)();
    const corsOptions = getCorsOptions();
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
    return app;
};
exports.createApp = createApp;
