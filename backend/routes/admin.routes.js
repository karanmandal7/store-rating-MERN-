import express from 'express';
import { getUsers, getStores, getStats, addUser, addStore, getUserById, getStoreByIdAsAdmin } from '../controllers/admin.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/users').get(protect, admin, getUsers).post(protect, admin, addUser);
router.route('/users/:id').get(protect, admin, getUserById);
router.route('/stores').get(protect, admin, getStores).post(protect, admin, addStore);
router.route('/stores/:id').get(protect, admin, getStoreByIdAsAdmin);
router.route('/stats').get(protect, admin, getStats);

export default router; 