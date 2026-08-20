"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Post_1 = require("../models/Post");
const router = express_1.default.Router();
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post_1.Post.find().sort({ createdAt: -1 }).limit(20);
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
router.post('/posts', async (req, res) => {
    try {
        const { author, content } = req.body;
        const post = new Post_1.Post({ author, content });
        await post.save();
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});
exports.default = router;
//# sourceMappingURL=community.js.map