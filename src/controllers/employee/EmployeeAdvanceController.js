import BaseController from "../base/BaseController.js";
import employeeAdvanceService from '../../services/employee/employeeAdvanceService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class EmployeeAdvanceController extends BaseController {
    // Create method
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const advanceDetails = await employeeAdvanceService.create(req.body);
            this.handleSuccess(res, 201, advanceDetails);
        } catch (error) {
            console.error('Error creating employee advance:', error);
            this.handleError(res, error);
        }
    };

    // Find by company method
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;
            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const employeeAdvances = await employeeAdvanceService.findByCompany(companyId);
            this.handleSuccess(res, 200, employeeAdvances);
        } catch (error) {
            console.error('Error finding employee advances by company:', error);
            this.handleError(res, error);
        }
    };

    // Find all method
    findAll = async (req, res) => {
        try {
            const advances = await employeeAdvanceService.findAll();
            this.handleSuccess(res, 200, advances);
        } catch (error) {
            console.error('Error retrieving all employee advances:', error);
            this.handleError(res, error);
        }
    };

    // Find by ID method
    findById = async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const advance = await employeeAdvanceService.findById(id);
            if (!advance) {
                throw new NotFoundError('Employee advance not found');
            }

            this.handleSuccess(res, 200, advance);
        } catch (error) {
            console.error('Error finding employee advance by ID:', error);
            this.handleError(res, error);
        }
    };

    // Delete method
    delete = async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await employeeAdvanceService.delete(id);
            this.handleSuccess(res, 204, { message: 'Employee advance deleted successfully' });
        } catch (error) {
            console.error('Error deleting employee advance:', error);
            this.handleError(res, error);
        }
    };

    // Update method
    update = async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestError('ID is required');
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const updatedAdvance = await employeeAdvanceService.update(id, req.body);
            if (!updatedAdvance) {
                throw new NotFoundError('Employee advance not found');
            }

            this.handleSuccess(res, 200, updatedAdvance);
        } catch (error) {
            console.error('Error updating employee advance:', error);
            this.handleError(res, error);
        }
    };
}

export default new EmployeeAdvanceController();