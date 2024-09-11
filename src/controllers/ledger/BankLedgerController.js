import BaseController from "../../base/BaseController";
import BankLedgerService from "../../services/ledger/BankLedgerService";
import { BadRequestError } from "../../utils/errors";

class BankLedgerController extends BaseController {
    constructor() {
        super(BankLedgerService);
    }

    // Create method
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const result = await BankLedgerService.create(req.body);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating bank ledger:', error);
            this.handleError(res, error);
        }
    };

    // Overridden methods from BaseController
    findById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await BankLedgerService.findById(id);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error finding bank ledger by ID:', error);
            this.handleError(res, error);
        }
    }

    findAll = async (req, res) => {
        try {
            const query = req.query;
            const result = await BankLedgerService.findAll(query);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error finding bank ledgers:', error);
            this.handleError(res, error);
        }
    }

    update = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await BankLedgerService.update(id, data);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error updating bank ledger:', error);
            this.handleError(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await BankLedgerService.delete(id);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error deleting bank ledger:', error);
            this.handleError(res, error);
        }
    }
}

export default new BankLedgerController();