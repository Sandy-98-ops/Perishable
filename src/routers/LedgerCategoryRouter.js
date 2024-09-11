

import express from 'express';
import LedgerCategoryController from '../controllers/LedgerCategoryController.js';

const ledgerCategoryRouter = express.Router();

// Public routes
ledgerCategoryRouter.post('/', LedgerCategoryController.create); // Registration route
ledgerCategoryRouter.get('/', LedgerCategoryController.read);
ledgerCategoryRouter.get('/:id', LedgerCategoryController.read); // Read a specific user
ledgerCategoryRouter.put('/:id', LedgerCategoryController.update); // Update a specific user
ledgerCategoryRouter.delete('/:id', LedgerCategoryController.delete); // Delete a specific user

ledgerCategoryRouter.get('/findByCompany/:company', LedgerCategoryController.findByCompany)
export default ledgerCategoryRouter;
