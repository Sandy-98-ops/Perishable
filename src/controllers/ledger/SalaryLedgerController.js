import BaseController from "../../base/BaseController.js";
import SalaryLedgerService from "../../services/ledger/SalaryLedgerService.js";
import { BadRequestError } from "../../utils/errors.js";

class SalaryLedgerController extends BaseController {
    constructor() {
        super(SalaryLedgerService);
    }

    // Create a new salary ledger entry
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const document = await SalaryLedgerService.createSalaryLedger(req.body);

            this.handleSuccess(res, 201, document);

        } catch (error) {
            console.error('Error creating salary ledger:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve a SalaryLedger entry by ID
    findById = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const document = await SalaryLedgerService.findById(id);

            this.handleSuccess(res, 200, document);

        } catch (error) {
            console.error('Error finding salary ledger by ID:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve all SalaryLedger entries
    findAll = async (req, res) => {
        try {
            const query = req.query || {};

            const documents = await SalaryLedgerService.findAll(query);

            this.handleSuccess(res, 200, documents);

        } catch (error) {
            console.error('Error finding all salary ledgers:', error);
            this.handleError(res, error);
        }
    }

    // Update a SalaryLedger entry by ID
    update = async (req, res) => {
        try {
            const id = req.params.id;
            const data = req.body;

            if (!id || !data || Object.keys(data).length === 0) {
                throw new BadRequestError('ID and data are required');
            }

            const result = await SalaryLedgerService.update(id, data);

            this.handleSuccess(res, 200, result);

        } catch (error) {
            console.error('Error updating salary ledger:', error);
            this.handleError(res, error);
        }
    }

    // Delete a SalaryLedger entry by ID
    delete = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await SalaryLedgerService.delete(id);

            this.handleSuccess(res, 200, { message: 'Salary ledger deleted successfully' });

        } catch (error) {
            console.error('Error deleting salary ledger:', error);
            this.handleError(res, error);
        }
    }
}

export default new SalaryLedgerController();