"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
const Post_1 = require("./models/Post");
dotenv_1.default.config();
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youth_app';
const seedDatabase = async () => {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log('Connected to MongoDB for seeding');
        // Clear existing data
        await User_1.User.deleteMany({});
        await Post_1.Post.deleteMany({});
        console.log('Cleared existing data');
        // Seed Users
        const salt = await require('bcryptjs').genSalt(10);
        const hashedPassword = await require('bcryptjs').hash('password123', salt);
        const users = await User_1.User.insertMany([
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                password: hashedPassword,
                assessments: [{ result: 'High analytical skills' }]
            },
            {
                name: 'Bob Smith',
                email: 'bob@example.com',
                password: hashedPassword,
                assessments: [{ result: 'Strong communication skills' }]
            }
        ]);
        console.log(`Seeded ${users.length} users`);
        // Seed Posts
        const posts = await Post_1.Post.insertMany([
            {
                author: users[0]?.name || 'Alice Johnson',
                content: 'Just finished my first assessment! Excited to see what career paths fit me best.',
                likes: 12
            },
            {
                author: users[1]?.name || 'Bob Smith',
                content: 'Looking for advice on transitioning from marketing to software engineering. Any tips?',
                likes: 5
            },
            {
                author: 'Jane Doe',
                content: 'Remember that it is okay to not know what you want to do yet. Keep exploring!',
                likes: 34
            }
        ]);
        console.log(`Seeded ${posts.length} posts`);
        console.log('Database seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
//# sourceMappingURL=seed.js.map