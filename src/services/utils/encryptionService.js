import bcrypt from 'bcryptjs';
import { ValidationError } from '../../utils/errors.js';

// Hashes a plaintext password and returns the hashed version
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error(`Error hashing password: ${error.message}`);
    }
};

// Compares a plaintext password with a hashed password
export const comparePassword = async (plaintextPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plaintextPassword, hashedPassword);
    } catch (error) {
        throw new Error(`Error comparing passwords: ${error.message}`);
    }
};

