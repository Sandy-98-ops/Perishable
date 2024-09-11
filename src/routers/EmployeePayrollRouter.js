import express from 'express';
import EmployeePayrollController from '../controllers/EmployeePayrollController.js';

const employeePayrollRouter = express.Router();

// Public routes
employeePayrollRouter.post('/', EmployeePayrollController.create); // Registration route
employeePayrollRouter.get('/', EmployeePayrollController.read);
employeePayrollRouter.get('/:id', EmployeePayrollController.read); // Read a specific user
employeePayrollRouter.put('/:id', EmployeePayrollController.update); // Update a specific user
employeePayrollRouter.delete('/:id', EmployeePayrollController.delete); // Delete a specific user

employeePayrollRouter.get('/findByCompany/:company', EmployeePayrollController.findByCompany);

export default employeePayrollRouter;