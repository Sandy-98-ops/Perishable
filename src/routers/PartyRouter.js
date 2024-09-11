import express from 'express';
import PartyController from '../controllers/PartyController.js';

const partyRouter = express.Router();

// Public routes
partyRouter.post('/', PartyController.create); // Registration route

partyRouter.get('/findByName/:name', PartyController.findByName.bind(PartyController)); // Find by name
partyRouter.get('/findByCompany/:company', PartyController.findByCompany);
partyRouter.get('/', PartyController.read);
partyRouter.get('/:id', PartyController.read); // Read a specific user
partyRouter.put('/:id', PartyController.update); // Update a specific user
partyRouter.delete('/:id', PartyController.delete); // Delete a specific user
export default partyRouter;
