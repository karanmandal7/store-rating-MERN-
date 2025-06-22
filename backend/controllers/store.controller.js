import asyncHandler from 'express-async-handler';
import Store from '../models/store.model.js';
import Rating from '../models/rating.model.js';

const getStores = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { address: { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {};

    const stores = await Store.find({ ...keyword });

    const storesWithRatings = await Promise.all(
        stores.map(async (store) => {
            const ratings = await Rating.find({ store: store._id });
            const avgRating = ratings.length > 0 ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length : 0;
            
            let myRating = null;
            if (req.user) {
                const userRating = ratings.find(r => r.user.equals(req.user._id));
                myRating = userRating ? userRating.rating : null;
            }

            return {
                ...store.toObject(),
                averageRating: avgRating,
                myRating: myRating
            };
        })
    );

    res.json(storesWithRatings);
});

const getStoreById = asyncHandler(async (req, res) => {
    const store = await Store.findById(req.params.id);

    if (store) {
        // Calculate average rating
        const ratings = await Rating.find({ store: store._id });
        const avgRating = ratings.length > 0 ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length : 0;
        
        // Get user's rating
        let myRating = null;
        if(req.user){
            const userRating = await Rating.findOne({ store: store._id, user: req.user._id });
            myRating = userRating ? userRating.rating : null;
        }

        res.json({
            ...store.toObject(),
            averageRating: avgRating,
            myRating: myRating,
        });
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

const rateStore = asyncHandler(async (req, res) => {
    const { rating } = req.body;
    const storeId = req.params.id;

    const store = await Store.findById(storeId);

    if (store) {
        const existingRating = await Rating.findOne({
            user: req.user._id,
            store: storeId,
        });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            await Rating.create({
                user: req.user._id,
                store: storeId,
                rating,
            });
        }

        // After rating, recalculate average and get the user's rating
        const ratings = await Rating.find({ store: storeId });
        const avgRating = ratings.length > 0 
            ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length 
            : 0;

        // We need to find the user's rating again here to be safe
        const userRating = await Rating.findOne({ user: req.user._id, store: storeId });

        const updatedStoreData = {
            ...store.toObject(),
            averageRating: avgRating,
            myRating: userRating ? userRating.rating : null,
        };
        
        res.status(200).json(updatedStoreData);

    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

const searchStores = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { address: { $regex: req.query.keyword, $options: 'i' } }
        ]
    } : {};
    const stores = await Store.find({ ...keyword });
    res.json(stores);
});

const getMyStore = asyncHandler(async (req, res) => {
    const store = await Store.findOne({ owner: req.user._id });
    if (store) {
        const ratings = await Rating.find({ store: store._id }).populate('user', 'name');
        const avgRating = ratings.length > 0 ? ratings.reduce((acc, item) => acc + item.rating, 0) / ratings.length : 0;
        res.json({
            store: { ...store.toObject(), averageRating: avgRating },
            ratings,
        });
    } else {
        res.status(404);
        throw new Error('Store not found');
    }
});

export { getStores, getStoreById, rateStore, searchStores, getMyStore }; 