"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const assessment_1 = __importDefault(require("./routes/assessment"));
const community_1 = __importDefault(require("./routes/community"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/assessment', assessment_1.default);
app.use('/api/community', community_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});
// Database and Server Start
if (process.env.NODE_ENV !== 'test') {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youth_app';
    mongoose_1.default.connect(MONGO_URI)
        .then(() => {
        console.log('Connected to MongoDB');
    })
        .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map