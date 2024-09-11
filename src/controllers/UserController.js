import BaseController from '../base/BaseController.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import dotenv from 'dotenv';
import mongoose from 'mongoose'; // Import mongoose
import { hashPassword, comparePassword } from '../services/encryptionService.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';
import { validatePassword } from '../utils/validateModels.js';

dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

class UserController extends BaseController {
    constructor() {
        super(User);
    }

    // Validate login data
    validateLogin = (data) => {
        const { email, password } = data;
        const errors = [];
        if (!email || !password) {
            errors.push('Email and password are required');
        }
        if (errors.length) {
            throw new Error(errors.join(', '));
        }
    }

    // Validate change password data
    validateChangePassword = (data) => {
        const { oldPassword, newPassword } = data;
        const errors = [];
        if (!oldPassword || !newPassword) {
            errors.push('Old password and new password are required');
        }
        if (errors.length) {
            throw new Error(errors.join(', '));
        }
        validatePassword(newPassword);
    }


    create = async (req, res) => {
        try {

            //Pre Logic

            const document = await this.model.create(req.body);


            //Post Logic

            this.handleSuccess(res, 201, document);

        } catch (error) {
            this.handleError(res, error);
        }
    }

    // Login method
    login = async (req, res) => {
        const { email, password } = req.body;

        try {
            this.validateLogin(req.body);
            const user = await this.model.findOne({ email });
            if (!user) return this.handleError(res, new NotFoundError('User not found'));

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) return this.handleError(res, new BadRequestError('Invalid password'));

            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRATION }
            );

            this.handleSuccess(res, 200, { token });
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // Change password method
    changePassword = async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const userId = req.params.id; // Assumes `req.user` is populated elsewhere

        try {
            this.validateChangePassword(req.body);
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return this.handleError(res, new BadRequestError('Invalid user ID format'));
            }
            const user = await this.model.findById(userId);
            if (!user) {
                return this.handleError(res, new NotFoundError('User not found'));
            }

            const isOldPasswordValid = await comparePassword(oldPassword, user.password);
            if (!isOldPasswordValid) {
                return this.handleError(res, new BadRequestError('Old password is incorrect'));
            }

            const hashedNewPassword = await hashPassword(newPassword);
            user.password = hashedNewPassword;
            await user.save();

            this.handleSuccess(res, 200, { message: 'Password updated successfully' });
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

export default new UserController();
