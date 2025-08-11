import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 60,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                // At least one uppercase letter and one special character
                return /^(?=.*[A-Z])(?=.*[!@#$&*])/.test(v);
            },
            message: props => `Password must contain at least one uppercase letter and one special character!`
        }
    },
    address: {
        type: String,
        required: true,
        maxlength: 400,
    },
    role: {
        type: String,
        enum: ['Normal User', 'Store Owner', 'Admin'],
        default: 'Normal User',
    },
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User; 