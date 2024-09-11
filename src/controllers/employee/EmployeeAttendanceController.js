import BaseController from '../../base/BaseController.js';
import EmployeeAttendanceService from '../../services/employee/EmployeeAttendanceService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class EmployeeAttendanceController extends BaseController {
    constructor() {
        super(EmployeeAttendanceService); // Initialize BaseController with EmployeeAttendanceService
    }

    // Find by company method
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;

            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const employeeAttendances = await EmployeeAttendanceService.findByCompany(companyId);
            this.handleSuccess(res, 200, employeeAttendances);
        } catch (error) {
            console.error('Error finding employee attendance by company_id:', error);
            this.handleError(res, error);
        }
    }

    // Create method
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const attendanceDetails = await EmployeeAttendanceService.create(req.body);
            this.handleSuccess(res, 201, attendanceDetails);
        } catch (error) {
            console.error('Error creating employee attendance:', error);
            this.handleError(res, error);
        }
    }

    // Find all method
    findAll = async (req, res) => {
        try {
            const attendances = await EmployeeAttendanceService.findAll();
            this.handleSuccess(res, 200, attendances);
        } catch (error) {
            console.error('Error retrieving all employee attendance records:', error);
            this.handleError(res, error);
        }
    }

    // Find by ID method
    findById = async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const attendance = await EmployeeAttendanceService.findById(id);
            if (!attendance) {
                throw new NotFoundError('Employee attendance not found');
            }

            this.handleSuccess(res, 200, attendance);
        } catch (error) {
            console.error('Error finding employee attendance by ID:', error);
            this.handleError(res, error);
        }
    }

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

            const updatedAttendance = await EmployeeAttendanceService.update(id, req.body);
            if (!updatedAttendance) {
                throw new NotFoundError('Employee attendance not found');
            }

            this.handleSuccess(res, 200, updatedAttendance);
        } catch (error) {
            console.error('Error updating employee attendance:', error);
            this.handleError(res, error);
        }
    }

    // Delete method
    delete = async (req, res) => {
        try {
            const id = req.params.id;
            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await EmployeeAttendanceService.delete(id);
            this.handleSuccess(res, 204, { message: 'Employee attendance deleted successfully' });
        } catch (error) {
            console.error('Error deleting employee attendance:', error);
            this.handleError(res, error);
        }
    }
}

export default new EmployeeAttendanceController();