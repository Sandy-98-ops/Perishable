import express from 'express';
import ExpenseCategoryController from '../../controllers/expense/ExpenseCategoryController.js';

const expenseCategoryRouter = express.Router();

// Public routes
expenseCategoryRouter.post('/', ExpenseCategoryController.create); // Registration route
expenseCategoryRouter.get('/', ExpenseCategoryController.findAll);
expenseCategoryRouter.get('/:id', ExpenseCategoryController.findById); // Read a specific user
expenseCategoryRouter.put('/:id', ExpenseCategoryController.update); // Update a specific user
expenseCategoryRouter.delete('/:id', ExpenseCategoryController.delete); // Delete a specific user

expenseCategoryRouter.get('/findByCompany/:company', ExpenseCategoryController.findByCompany);

export default expenseCategoryRouter;