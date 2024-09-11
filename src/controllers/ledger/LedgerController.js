import BaseController from "../../base/BaseController.js";
import LedgerService from "../../services/ledger/LedgerService.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";

class LedgerController extends BaseController {
    constructor() {
        super(LedgerService);
    }

    // Create a new ledger entry
    async create(req, res) {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const ledger = await LedgerService.create(req.body);
            this.handleSuccess(res, 201, { message: 'Ledger record created successfully', data: ledger });
        } catch (error) {
            console.error('Error creating ledger record:', error);
            this.handleError(res, error);
        }
    }

    // Find ledger records by party
    async findLedgerByParty(req, res) {
        try {
            const { party } = req.params;

            if (!party) {
                throw new BadRequestError('Party is required');
            }

            const ledgers = await LedgerService.findLedgerByParty(party);
            if (!ledgers || ledgers.length === 0) {
                throw new NotFoundError('No ledger records found for the specified party');
            }

            this.handleSuccess(res, 200, ledgers);
        } catch (error) {
            console.error('Error finding ledger records by party:', error);
            this.handleError(res, error);
        }
    }

    // Find a ledger record by ID
    async findById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const ledger = await LedgerService.findById(id);
            if (!ledger) {
                throw new NotFoundError('Ledger record not found');
            }

            this.handleSuccess(res, 200, ledger);
        } catch (error) {
            console.error('Error finding ledger record by ID:', error);
            this.handleError(res, error);
        }
    }

    // Find all ledger records with optional query parameters
    async findAll(req, res) {
        try {
            const query = req.query; // Get query parameters from the request
            const ledgers = await LedgerService.findAll(query);

            if (!ledgers || ledgers.length === 0) {
                throw new NotFoundError('No ledger records found');
            }

            this.handleSuccess(res, 200, ledgers);
        } catch (error) {
            console.error('Error finding ledger records:', error);
            this.handleError(res, error);
        }
    }

    // Update a ledger record by ID
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id || !data || Object.keys(data).length === 0) {
                throw new BadRequestError('ID and data are required');
            }

            const updatedLedger = await LedgerService.update(id, data);
            if (!updatedLedger) {
                throw new NotFoundError('Ledger record not found');
            }

            this.handleSuccess(res, 200, { message: 'Ledger record updated successfully', data: updatedLedger });
        } catch (error) {
            console.error('Error updating ledger record:', error);
            this.handleError(res, error);
        }
    }

    // Delete a ledger record by ID
    async delete(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const deleted = await LedgerService.delete(id);
            if (!deleted) {
                throw new NotFoundError('Ledger record not found');
            }

            this.handleSuccess(res, 200, { message: 'Ledger record deleted successfully' });
        } catch (error) {
            console.error('Error deleting ledger record:', error);
            this.handleError(res, error);
        }
    }
}

export default new LedgerController();