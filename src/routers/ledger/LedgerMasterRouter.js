import express from 'express';
import LedgerMasterController from '../../controllers/ledger/LedgerMasterController.js'
const ledgerMasterRouter = express.Router();

// Public routes
ledgerMasterRouter.post('/', LedgerMasterController.create) // Registration route
.get('/', LedgerMasterController.findAll)
.get('/:id', LedgerMasterController.findById) // Read a specific user
.put('/:id', LedgerMasterController.update) // Update a specific user
.delete('/:id', LedgerMasterController.delete) // Delete a specific user
.get('/findByCompany/:company_id', LedgerMasterController.findByCompanyId);

export default ledgerMasterRouter;