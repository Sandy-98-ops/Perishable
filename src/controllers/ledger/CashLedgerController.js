import BaseController from '../../base/BaseController.js';
import CashLedgerService from '../../services/ledger/CashLedgerService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class CashLedgerController extends BaseController {
    constructor() {
        super(CashLedgerService);
    }

    // Create a new cash ledger entry
    create = async (req, res) => {
        try {
            const data = req.body;

            // Validate the input data
            if (!data || Object.keys(data).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            // Create the cash ledger entry
            const result = await CashLedgerService.createCashLedger(data);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating cash ledger:', error);
            this.handleError(res, error);
        }
    };

    // Find cash ledger entries by company ID
    findByCompany = async (req, res) => {
        try {
            const companyId = req.params.company_id;

            // Validate the company ID
            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            // Fetch cash ledger entries for the specified company
            const ledgers = await CashLedgerService.findAll({ company_id: companyId });
            this.handleSuccess(res, 200, ledgers);
        } catch (error) {
            console.error('Error finding cash ledgers by company:', error);
            this.handleError(res, error);
        }
    };

    // Find all cash ledger entries
    findAll = async (req, res) => {
        try {
            const query = req.query;
            const ledgers = await CashLedgerService.findAll(query);
            this.handleSuccess(res, 200, ledgers);
        } catch (error) {
            console.error('Error finding cash ledgers:', error);
            this.handleError(res, error);
        }
    };

    // Find a single cash ledger entry by its ID
    findById = async (req, res) => {
        try {
            const { id } = req.params;

            // Validate the ID
            if (!id) {
                throw new BadRequestError('Ledger ID is required');
            }

            // Fetch the cash ledger entry by ID
            const ledger = await CashLedgerService.findById(id);
            if (!ledger) {
                throw new NotFoundError('Cash ledger not found');
            }

            this.handleSuccess(res, 200, ledger);
        } catch (error) {
            console.error('Error finding cash ledger by ID:', error);
            this.handleError(res, error);
        }
    };

    // Update a cash ledger entry by its ID
    update = async (req, res) => {
        try {
            const { id } = req.params;

            // Validate the ID and request body
            if (!id) {
                throw new BadRequestError('Ledger ID is required');
            }
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            // Update the cash ledger entry
            const updatedLedger = await CashLedgerService.update(id, req.body);
            if (!updatedLedger) {
                throw new NotFoundError('Cash ledger not found');
            }

            this.handleSuccess(res, 200, updatedLedger);
        } catch (error) {
            console.error('Error updating cash ledger:', error);
            this.handleError(res, error);
        }
    };

    // Delete a cash ledger entry by ID
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            // Validate the ID
            if (!id) {
                throw new BadRequestError('Ledger ID is required');
            }

            // Delete the cash ledger entry
            await CashLedgerService.delete(id);
            this.handleSuccess(res, 200, { message: 'Cash ledger deleted successfully' });
        } catch (error) {
            console.error('Error deleting cash ledger:', error);
            this.handleError(res, error);
        }
    };
}

export default new CashLedgerController();