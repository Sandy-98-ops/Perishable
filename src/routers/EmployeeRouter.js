import express from 'express';
import EmployeeController from '../controllers/EmployeeController.js';

const employeeRouter = express.Router();

// Public routes
employeeRouter.post('/', EmployeeController.create); // Registration route
employeeRouter.get('/', EmployeeController.read);
employeeRouter.get('/:id', EmployeeController.read); // Read a specific user
employeeRouter.put('/:id', EmployeeController.update); // Update a specific user
employeeRouter.delete('/:id', EmployeeController.delete); // Delete a specific user

employeeRouter.get('/findByCompany/:company', EmployeeController.findByCompany);

export default employeeRouter;