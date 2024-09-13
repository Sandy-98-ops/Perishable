import BaseController from '../../base/BaseController.js';
import ExpenseLedgerService from '../../services/ledger/ExpenseLedgerService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class ExpenseLedgerController extends BaseController {
    constructor() {
        super(ExpenseLedgerService);
    }

    // Create a new expense ledger entry
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await ExpenseLedgerService.create(req.body);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating expense ledger:', error);
            this.handleError(res, error);
        }
    };

    // Find expense ledger entries by company ID
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;

            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            const ledgers = await ExpenseLedgerService.findAll({ company_id: companyId });
            this.handleSuccess(res, 200, ledgers);
        } catch (error) {
            console.error('Error finding expense ledgers by company:', error);
            this.handleError(res, error);
        }
    };

    // Find a single expense ledger entry by ID
    findById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Ledger ID is required');
            }

            const ledger = await ExpenseLedgerService.findById(id);
            if (!ledger) {
                throw new NotFoundError('Expense ledger not found');
            }

            this.handleSuccess(res, 200, ledger);
        } catch (error) {
            console.error('Error finding expense ledger by ID:', error);
            this.handleError(res, error);
        }
    };

    // Find all expense ledger entries
    findAll = async (req, res) => {
        try {
            const query = req.query;
            const ledgers = await ExpenseLedgerService.findAll(query);

            if (!ledgers || ledgers.length === 0) {
                throw new NotFoundError('No expense ledgers found');
            }

            this.handleSuccess(res, 200, ledgers);
        } catch (error) {
            console.error('Error finding expense ledgers:', error);
            this.handleError(res, error);
        }
    };

    // Update an expense ledger entry by ID
    update = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Ledger ID is required');
            }

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const updatedLedger = await ExpenseLedgerService.updateExpenseLedger(id, req.body);
            if (!updatedLedger) {
                throw new NotFoundError('Expense ledger not found');
            }

            this.handleSuccess(res, 200, updatedLedger);
        } catch (error) {
            console.error('Error updating expense ledger:', error);
            this.handleError(res, error);
        }
    };

    // Delete an expense ledger entry by ID
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Ledger ID is required');
            }

            const deleted = await ExpenseLedgerService.delete(id);
            if (!deleted) {
                throw new NotFoundError('Expense ledger not found');
            }

            this.handleSuccess(res, 200, { message: 'Expense ledger deleted successfully' });
        } catch (error) {
            console.error('Error deleting expense ledger:', error);
            this.handleError(res, error);
        }
    };
}

export default new ExpenseLedgerController();