import mongoose from 'mongoose';
import { hashPassword } from '../services/encryptionService.js';
import { ValidationError, NotFoundError, BadRequestError, InternalServerError } from '../utils/errors.js';
import { validateData, validatePassword, validatePhoneNumber, generateFieldLabel } from '../utils/validateModels.js';

class BaseModel {
    constructor(modelName, schemaDefinition, options = {}) {
        // Define schema with options
        this.schema = new mongoose.Schema(schemaDefinition, {
            timestamps: true,
            ...options.schemaOptions,
        });

        // Create Mongoose model
        this.model = mongoose.models[modelName] || mongoose.model(modelName, this.schema);
    }

    // Check if a field value is unique
    async isUnique(field, value) {
        try {
            const existing = await this.model.findOne({ [field]: value }).exec();
            return !existing;
        } catch (error) {
            throw new InternalServerError(`Error checking uniqueness of ${generateFieldLabel(field)}: ${error.message}`);
        }
    }

    // Validate data against schema
    async validate(data) {
        try {
            const validationErrors = await validateData(this.schema.obj, data, this.isUnique.bind(this));

            if (validationErrors.length) {
                const formattedErrors = validationErrors.map(err => err);
                throw new ValidationError(`Validation failed: ${formattedErrors.join(', ')}`);
            }
        } catch (error) {
            if (error instanceof ValidationError) {
                throw error;
            }
            throw new InternalServerError(`Error during validation: ${error.message}`);
        }
    }

    async preprocessData(data) {
        if (data.password) {
            validatePassword(data.password);
            data.password = await hashPassword(data.password);
        }
        if (data.phoneNo) {
            validatePhoneNumber(data.phoneNo);
        }
        // Additional preprocessing can be added here
        return data;
    }

    // Create a new document
    // Create a new document
    async create(data) {
        try {
            // Validate the data before creating the document
            await this.validate(data);
            // Preprocess the data before creating the document
            await this.preprocessData(data);
            // Create the document
            await this.model.create(data);
            return { message: 'Document created successfully' };
        } catch (error) {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const duplicateKeys = Object.keys(error.keyPattern); // Extract all fields causing the duplicate key error
                const messages = duplicateKeys.map(key => `${generateFieldLabel(key)}`).join(' with ');
                throw new ValidationError(`Validation failed: ${messages} already exists`);
            }

            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof BadRequestError) {
                throw error;
            }

            throw new InternalServerError(`Error creating document: ${error.message}`);
        }
    }


    // Find documents with query and pagination
    async find(query = {}, options = {}) {
        try {
            const { limit = 25, skip = 0 } = options;
            const documents = await this.model.find(query).limit(limit).skip(skip).exec();
            return documents;
        } catch (error) {
            throw new InternalServerError(`Error finding documents: ${error.message}`);
        }
    }

    // Find a single document by query
    async findOne(query) {
        try {
            const document = await this.model.findOne(query).exec();
            return document; // Return null if not found
        } catch (error) {
            throw new InternalServerError(`Error finding document: ${error.message}`);
        }
    }

    // Find a document by ID
    async findById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new BadRequestError('Invalid ID format');
            }
            const document = await this.model.findById(id).exec();
            return document; // Return null if not found
        } catch (error) {
            if (error instanceof BadRequestError) {
                throw error;
            }
            throw new InternalServerError(`Error finding document by ID: ${error.message}`);
        }
    }

    // Update a document by ID
    async update(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new BadRequestError('Invalid ID format');
            }

            // Preprocess data before updating
            const processedUpdateData = await this.preprocessData(updateData);

            // Attempt to update the document
            const updatedDocument = await this.model.findByIdAndUpdate(id, processedUpdateData, { new: true, runValidators: true }).exec();

            if (!updatedDocument) {
                throw new NotFoundError('Document not found');
            }

            return { message: 'Document updated successfully' };
        } catch (error) {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                const duplicateKeys = Object.keys(error.keyPattern); // Extract all fields causing the duplicate key error
                const messages = duplicateKeys.map(key => `${generateFieldLabel(key)}`).join(' with ');
                throw new ValidationError(`Validation failed: ${messages} already exists`);
            }
            // Handle other specific errors
            if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof BadRequestError) {
                throw error;
            }
            // General error handling
            throw new InternalServerError(`Error updating document: ${error.message}`);
        }
    }


    // Delete a document by ID
    async delete(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new BadRequestError('Invalid ID format');
            }
            const result = await this.model.findByIdAndDelete(id).exec();

            if (!result) {
                throw new NotFoundError('Document not found');
            }

            return { message: 'Document deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof BadRequestError) {
                throw error;
            }
            throw new InternalServerError(`Error deleting document: ${error.message}`);
        }
    }
}

export default BaseModel;
