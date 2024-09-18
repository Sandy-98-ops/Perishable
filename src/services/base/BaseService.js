import { NotFoundError, BadRequestError, ValidationError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';

class BaseService {
    constructor(model, primaryKey = 'id') {
        this.model = model;
        this.primaryKey = primaryKey;
    }

    // Create method with transaction support
    create = async (data, transaction) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        // Optionally include created_by if userId is provided
        // const dataWithUser = { ...data, created_by: userId == undefined ? null : userId };

        try {
            // Use the provided transaction or create a new one
            if (!transaction) {
                return await withTransaction(async (t) => {
                    return await this.model.create(data, { t });
                });
            } else {
                return await this.model.create(data, { transaction });
            }
        } catch (error) {
            throw new ValidationError(`Failed to create document: ${error.message}`);
        }
    }

    // Find by ID
    findById = async (id) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        try {
            const document = await this.model.findByPk(id);
            return document;
        } catch (error) {
            throw new ValidationError(`Failed to retrieve document: ${error.message}`);
        }
    }

    // Find one document based on a query
    findOne = async (query) => {
        if (!query || Object.keys(query).length === 0) {
            throw new BadRequestError('Query object is required');
        }

        try {
            const document = await this.model.findOne({ where: query });
            return document;
        } catch (error) {
            throw new ValidationError(`Failed to retrieve document: ${error.message}`);
        }
    }

    // Find all or by query
    findAll = async (query = {}) => {
        try {
            return await this.model.findAll({ where: query });
        } catch (error) {
            throw new ValidationError(`Failed to retrieve documents: ${error.message}`);
        }
    }

    // Update method with transaction support
    update = async (id, data, transaction) => {
        if (!id || !data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid ID or data provided');
        }

        // Optionally include updated_by if userId is provided
        // const dataWithUser = { ...data, updated_by: userId };

        try {
            // Use the provided transaction or create a new one
            if (!transaction) {
                return await withTransaction(async (t) => {
                    const [affectedRows] = await this.model.update(data, {
                        where: { [this.primaryKey]: id },
                        t
                    });

                    if (affectedRows === 0) {
                        throw new NotFoundError('Document not found');
                    }

                    return { message: 'Document updated successfully' };
                });
            } else {
                const [affectedRows] = await this.model.update(data, {
                    where: { [this.primaryKey]: id },
                    transaction
                });

                if (affectedRows === 0) {
                    throw new NotFoundError('Document not found');
                }

                return { message: 'Document updated successfully' };
            }
        } catch (error) {
            throw new ValidationError(`Failed to update document: ${error.message}`);
        }
    }

    // Delete method with transaction support
    delete = async (id, transaction) => {
        if (!id) {
            throw new BadRequestError('Invalid ID provided');
        }

        try {
            // Use the provided transaction or create a new one
            if (!transaction) {
                return await withTransaction(async (t) => {
                    const deletedRows = await this.model.destroy({
                        where: { [this.primaryKey]: id },
                        transaction: t
                    });

                    if (deletedRows === 0) {
                        throw new NotFoundError('Document not found');
                    }

                    return deletedRows;
                });
            } else {
                const deletedRows = await this.model.destroy({
                    where: { [this.primaryKey]: id },
                    transaction
                });

                if (deletedRows === 0) {
                    throw new NotFoundError('Document not found');
                }

                return deletedRows;
            }
        } catch (error) {
            throw new ValidationError(`Failed to delete document: ${error.message}`);
        }
    }
}

export default BaseService;