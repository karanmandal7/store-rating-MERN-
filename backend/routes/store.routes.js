import express from 'express';
import { getStores, getStoreById, rateStore, searchStores, getMyStore } from '../controllers/store.controller.js';
import { protect, storeOwner } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(getStores);
router.route('/search').get(searchStores);
router.route('/mystore').get(protect, storeOwner, getMyStore);
router.route('/:id').get(protect, getStoreById);
router.route('/:id/rate').post(protect, rateStore);

export default router; 