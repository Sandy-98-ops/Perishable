import express from 'express';
import LedgerController from '../controllers/LedgerController.js';

const ledgerRouter = express.Router();

// Public routes
ledgerRouter.post('/', LedgerController.create); // Registration route
ledgerRouter.get('/', LedgerController.read);
ledgerRouter.get('/:id', LedgerController.read); // Read a specific user
ledgerRouter.put('/:id', LedgerController.update); // Update a specific user
ledgerRouter.delete('/:id', LedgerController.delete); // Delete a specific user
ledgerRouter.get('/findLedgerByParty/:party', LedgerController.findLedgerByParty);
export default ledgerRouter;
