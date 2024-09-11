import express from 'express';
import PartyController from '../../controllers/party/PartyController.js';

const partyRouter = express.Router();

// Public routes
partyRouter.post('/', PartyController.create); // Registration route

partyRouter.get('/findByName/:name', PartyController.findByName.bind(PartyController)); // Find by name
partyRouter.get('/findByCompany/:company', PartyController.findByCompany);
partyRouter.get('/', PartyController.findAll);
partyRouter.get('/:id', PartyController.findById); // Read a specific user
partyRouter.put('/:id', PartyController.update); // Update a specific user
partyRouter.delete('/:id', PartyController.delete); // Delete a specific user
export default partyRouter;
