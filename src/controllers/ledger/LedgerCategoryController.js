import BaseController from "../base/BaseController.js";
import LedgerCategoryService from "../../services/ledger/LedgerCategoryService.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

class LedgerCategoryController extends BaseController {
    constructor() {
        super(LedgerCategoryService);
    }

    // Find ledger categories by company
    async findByCompany(req, res) {
        try {
            const companyId = req.params.company_id;

            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const ledgerCategories = await LedgerCategoryService.findAll({ company: companyId });
            this.handleSuccess(res, 200, ledgerCategories);
        } catch (error) {
            console.error('Error finding ledger categories by company:', error);
            this.handleError(res, error);
        }
    }

    // Create a new ledger category
    async create(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await LedgerCategoryService.create(req.body);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating ledger category:', error);
            this.handleError(res, error);
        }
    }

    // Find all ledger categories
    async findAll(req, res) {
        try {
            const query = req.query;
            const ledgerCategories = await LedgerCategoryService.findAll(query);

            if (!ledgerCategories || ledgerCategories.length === 0) {
                throw new NotFoundError('No ledger categories found');
            }

            this.handleSuccess(res, 200, ledgerCategories);
        } catch (error) {
            console.error('Error finding ledger categories:', error);
            this.handleError(res, error);
        }
    }

    // Find a ledger category by ID
    async findById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const category = await LedgerCategoryService.findById(id);
            if (!category) {
                throw new NotFoundError('Ledger category not found');
            }

            this.handleSuccess(res, 200, category);
        } catch (error) {
            console.error('Error finding ledger category by ID:', error);
            this.handleError(res, error);
        }
    }

    // Update a ledger category by ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id || !data || Object.keys(data).length === 0) {
                throw new BadRequestError('Invalid ID or data provided');
            }

            const result = await LedgerCategoryService.update(id, data);
            if (!result) {
                throw new NotFoundError('Ledger category not found');
            }

            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error updating ledger category:', error);
            this.handleError(res, error);
        }
    }

    // Delete a ledger category by ID
    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const deleted = await LedgerCategoryService.delete(id);
            if (!deleted) {
                throw new NotFoundError('Ledger category not found');
            }

            this.handleSuccess(res, 200, { message: 'Ledger category deleted successfully' });
        } catch (error) {
            console.error('Error deleting ledger category:', error);
            this.handleError(res, error);
        }
    }
}

export default new LedgerCategoryController();