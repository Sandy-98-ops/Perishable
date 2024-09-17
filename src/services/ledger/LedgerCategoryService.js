import BaseService from '../base/BaseService.js';
import LedgerCategory from "../../models/ledger/LedgerCategories.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";

class LedgerCategoryService extends BaseService {
    constructor() {
        super(LedgerCategory);
    }

    // Override the create method to include transaction support
    create = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            return await this.model.create(data, { transaction });
        });
    }

    // Override the findById method to include additional error handling
    findById = async (id) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        const document = await this.model.findOne({ where: { id } });
        if (!document) {
            throw new NotFoundError('Document not found');
        }

        return document;
    }

    // Add other service methods if needed
}

export default new LedgerCategoryService();