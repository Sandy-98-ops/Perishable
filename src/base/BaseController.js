import { NotFoundError, InternalServerError, BadRequestError, ValidationError } from '../utils/errors.js'; // Import custom errors

class BaseController {
    constructor(model) {
        this.model = model;
    }

    // Generic error handler
    handleError = (res, error) => {
        if (error instanceof ValidationError) {
            res.status(error.statusCode || 400).json({ error: error.message });
        } else if (error instanceof NotFoundError) {
            res.status(error.statusCode || 404).json({ error: error.message });
        } else if (error instanceof BadRequestError) {
            res.status(error.statusCode || 400).json({ error: error.message });
        } else {
            res.status(error.statusCode || 500).json({ error: error.message || 'Internal Server Error' });
        }
    };

    // Generic success handler
    handleSuccess = (res, statusCode, data) => {
        res.status(statusCode).json(data);
    }

    // Create method
    create = async (req, res) => {
        try {
            // Validate data before creating
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }
            const result = await this.model.create(req.body);
            this.handleSuccess(res, 201, { message: result.message }); // Only send success message
        } catch (error) {
            console.log(error);
            this.handleError(res, error);
        }
    }

    // Read method
    read = async (req, res) => {
        try {
            const query = req.query || {};
            const documents = req.params.id
                ? await this.model.findById(req.params.id)
                : await this.model.find(query);

            if (!documents || (Array.isArray(documents) && documents.length === 0)) {
                throw new NotFoundError('Document not found');
            }

            this.handleSuccess(res, 200, documents);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // Update method
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id || !data || Object.keys(data).length === 0) {
                throw new BadRequestError('Invalid ID or data provided');
            }

            const result = await this.model.update(id, data);

            this.handleSuccess(res, 200, { message: result.message }); // Only send success message
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // Delete method
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Invalid ID provided');
            }

            const result = await this.model.delete(id);

            if (!result) {
                throw new NotFoundError('Document not found');
            }

            res.status(204).end();
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

export default BaseController;
