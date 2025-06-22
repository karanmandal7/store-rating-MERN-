import express from 'express';
const router = express.Router();
import { updateUserPassword } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

router.route('/profile/password').put(protect, updateUserPassword);

export default router; 