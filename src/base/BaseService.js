import { NotFoundError, BadRequestError, ValidationError } from '../utils/errors.js';
import { withTransaction } from '../utils/transactionHelper.js';

class BaseService {
    constructor(model, primaryKey = 'id') {
        this.model = model;
        this.primaryKey = primaryKey;
    }

    // Create method with transaction support
    create = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        try {
            return await withTransaction(async (transaction) => {
                return await this.model.create(data, { transaction });
            });
        } catch (error) {
            throw new ValidationError('Failed to create document', error);
        }
    }

    // Find by ID
    findById = async (id) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        try {
            const document = await this.model.findByPk(id); // Use findByPk instead of findById
            if (!document) {
                throw new NotFoundError('Document not found');
            }

            return document;
        } catch (error) {
            throw new ValidationError('Failed to retrieve document', error);
        }
    }

    // Find one document based on a query
    findOne = async (query) => {
        if (!query || Object.keys(query).length === 0) {
            throw new BadRequestError('Query object is required');
        }

        try {
            const document = await this.model.findOne({ where: query });
            if (!document) {
                throw new NotFoundError('Document not found');
            }

            return document;
        } catch (error) {
            throw new ValidationError('Failed to retrieve document', error);
        }
    }

    // Find all or by query
    findAll = async (query = {}) => {
        try {
            return await this.model.findAll({ where: query });
        } catch (error) {
            throw new ValidationError('Failed to retrieve documents', error);
        }
    }

    // Update method with transaction support
    update = async (id, data) => {
        if (!id || !data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid ID or data provided');
        }

        try {
            return await withTransaction(async (transaction) => {
                const [affectedRows] = await this.model.update(data, {
                    where: { [this.primaryKey]: id },
                    transaction
                });

                if (affectedRows === 0) {
                    throw new NotFoundError('Document not found');
                }

                return { message: 'Document updated successfully' };
            });
        } catch (error) {
            throw new ValidationError('Failed to update document', error);
        }
    }

    // Delete method with transaction support
    delete = async (id) => {
        if (!id) {
            throw new BadRequestError('Invalid ID provided');
        }

        try {
            return await withTransaction(async (transaction) => {
                const deletedRows = await this.model.destroy({
                    where: { [this.primaryKey]: id },
                    transaction
                });

                if (deletedRows === 0) {
                    throw new NotFoundError('Document not found');
                }

                return deletedRows;
            });
        } catch (error) {
            throw new ValidationError('Failed to delete document', error);
        }
    }
}

export default BaseService;