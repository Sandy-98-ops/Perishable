import User from "../../models/user/User.js";
import { comparePassword, hashPassword } from "../utils/encryptionService.js";
import { validatePassword } from "../../utils/validateModels.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import BaseService from "../../base/BaseService.js";

dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;

class UserService extends BaseService {
    async createUser(data) {
        try {
            const { password } = data;
            if (!password) {
                throw new BadRequestError('Password is required');
            }

            const hashedPassword = await hashPassword(password);
            const user = await User.create({
                ...data,
                password: hashedPassword
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    async loginUser(data) {
        try {
            const { email, password } = data;
            if (!email || !password) {
                throw new BadRequestError('Email and password are required');
            }

            const user = await User.findOne({ where: { email } });
            if (!user) throw new NotFoundError('User not found');

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) throw new BadRequestError('Invalid password');

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRATION }
            );

            return { token };
        } catch (error) {
            throw error;
        }
    }

    async changeUserPassword(userId, data) {
        try {
            const { oldPassword, newPassword } = data;
            if (!oldPassword || !newPassword) {
                throw new BadRequestError('Old password and new password are required');
            }
            validatePassword(newPassword);

            const user = await User.findByPk(userId);
            if (!user) throw new NotFoundError('User not found');

            const isOldPasswordValid = await comparePassword(oldPassword, user.password);
            if (!isOldPasswordValid) {
                throw new BadRequestError('Old password is incorrect');
            }

            const hashedNewPassword = await hashPassword(newPassword);
            user.password = hashedNewPassword;
            await user.save();

            return { message: 'Password updated successfully' };
        } catch (error) {
            throw error;
        }
    }
}

export default new UserService();
