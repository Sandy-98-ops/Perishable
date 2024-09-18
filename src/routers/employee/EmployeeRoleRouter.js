import express from 'express';
import EmployeeRoleController from '../../controllers/expense/EmployeeRoleController.js';

const employeeRoleRouter = express.Router();
employeeRoleRouter.post('/', EmployeeRoleController.create);
employeeRoleRouter.get('/', EmployeeRoleController.findAll);
employeeRoleRouter.get('/:id', EmployeeRoleController.findById);
employeeRoleRouter.put('/:id', EmployeeRoleController.update);
employeeRoleRouter.delete('/:id', EmployeeRoleController.delete);

export default employeeRoleRouter;