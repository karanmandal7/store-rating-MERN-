import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Store from '../models/store.model.js';
import Rating from '../models/rating.model.js';

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).lean();

    const usersWithStoreData = await Promise.all(users.map(async (user) => {
        if (user.role === 'Store Owner') {
            const store = await Store.findOne({ owner: user._id });
            if (store) {
                const ratings = await Rating.find({ store: store._id });
                const avgRating = ratings.length > 0
                    ? (ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length).toFixed(2)
                    : 0;
                return { ...user, storeAverageRating: avgRating, storeId: store._id };
            }
        }
        return user;
    }));

    res.json(usersWithStoreData);
});

const getStores = asyncHandler(async (req, res) => {
    const stores = await Store.find({}).populate('owner', 'name email');
    
    const storesWithAvgRating = await Promise.all(stores.map(async (store) => {
        const ratings = await Rating.find({ store: store._id });
        const avgRating = ratings.length > 0 ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length : 0;
        return {
            ...store.toObject(),
            averageRating: avgRating,
        };
    }));

    res.json(storesWithAvgRating);
});

const getStats = asyncHandler(async (req, res) => {
    const userCount = await User.countDocuments();
    const storeCount = await Store.countDocuments();
    const ratingCount = await Rating.countDocuments();

    res.json({
        users: userCount,
        stores: storeCount,
        ratings: ratingCount,
    });
});

const addUser = asyncHandler(async (req, res) => {
    const { name, email, password, address, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password, address, role });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            address: user.address,
            role: user.role,
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const addStore = asyncHandler(async (req, res) => {
    const { name, email, address, owner } = req.body;
    const store = new Store({
        name,
        email,
        address,
        owner,
    });
    const createdStore = await store.save();
    res.status(201).json(createdStore);
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    let userToReturn = user.toObject();

    if (user.role === 'Store Owner') {
        const store = await Store.findOne({ owner: user._id });
        if (store) {
            const ratings = await Rating.find({ store: store._id });
            const avgRating = ratings.length > 0 ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length : 0;
            userToReturn.storeAverageRating = avgRating;
        } else {
            userToReturn.storeAverageRating = 'N/A';
        }
    }

    res.json(userToReturn);
});

const getStoreByIdAsAdmin = asyncHandler(async (req, res) => {
    const store = await Store.findById(req.params.id).populate('owner', 'name email');
     if (store) {
        const ratings = await Rating.find({ store: store._id });
        const avgRating = ratings.length > 0 ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length : 0;
        res.json({
            ...store.toObject(),
            averageRating: avgRating,
        });
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

export { getUsers, getStores, getStats, addUser, addStore, getUserById, getStoreByIdAsAdmin }; 