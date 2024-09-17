import BaseController from "../base/BaseController.js";
import ExpenseEntryService from '../../services/expense/ExpenseEntryService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class ExpenseEntryController extends BaseController {
    constructor() {
        super(ExpenseEntryService);
    }

    // Create a new expense entry
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await ExpenseEntryService.createExpenseEntry(req.body);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating expense entry:', error);
            this.handleError(res, error);
        }
    };

    // Retrieve all expense entries
    findAll = async (req, res) => {
        try {
            const entries = await ExpenseEntryService.findAll();
            this.handleSuccess(res, 200, entries);
        } catch (error) {
            console.error('Error retrieving all expense entries:', error);
            this.handleError(res, error);
        }
    };

    // Retrieve an expense entry by its ID
    findById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const entry = await ExpenseEntryService.findById(id);
            if (!entry) {
                throw new NotFoundError('Expense entry not found');
            }

            this.handleSuccess(res, 200, entry);
        } catch (error) {
            console.error('Error finding expense entry by ID:', error);
            this.handleError(res, error);
        }
    };

    // Retrieve expense entries by company
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;

            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const entries = await ExpenseEntryService.findEntriesByCompany(companyId);
            this.handleSuccess(res, 200, entries);
        } catch (error) {
            console.error('Error finding expense entries by company:', error);
            this.handleError(res, error);
        }
    };

    // Update an expense entry by its ID
    update = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await ExpenseEntryService.updateExpenseEntry(id, req.body);
            if (!result) {
                throw new NotFoundError('Expense entry not found');
            }

            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error updating expense entry:', error);
            this.handleError(res, error);
        }
    };

    // Delete an expense entry by its ID
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await ExpenseEntryService.delete(id);
            this.handleSuccess(res, 200, { message: 'Expense entry deleted successfully' });
        } catch (error) {
            console.error('Error deleting expense entry:', error);
            this.handleError(res, error);
        }
    };
}

export default new ExpenseEntryController();