import express from 'express';
import EmployeeController from '../../controllers/employee/EmployeeController.js';
import authenticateJWT from '../../middleware/authMiddleware.js';
import authorizeRoles from '../../middleware/authorizationMiddleware.js'; // Ensure correct import path

const employeeRouter = express.Router();

// Public routes - No authentication required
employeeRouter.get('/requestOTP/:email', EmployeeController.requestOTP);
employeeRouter.get('/validateOTP/:email/:otp', EmployeeController.validateOTP);

// Authentication middleware for the rest of the routes
employeeRouter.use(authenticateJWT);

// Protected routes - Authorization required
employeeRouter.post('/', authorizeRoles('admin'), EmployeeController.create); // Create a new employee
employeeRouter.get('/', authorizeRoles('admin'), EmployeeController.findAll); // Get all employees
employeeRouter.get('/:id', authorizeRoles('admin'), EmployeeController.findById); // Get a specific employee by ID
employeeRouter.put('/:id', authorizeRoles('admin'), EmployeeController.update); // Update a specific employee by ID
employeeRouter.delete('/:id', authorizeRoles('admin'), EmployeeController.delete); // Delete a specific employee by ID
employeeRouter.get('/findByCompany/:company_id', authorizeRoles('admin'), EmployeeController.findByCompany); // Find employees by company

export default employeeRouter;