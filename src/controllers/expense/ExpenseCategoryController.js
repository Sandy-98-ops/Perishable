import BaseController from '../../base/BaseController.js';
import ExpenseCategoryService from '../../services/expense/ExpenseCategoryService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class ExpenseCategoryController extends BaseController {
    constructor() {
        super(ExpenseCategoryService);
    }

    // Fetch all categories for a specific company
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;

            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const categories = await ExpenseCategoryService.findCategoriesByCompany(companyId);
            this.handleSuccess(res, 200, categories);
        } catch (error) {
            console.error('Error finding expense categories by company:', error);
            this.handleError(res, error);
        }
    }

    // Create a new expense category
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await ExpenseCategoryService.create(req.body);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating expense category:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve an expense category by its ID
    findById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const category = await ExpenseCategoryService.findById(id);
            if (!category) {
                throw new NotFoundError('Expense category not found');
            }

            this.handleSuccess(res, 200, category);
        } catch (error) {
            console.error('Error finding expense category by ID:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve all expense categories
    findAll = async (req, res) => {
        try {
            const categories = await ExpenseCategoryService.findAll();
            this.handleSuccess(res, 200, categories);
        } catch (error) {
            console.error('Error retrieving all expense categories:', error);
            this.handleError(res, error);
        }
    }

    // Update an expense category by its ID
    update = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await ExpenseCategoryService.update(id, req.body);
            if (!result) {
                throw new NotFoundError('Expense category not found');
            }

            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error updating expense category:', error);
            this.handleError(res, error);
        }
    }

    // Delete an expense category by its ID
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await ExpenseCategoryService.delete(id);
            this.handleSuccess(res, 200, { message: 'Expense category deleted successfully' });
        } catch (error) {
            console.error('Error deleting expense category:', error);
            this.handleError(res, error);
        }
    }
}

export default new ExpenseCategoryController();