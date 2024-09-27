import BaseController from "../base/BaseController.js";
import EmployeeService from '../../services/employee/EmployeeService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class EmployeeController extends BaseController {
    constructor() {
        super(EmployeeService);
    }

    // Create a new employee
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const employeeCreation = await EmployeeService.createEmployee(req.body);
            this.handleSuccess(res, 201, employeeCreation);
        } catch (error) {
            console.error('Error creating employee:', error);
            this.handleError(res, error);
        }
    }

    findByName = async (req, res) => {
        try { 
            this.handleSuccess(res, 200,
                await EmployeeService.findEmployeeByName(req.params.name, req.params.company_id));
        }
        catch (error) {
            console.error('Error finding employee by name:', error);
            this.handleError(res, error);
        }
    };

    // Retrieve all employees
    findAll = async (req, res) => {
        try {
            const employees = await EmployeeService.findAllEmployees();
            this.handleSuccess(res, 200, employees);
        } catch (error) {
            console.error('Error retrieving all employees:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve an employee by ID
    findById = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const employee = await EmployeeService.findById(id);
            if (!employee) {
                throw new NotFoundError('Employee not found');
            }

            this.handleSuccess(res, 200, employee);
        } catch (error) {
            console.error('Error finding employee by ID:', error);
            this.handleError(res, error);
        }
    }

    // Update an employee by ID
    update = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const updatedEmployee = await EmployeeService.updateEmployee(id, req.body);
            if (!updatedEmployee) {
                throw new NotFoundError('Employee not found');
            }

            this.handleSuccess(res, 200, updatedEmployee);
        } catch (error) {
            console.error('Error updating employee:', error);
            this.handleError(res, error);
        }
    }

    // Delete an employee by ID
    delete = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await EmployeeService.deleteEmployee(id);
            this.handleSuccess(res, 204, { message: 'Employee deleted successfully' });
        } catch (error) {
            console.error('Error deleting employee:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve employees by company
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;

            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const employees = await EmployeeService.findEmployeesByCompany(companyId);
            this.handleSuccess(res, 200, employees);
        } catch (error) {
            console.error('Error finding employees by company:', error);
            this.handleError(res, error);
        }
    }

    requestOTP = async (req, res) => {
        const email = req.params.email;
        try {
            this.handleSuccess(res, 201, (await EmployeeService.requestOTP(email)));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    validateOTP = async (req, res) => {
        const email = req.params.email;
        const otp = req.params.otp;
        try {
            this.handleSuccess(res, 200, (await EmployeeService.validateOTP(email, otp)));
        } catch (error) {
            console.log(error)
            this.handleError(res, error);
        }
    }
}

export default new EmployeeController();