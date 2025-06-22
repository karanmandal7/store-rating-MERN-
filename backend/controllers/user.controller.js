import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';

// @desc    Update user password
// @route   PUT /api/users/profile/password
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(req.body.oldPassword))) {
        user.password = req.body.newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Invalid old password');
    }
});

export { updateUserPassword }; 