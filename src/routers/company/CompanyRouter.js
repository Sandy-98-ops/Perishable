import express from 'express';
import CompanyController from '../../controllers/company/CompanyController.js';

const companyRouter = express.Router();

// Public routes
companyRouter.post('/', CompanyController.create); // Registration route
companyRouter.get('/', CompanyController.findAll);
companyRouter.get('/:id', CompanyController.findById); // Read a specific user
companyRouter.put('/:id', CompanyController.update); // Update a specific user
companyRouter.delete('/:id', CompanyController.delete); // Delete a specific user

export default companyRouter;