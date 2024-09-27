import express from 'express';
import PartyController from '../../controllers/party/PartyController.js';

const partyRouter = express.Router();

// Public routes
partyRouter.post('/', PartyController.create); // Registration route

partyRouter.get('/findByName/:name/:company_id', PartyController.findByName.bind(PartyController)) // Find by name
    .get('/findByCompany/:company', PartyController.findByCompany)
    .get('/', PartyController.findAll)
    .get('/:id', PartyController.findById) // Read a specific user
    .put('/:id', PartyController.update) // Update a specific user
    .delete('/:id', PartyController.delete) // Delete a specific user
    .get('/findByPhoneNo/:phone_no/:company_id', PartyController.findByPhoneNo);

export default partyRouter;
