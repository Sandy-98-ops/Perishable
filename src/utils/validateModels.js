import mongoose from 'mongoose';
import { ValidationError } from './errors.js'; // Import custom errors

// Helper function to convert camelCase to readable format
const convertCamelCaseToReadable = (camelCaseString) => {
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space between camelCase words
        .replace(/^./, str => str.toUpperCase());  // Capitalize the first letter
};

// Function to generate user-friendly labels for fields
export const generateFieldLabel = (path) => {
    let readablePath = convertCamelCaseToReadable(path);
    readablePath = readablePath.replace(/\./g, ' ');
    return readablePath;
};

const getSchemaFields = (schema) => {
    const fields = schema.obj || {};
    const fieldKeys = Object.keys(fields);

    const result = {};
    fieldKeys.forEach(key => {
        const field = fields[key];
        const options = field.options || {};  // Extract field options

        result[key] = {
            type: (field.type && typeof field.type.name === 'string') ? field.type.name.toLowerCase() : 'unknown',
            required: field.required !== undefined ? field.required : (options.required !== undefined ? options.required : false),
            unique: field.unique !== undefined ? field.unique : (options.unique !== undefined ? options.unique : false)
        };

        if (field instanceof mongoose.Schema) {
            result[key] = {
                type: 'object',
                schema: getSchemaFields(field)
            };
        } else if (Array.isArray(field.type)) {
            result[key] = {
                type: 'array',
                items: field.type[0] instanceof mongoose.Schema ? getSchemaFields(field.type[0]) : 'primitive'
            };
        } else if (typeof field.type === 'object' && field.type !== null) {
            result[key] = {
                type: 'object',
                schema: getSchemaFields(field.type)
            };
        }
    });

    return result;
};

// Recursive function to validate data against a schema
const validateDataRecursive = async (schemaFields, data, isUnique, path = '') => {
    const validationErrors = [];

    for (const key of Object.keys(schemaFields)) {
        const field = schemaFields[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (field.type === 'object') {
            if (typeof data[key] !== 'object' || data[key] === null) {
                validationErrors.push(`${generateFieldLabel(currentPath)} must be an object.`);
            } else {
                const nestedErrors = await validateDataRecursive(field.schema, data[key], isUnique, currentPath);
                validationErrors.push(...nestedErrors);
            }
        } else if (field.type === 'array') {
            if (!Array.isArray(data[key])) {
                validationErrors.push(`${generateFieldLabel(currentPath)} must be an array.`);
            } else if (field.items === 'object') {
                for (const item of data[key]) {
                    const nestedErrors = await validateDataRecursive(field.schema, item, isUnique, currentPath);
                    validationErrors.push(...nestedErrors);
                }
            }
        } else {
            if (field.required && (data[key] === undefined || data[key] === null || data[key] === "")) {
                validationErrors.push(`${generateFieldLabel(currentPath)} is required.`);
            }
            if (field.unique && data[key] !== undefined) {
                const isUniqueField = await isUnique(key, data[key]);
                if (!isUniqueField) {
                    validationErrors.push(`${generateFieldLabel(currentPath)} already exists.`);
                }
            }
        }
    }

    return validationErrors;
};

// Function to validate data
export const validateData = async (schema, data, isUnique) => {
    if (!schema || typeof schema !== 'object') {
        throw new ValidationError('Invalid schema format.');
    }

    const schemaFields = getSchemaFields(schema);
    const validationErrors = await validateDataRecursive(schemaFields, data, isUnique);

    return validationErrors; // Ensure an empty array is returned if no errors
};

// Validation functions for specific fields
export const validatePhoneNumber = (phoneNumber) => {
    phoneNumber = phoneNumber.toString();
    const phoneRegex = /^[6789]\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        throw new ValidationError('Invalid phone number format. Indian phone numbers should be exactly 10 digits long and start with 6, 7, 8, or 9.');
    }
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format.');
    }
};

