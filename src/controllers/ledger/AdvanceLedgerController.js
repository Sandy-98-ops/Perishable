import BaseController from "../base/BaseController.js";
import AdvanceLedgerService from '../../services/ledger/AdvanceLedgerService.js';

class AdvanceLedgerController extends BaseController {
    constructor() {
        super(AdvanceLedgerService);
    }

    // Create method
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: 'Invalid data provided' });
            }

            const result = await AdvanceLedgerService.createAdvanceLedger(req.body);
            this.handleSuccess(res, 201, result);
        } catch (error) {
            console.error('Error creating advance ledger:', error);
            this.handleError(res, error);
        }
    };

    // Overridden methods from BaseController
    findById = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await AdvanceLedgerService.findById(id);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error finding advance ledger by ID:', error);
            this.handleError(res, error);
        }
    }

    findAll = async (req, res) => {
        try {
            const query = req.query;
            const result = await AdvanceLedgerService.findAll(query);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error finding advance ledgers:', error);
            this.handleError(res, error);
        }
    }

    update = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await AdvanceLedgerService.update(id, data);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error updating advance ledger:', error);
            this.handleError(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            const result = await AdvanceLedgerService.delete(id);
            this.handleSuccess(res, 200, result);
        } catch (error) {
            console.error('Error deleting advance ledger:', error);
            this.handleError(res, error);
        }
    }
}

export default new AdvanceLedgerController();