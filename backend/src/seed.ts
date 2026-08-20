import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Post } from './models/Post';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youth_app';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Seed Users
    const salt = await require('bcryptjs').genSalt(10);
    const hashedPassword = await require('bcryptjs').hash('password123', salt);

    const users = await User.insertMany([
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
    const posts = await Post.insertMany([
      {
        author: users[0].name,
        content: 'Just finished my first assessment! Excited to see what career paths fit me best.',
        likes: 12
      },
      {
        author: users[1].name,
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
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
