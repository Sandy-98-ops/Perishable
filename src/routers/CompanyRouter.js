import express from 'express';
import CompanyController from '../controllers/CompanyController.js';

const companyRouter = express.Router();

// Public routes
companyRouter.post('/', CompanyController.create); // Registration route
companyRouter.get('/', CompanyController.read);
companyRouter.get('/:id', CompanyController.read); // Read a specific user
companyRouter.put('/:id', CompanyController.update); // Update a specific user
companyRouter.delete('/:id', CompanyController.delete); // Delete a specific user

export default companyRouter;
