import express from 'express';
import UserController from '../controllers/UserController.js';

const UserRouter = express.Router();

// Public routes (no authentication required)
UserRouter.post('/login', UserController.login); // Login route
UserRouter.post('/', UserController.create); // Registration route

// Routes without authentication
UserRouter.get('/', UserController.read); // Read all users
UserRouter.get('/:id', UserController.read); // Read a specific user

UserRouter.put('/:id', UserController.update); // Update a specific user
UserRouter.delete('/:id', UserController.delete); // Delete a specific user
UserRouter.post("/changePassword/:id", UserController.changePassword);

export default UserRouter;
