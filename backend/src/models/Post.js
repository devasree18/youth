"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
}, { timestamps: true });
exports.Post = mongoose_1.default.model('Post', postSchema);
//# sourceMappingURL=Post.js.map