import BaseController from "../base/BaseController.js";
import LedgerMasterService from "../../services/ledger/LedgerMasterService.js";
import { BadRequestError } from "../../utils/errors.js";

class LedgerMasterController extends BaseController {
    constructor() {
        super(LedgerMasterService);
    }

    // Create a new LedgerMaster entry
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const document = await LedgerMasterService.createLedgerMasterWithLedger(req.body);

            this.handleSuccess(res, 201, document);

        } catch (error) {
            console.error('Error creating ledger master:', error);
            this.handleError(res, error);
        }
    }


    // Retrieve a LedgerMaster entry by ID
    findById = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            const document = await LedgerMasterService.findById(id);

            this.handleSuccess(res, 200, document);

        } catch (error) {
            console.error('Error finding ledger master by ID:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve all LedgerMaster entries
    findAll = async (req, res) => {
        try {
            const query = req.query || {};

            const documents = await LedgerMasterService.findAll(query);

            this.handleSuccess(res, 200, documents);

        } catch (error) {
            console.error('Error finding all ledger masters:', error);
            this.handleError(res, error);
        }
    }

    // Update a LedgerMaster entry by ID
    update = async (req, res) => {
        try {
            const result = await LedgerMasterService.update(req.params.id, req.body);

            this.handleSuccess(res, 200, result);

        } catch (error) {
            console.error('Error updating ledger master:', error);
            this.handleError(res, error);
        }
    }

    // Delete a LedgerMaster entry by ID
    delete = async (req, res) => {
        try {
            const id = req.params.id;

            if (!id) {
                throw new BadRequestError('ID is required');
            }

            await LedgerMasterService.delete(id);

            this.handleSuccess(res, 200, { message: 'Ledger master deleted successfully' });

        } catch (error) {
            console.error('Error deleting ledger master:', error);
            this.handleError(res, error);
        }
    }

    findByCompanyId = async (req, res) => {
        try {
            this.handleSuccess(res, 200, await LedgerMasterService.findByCompanyId(req.params.company_id));
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

export default new LedgerMasterController();