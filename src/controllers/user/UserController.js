import UserService from "../../services/user/UserService.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { validatePassword } from "../../utils/validateModels.js";
import BaseController from "../base/BaseController.js";

class UserController extends BaseController {
    constructor() {
        super(UserService);
    }

    // Create a new user
    async create(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const user = await UserService.createUser(req.body);
            this.handleSuccess(res, 201, user);
        } catch (error) {
            console.error('Error creating user:', error);
            this.handleError(res, error);
        }
    }

    // Find all users with optional query parameters
    async findAll(req, res) {
        try {
            const query = req.query; // Get query parameters from the request
            const users = await UserService.findAll(query);

            if (!users || users.length === 0) {
                throw new NotFoundError('No users found');
            }

            this.handleSuccess(res, 200, users);
        } catch (error) {
            console.error('Error finding users:', error);
            this.handleError(res, error);
        }
    }

    // Find a user by ID
    async findById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const user = await UserService.findById(id);
            if (!user) {
                throw new NotFoundError('User not found');
            }

            this.handleSuccess(res, 200, user);
        } catch (error) {
            console.error('Error finding user by ID:', error);
            this.handleError(res, error);
        }
    }

    // Update a user by ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id || !data || Object.keys(data).length === 0) {
                throw new BadRequestError('ID and data are required');
            }

            const updatedUser = await UserService.update(id, data);
            if (!updatedUser) {
                throw new NotFoundError('User not found');
            }

            this.handleSuccess(res, 200, { message: 'User updated successfully', data: updatedUser });
        } catch (error) {
            console.error('Error updating user:', error);
            this.handleError(res, error);
        }
    }

    // Delete a user by ID
    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const deleted = await UserService.delete(id);
            if (!deleted) {
                throw new NotFoundError('User not found');
            }

            this.handleSuccess(res, 200, { message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            this.handleError(res, error);
        }
    }

    // Login method
    async login(req, res) {
        try {
            this.validateLogin(req.body);
            const token = await UserService.loginUser(req.body);
            this.handleSuccess(res, 200, token);
        } catch (error) {
            console.error('Error logging in:', error);
            this.handleError(res, error);
        }
    }

    // Change password method
    async changePassword(req, res) {
        const userId = req.params.id; // Assumes `req.user` is populated elsewhere

        try {
            this.validateChangePassword(req.body);
            const result = await UserService.changeUserPassword(userId, req.body);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error changing password:', error);
            this.handleError(res, error);
        }
    }

    // Validate login data
    validateLogin(data) {
        const { email, password } = data;
        const errors = [];
        if (!email || !password) {
            errors.push('Email and password are required');
        }
        if (errors.length) {
            throw new BadRequestError(errors.join(', '));
        }
    }

    // Validate change password data
    validateChangePassword(data) {
        const { oldPassword, newPassword } = data;
        const errors = [];
        if (!oldPassword || !newPassword) {
            errors.push('Old password and new password are required');
        }
        if (errors.length) {
            throw new BadRequestError(errors.join(', '));
        }
        validatePassword(newPassword); // Ensure you have a validation utility for passwords
    }
}

export default new UserController();