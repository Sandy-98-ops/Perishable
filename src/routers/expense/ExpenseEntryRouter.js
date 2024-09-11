import express from 'express';
import ExpenseEntryController from '../../controllers/expense/ExpenseEntryController.js';

const expenseEntryRouter = express.Router();

// Public routes
expenseEntryRouter.post('/', ExpenseEntryController.create); // Registration route
expenseEntryRouter.get('/', ExpenseEntryController.findAll);
expenseEntryRouter.get('/:id', ExpenseEntryController.findById); // Read a specific user
expenseEntryRouter.put('/:id', ExpenseEntryController.update); // Update a specific user
expenseEntryRouter.delete('/:id', ExpenseEntryController.delete); // Delete a specific user

expenseEntryRouter.get('/findByCompany/:company', ExpenseEntryController.findByCompany);

export default expenseEntryRouter;