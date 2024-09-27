import { ValidationError, NotFoundError, BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, InternalServerError, NotImplementedError, ServiceUnavailableError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';

class BaseController {
    // Define abstract methods
    create = async (req, res) => {
        throw new NotImplementedError("Method 'create' must be implemented.");
    }

    findById = async (req, res) => {
        throw new NotImplementedError("Method 'findById' must be implemented.");
    }

    findAll = async (req, res) => {
        throw new NotImplementedError("Method 'findAll' must be implemented.");
    }

    update = async (req, res) => {
        throw new NotImplementedError("Method 'update' must be implemented.");
    }

    delete = async (req, res) => {
        throw new NotImplementedError("Method 'delete' must be implemented.");
    }

    // Generic error handler
    handleError = (res, error) => {
        let statusCode = 500; // Default to Internal Server Error
        let message = 'An unexpected error occurred';

        // Check if the error is an instance of a known error class
        if (error instanceof ValidationError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error instanceof NotFoundError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error instanceof BadRequestError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error instanceof ConflictError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error instanceof UnauthorizedError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error instanceof ForbiddenError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error instanceof InternalServerError) {
            statusCode = error.statusCode;
            message = `${error.message}`;
        } else if (error instanceof NotImplementedError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error instanceof ServiceUnavailableError) {
            statusCode = error.statusCode;
            message = error.message;
        } else if (error.statusCode) {
            // Fallback for custom errors with statusCode
            statusCode = error.statusCode;
            message = error.message || 'An error occurred';
        } else if (!error.statusCode) {
            statusCode = 500;
            message = error.message;
        }

        // Log the error for debugging
        console.error(`Error ${statusCode}: ${message}`);

        res.status(statusCode).json({ error: message });
    };

    // Generic success handler
    handleSuccess = (res, statusCode, data) => {
        res.status(statusCode).json(data);
    };
}

export default BaseController;
