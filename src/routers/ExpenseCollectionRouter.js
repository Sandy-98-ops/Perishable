import express from 'express';
import ExpenseCollectionController from '../controllers/ExpenseCollectionController.js';

const expenseCollectionRouter = express.Router();

// Public routes
expenseCollectionRouter.post('/', ExpenseCollectionController.create); // Registration route
expenseCollectionRouter.get('/', ExpenseCollectionController.read);
expenseCollectionRouter.get('/:id', ExpenseCollectionController.read); // Read a specific user
expenseCollectionRouter.put('/:id', ExpenseCollectionController.update); // Update a specific user
expenseCollectionRouter.delete('/:id', ExpenseCollectionController.delete); // Delete a specific user

expenseCollectionRouter.get('/findByCompany/:company', ExpenseCollectionController.findByCompany);

export default expenseCollectionRouter;