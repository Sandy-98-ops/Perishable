import { NotFoundError, BadRequestError, ValidationError } from '../utils/errors.js';
import { withTransaction } from '../utils/transactionHelper.js';

class BaseService {
    constructor(model) {
        this.model = model;
    }

    // Create method with transaction support
    create = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            return await this.model.create(data, { transaction });
        });
    }

    // Find by ID
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

    // Find all or by query
    findAll = async (query = {}) => {
        return this.model.findAll({ where: query });
    }

    // Update method with transaction support
    update = async (id, data) => {
        if (!id || !data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid ID or data provided');
        }

        return withTransaction(async (transaction) => {
            const [affectedRows] = await this.model.update(data, {
                where: { id },
                transaction
            });

            if (affectedRows === 0) {
                throw new NotFoundError('Document not found');
            }

            return { message: 'Document updated successfully' };
        });
    }

    // Delete method with transaction support
    delete = async (id) => {
        if (!id) {
            throw new BadRequestError('Invalid ID provided');
        }

        return withTransaction(async (transaction) => {
            const deletedRows = await this.model.destroy({
                where: { id },
                transaction
            });

            if (deletedRows === 0) {
                throw new NotFoundError('Document not found');
            }

            return deletedRows;
        });
    }
}

export default BaseService;