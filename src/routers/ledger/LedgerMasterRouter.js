import express from 'express';
import LedgerMasterController from '../../controllers/ledger/LedgerMasterController.js'
const ledgerMasterRouter = express.Router();

// Public routes
ledgerMasterRouter.post('/', LedgerMasterController.create); // Registration route
ledgerMasterRouter.get('/', LedgerMasterController.findAll);
ledgerMasterRouter.get('/:id', LedgerMasterController.findById); // Read a specific user
ledgerMasterRouter.put('/:id', LedgerMasterController.update); // Update a specific user
ledgerMasterRouter.delete('/:id', LedgerMasterController.delete); // Delete a specific user
export default ledgerMasterRouter;