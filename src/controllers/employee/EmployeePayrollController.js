import BaseController from "../base/BaseController.js";
import EmployeePayrollService from '../../services/employee/EmployeePayrollService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class EmployeePayrollController extends BaseController {
    constructor() {
        super(EmployeePayrollService);
    }

    // Create a new payroll record
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await EmployeePayrollService.createPayroll(req.body);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating payroll:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve all payroll records
    findAll = async (req, res) => {
        try {
            const results = await EmployeePayrollService.findAllPayrolls();
            this.handleSuccess(res, 200, results);
        } catch (error) {
            console.error('Error retrieving all payroll records:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve a payroll record by ID
    findById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const result = await EmployeePayrollService.findPayrollById(id);
            if (!result) {
                throw new NotFoundError('Payroll record not found');
            }

            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error finding payroll record by ID:', error);
            this.handleError(res, error);
        }
    }

    // Update a payroll record by ID
    update = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await EmployeePayrollService.updatePayroll(id, req.body);
            if (!result) {
                throw new NotFoundError('Payroll record not found');
            }

            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error updating payroll record:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve payroll records by company
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;

            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const result = await EmployeePayrollService.findByCompany(companyId);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error finding payroll records by company:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve a payroll record by ID (alternative method name)
    find = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const result = await EmployeePayrollService.findPayrollById(id);
            if (!result) {
                throw new NotFoundError('Payroll record not found');
            }

            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error finding payroll record:', error);
            this.handleError(res, error);
        }
    }

    // Delete a payroll record by ID
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await EmployeePayrollService.deletePayroll(id);
            this.handleSuccess(res, 200, { message: 'Record deleted successfully' });
        } catch (error) {
            console.error('Error deleting payroll record:', error);
            this.handleError(res, error);
        }
    }
}

export default new EmployeePayrollController();