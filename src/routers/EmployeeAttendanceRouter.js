import express from 'express';
import EmployeeAttendanceController from '../controllers/EmployeeAttendanceController.js';

const employeeAttendanceRouter = express.Router();

// Public routes
employeeAttendanceRouter.post('/', EmployeeAttendanceController.create); // Registration route
employeeAttendanceRouter.get('/', EmployeeAttendanceController.read);
employeeAttendanceRouter.get('/:id', EmployeeAttendanceController.read); // Read a specific user
employeeAttendanceRouter.put('/:id', EmployeeAttendanceController.update); // Update a specific user
employeeAttendanceRouter.delete('/:id', EmployeeAttendanceController.delete); // Delete a specific user

employeeAttendanceRouter.get('/findByCompany/:company', EmployeeAttendanceController.findByCompany);

export default employeeAttendanceRouter;