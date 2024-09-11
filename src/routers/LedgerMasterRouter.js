import express from 'express'; ``
import LedgerMasterController from '../controllers/LedgerMasterController.js';

const ledgerMasterRouter = express.Router();

// Public routes
ledgerMasterRouter.post('/', LedgerMasterController.create); // Registration route
ledgerMasterRouter.get('/', LedgerMasterController.read);
ledgerMasterRouter.get('/:id', LedgerMasterController.read); // Read a specific user
ledgerMasterRouter.put('/:id', LedgerMasterController.update); // Update a specific user
ledgerMasterRouter.delete('/:id', LedgerMasterController.delete); // Delete a specific user
export default ledgerMasterRouter;