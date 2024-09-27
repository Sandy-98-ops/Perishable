import { NotFoundError, BadRequestError, ValidationError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import { getCurrentUser } from '../../utils/context.js';

class BaseService {
    constructor(model, primaryKey = 'id') {
        this.model = model;
        this.primaryKey = primaryKey;
    }

    // Helper method to get current user data
    getCurrentUserData() {
        const currentUser = getCurrentUser();

        return {
            companyId: currentUser.company_id,
            userId: currentUser.id,
        };
    }

    // Create method with optional company_id
    create = async (data, transaction, includeCompanyId = true) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        const { userId } = this.getCurrentUserData();
        const companyId = includeCompanyId ? this.getCurrentUserData().companyId : undefined;

        try {
            const options = {
                transaction: transaction || undefined,
                ...(!transaction && { transaction: await withTransaction() })
            };
            return await this.model.create({
                ...data,
                ...(includeCompanyId && { company_id: companyId }),
                created_by: userId
            }, options);
        } catch (error) {
            throw new ValidationError(`Failed to create document: ${error.message}`);
        }
    }

    // Find by ID with optional company_id
    findById = async (id, includeCompanyId = true) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        const { companyId } = includeCompanyId ? this.getCurrentUserData() : { companyId: undefined };

        try {
            const document = await this.model.findOne({
                where: {
                    [this.primaryKey]: id,
                    ...(includeCompanyId && { company_id: companyId })
                }
            });

            return document;
        } catch (error) {
            throw new ValidationError(`Failed to retrieve document: ${error.message}`);
        }
    }

    // Find one document with optional company_id
    findOne = async (query, order = [], includeCompanyId = true) => {
        if (!query || Object.keys(query).length === 0) {
            throw new BadRequestError('Query object is required');
        }

        if (includeCompanyId) {
            const { companyId } = this.getCurrentUserData();
            query.company_id = companyId;
        }

        try {
            const document = await this.model.findOne({ where: query, order });

            return document;
        } catch (error) {
            throw new ValidationError(`Failed to retrieve document: ${error.message}`);
        }
    }

    // Find all documents with optional company_id
    findAll = async (query = {}, includeCompanyId = true) => {
        if (includeCompanyId) {
            const { companyId } = this.getCurrentUserData();
            query.company_id = companyId;
        }

        try {
            return await this.model.findAll({ where: query });
        } catch (error) {
            throw new ValidationError(`Failed to retrieve documents: ${error.message}`);
        }
    }

    // Update method with optional company_id
    update = async (id, data, transaction, includeCompanyId = true) => {
        if (!id || !data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid ID or data provided');
        }

        const { userId } = this.getCurrentUserData();
        const companyId = includeCompanyId ? this.getCurrentUserData().companyId : undefined;

        try {
            const updatedData = {
                ...data,
                ...(includeCompanyId && { updated_by: userId }), // Include updated_by field
            };

            const options = {
                ...(transaction && { transaction }) // Only include transaction if it's provided
            };

            const [affectedRows] = await this.model.update(updatedData, {
                where: {
                    [this.primaryKey]: id,
                    ...(includeCompanyId && { company_id: companyId }),
                },
                ...options,
            });

            if (affectedRows === 0) {
                throw new NotFoundError('Document not found or no changes made');
            }

            return { message: 'Document updated successfully' };
        } catch (error) {
            console.error(`Update failed for ID ${id}: ${error.message}`);
            throw new ValidationError(`Failed to update document: ${error.message}`);
        }
    }

    // Delete method with optional company_id
    delete = async (id, transaction, includeCompanyId = true) => {
        if (!id) {
            throw new BadRequestError('Invalid ID provided');
        }

        const { companyId } = includeCompanyId ? this.getCurrentUserData() : { companyId: undefined };

        try {
            const options = { transaction: transaction || undefined };
            const deletedRows = await this.model.destroy({
                where: {
                    [this.primaryKey]: id,
                    ...(includeCompanyId && { company_id: companyId }),
                },
                ...options,
            });

            if (deletedRows === 0) {
                throw new NotFoundError('Document not found');
            }

            return deletedRows;
        } catch (error) {
            throw new ValidationError(`Failed to delete document: ${error.message}`);
        }
    }
}

export default BaseService;