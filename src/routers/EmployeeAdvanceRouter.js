import express from 'express';
import EmployeeAdvanceController from '../controllers/EmployeeAdvanceController.js';

const employeeAdvanceRouter = express.Router();

// Public routes
employeeAdvanceRouter.post('/', EmployeeAdvanceController.create); // Registration route
employeeAdvanceRouter.get('/', EmployeeAdvanceController.read);
employeeAdvanceRouter.get('/:id', EmployeeAdvanceController.read); // Read a specific user
employeeAdvanceRouter.put('/:id', EmployeeAdvanceController.update); // Update a specific user
employeeAdvanceRouter.delete('/:id', EmployeeAdvanceController.delete); // Delete a specific user

employeeAdvanceRouter.get('/findByCompany/:company', EmployeeAdvanceController.findByCompany);

export default employeeAdvanceRouter;