export const validatePassword = (password) => {
    const validPasswordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!validPasswordRegex.test(password)) {
        throw new ValidationError('Password must be at least 8 characters long, include at least one uppercase letter, and one special character.');
    }
};

export const validatePostalCode = (postalCode) => {
    const postalCodeRegex = /^\d{6}$/;
    if (!postalCodeRegex.test(postalCode)) {
        throw new ValidationError('Invalid postal code format. Indian postal codes should be exactly 6 digits long.');
    }
};

export const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s-]+$/;
    if (!nameRegex.test(name)) {
        throw new ValidationError('Invalid name format. Names should only contain letters, spaces, and hyphens.');
    }
};

// Custom validation for specific ledger data
export const validateLedgerData = (ledgerData) => {
    for (const entry of ledgerData) {
        if (!entry.categoryId || typeof entry.categoryId !== 'string') {
            throw new ValidationError('Category ID is required and must be a string.');
        }

        if (!entry.date || isNaN(new Date(entry.date).getTime())) {
            throw new ValidationError('Date is required and must be a valid date.');
        }

        if (!entry.description || typeof entry.description !== 'string') {
            throw new ValidationError('Description is required and must be a string.');
        }

        if (!entry.transactionId || typeof entry.transactionId !== 'string') {
            throw new ValidationError('Transaction ID is required and must be a string.');
        }

        const validPaymentModes = ['Cash', 'Bank Transfer', 'Credit Card', 'Debit Card'];
        if (!validPaymentModes.includes(entry.paymentMode)) {
            throw new ValidationError('Payment mode is invalid.');
        }

        if (typeof entry.credit !== 'number' || entry.credit < 0) {
            throw new ValidationError('Credit must be a non-negative number.');
        }

        if (typeof entry.debit !== 'number' || entry.debit < 0) {
            throw new ValidationError('Debit must be a non-negative number.');
        }

        if (typeof entry.balance !== 'number') {
            throw new ValidationError('Balance must be a number.');
        }

        if (entry.metaData) {
            const metadataFields = ['invoiceNo', 'receiptNo', 'purchaseNo', 'paymentNo', 'creditNote', 'debitNote', 'saleReturn', 'purchaseReturn'];
            for (const field of metadataFields) {
                if (entry.metaData[field] && typeof entry.metaData[field] !== 'string') {
                    throw new ValidationError(`${generateFieldLabel('metaData.' + field)} must be a string.`);
                }
            }
        }
    }
};

// Example schema definition for Mongoose
const ledgerSchema = new mongoose.Schema({
    party: { type: mongoose.Schema.Types.ObjectId, required: true },
    ledgerData: [{
        categoryId: { type: String, required: true },
        date: { type: Date, required: true },
        description: { type: String, required: true },
        transactionId: { type: String, required: true },
        paymentMode: { type: String, required: true },
        credit: { type: Number, default: 0 },
        debit: { type: Number, default: 0 },
        balance: { type: Number, required: true },
        metaData: {
            invoiceNo: { type: String, default: '' },
            receiptNo: { type: String, default: '' },
            purchaseNo: { type: String, default: '' },
            paymentNo: { type: String, default: '' },
            creditNote: { type: String, default: '' },
            debitNote: { type: String, default: '' },
            saleReturn: { type: String, default: '' },
            purchaseReturn: { type: String, default: '' }
        }
    }]
});


/**
 * Validates if the given id is a valid MongoDB ObjectId.
 * @param {string} id - The id to validate.
 * @throws {BadRequestError} If the id is not valid.
 */
export function validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError('Invalid ID format');
    }
}

/**
 * Converts the given string to a MongoDB ObjectId.
 * @param {string} id - The id to convert.
 * @returns {mongoose.Types.ObjectId} The converted ObjectId.
 * @throws {BadRequestError} If the id is not valid.
 */
export function toObjectId(id) {
    validateObjectId(id);
    return mongoose.Types.ObjectId(id);
}