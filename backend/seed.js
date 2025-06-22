import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/user.model.js';
import Store from './models/store.model.js';
import Rating from './models/rating.model.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Rating.deleteMany();
    await Store.deleteMany();
    await User.deleteMany();

    // Manually hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    // Create Users
    // Plaintext Password for all users: 'Password123!'
    const createdUsers = await User.insertMany([
      {
        name: 'System Administrator Super User',
        email: 'admin@example.com',
        password: hashedPassword,
        address: '123 Admin Street, Suite 100, Control City',
        role: 'Admin',
      },
      {
        name: 'The Original General Store Owner',
        email: 'owner@example.com',
        password: hashedPassword,
        address: '456 Owner Avenue, Commerce Town',
        role: 'Store Owner',
      },
      {
        name: 'Johnathan Bartholomew Doe The First',
        email: 'user1@example.com',
        password: hashedPassword,
        address: '789 User Circle, Apartment 2B, Reviewsville',
        role: 'Normal User',
      },
      {
        name: 'Penelope Annabeth van der Waal',
        email: 'user2@example.com',
        password: hashedPassword,
        address: '101 User Lane, Unit 5, Ratington',
        role: 'Normal User',
      },
    ]);

    const adminUser = createdUsers[0];
    const storeOwner = createdUsers[1];
    const normalUserOne = createdUsers[2];
    const normalUserTwo = createdUsers[3];

    // Create a Store
    const createdStore = await Store.create({
      name: 'The General Store',
      email: 'contact@generalstore.com',
      address: '1 Main Street, Anytown',
      owner: storeOwner._id,
    });

    // Create Ratings
    await Rating.insertMany([
      {
        store: createdStore._id,
        user: normalUserOne._id,
        rating: 5,
      },
      {
        store: createdStore._id,
        user: normalUserTwo._id,
        rating: 4,
      },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Rating.deleteMany();
    await Store.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 