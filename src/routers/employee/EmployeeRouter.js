import express from 'express';
import EmployeeController from '../../controllers/employee/EmployeeController.js';
import authenticateJWT from '../../middleware/authMiddleware.js';
import authorizeRoles from '../../middleware/authorizationMiddleware.js';

const employeeRouter = express.Router();

// Public routes
employeeRouter.get('/requestOTP/:email', EmployeeController.requestOTP);
employeeRouter.get('/validateOTP/:email/:otp', EmployeeController.validateOTP);

// Authentication middleware for the rest of the routes
employeeRouter.use(authenticateJWT);

// Protected routes with authorization
const roles = ['admin', 'manager', 'accountant'];
employeeRouter.use(authorizeRoles(...roles)); // Apply to all subsequent routes

employeeRouter
    .post('/', EmployeeController.create) // Create a new employee
    .get('/', EmployeeController.findAll) // Get all employees
    .get('/:id', EmployeeController.findById) // Get employee by ID
    .put('/:id', EmployeeController.update) // Update employee by ID
    .delete('/:id', EmployeeController.delete) // Delete employee by ID
    .get('/findByCompany/:company_id', EmployeeController.findByCompany) // Find employees by company
    .get('/findEmployeeByName/:name/:company_id', EmployeeController.findByName); // Find employee by name

export default employeeRouter;