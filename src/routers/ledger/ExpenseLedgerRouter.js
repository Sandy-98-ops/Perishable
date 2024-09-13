

import express from 'express';
import ExpenseLedgerController from '../../controllers/ledger/ExpenseLedgerController.js';

const expenseLedgerRouter = express.Router();

// Public routes
expenseLedgerRouter.post('/', ExpenseLedgerController.create); // Registration route
expenseLedgerRouter.get('/', ExpenseLedgerController.findAll);
expenseLedgerRouter.get('/:id', ExpenseLedgerController.findById); // Read a specific user
expenseLedgerRouter.put('/:id', ExpenseLedgerController.update); // Update a specific user
expenseLedgerRouter.delete('/:id', ExpenseLedgerController.delete); // Delete a specific user

expenseLedgerRouter.get('/findByCompany/:company', ExpenseLedgerController.findByCompany)
export default expenseLedgerRouter;
