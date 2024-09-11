import BaseController from '../../base/BaseController.js';
import CompanyService from '../../services/company/CompanyService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class CompanyController extends BaseController {
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            if (!req.body.phone_no) {
                throw new BadRequestError('Please enter Phone Number')
            }

            const document = await CompanyService.create(req.body);
            this.handleSuccess(res, 201, document); // Use the handleSuccess method for successful responses
        } catch (error) {
            console.error('Error creating company:', error);
            this.handleError(res, error); // Use the handleError method for error handling
        }
    };


    findAll = async (req, res) => {

        try {
            const documents = await CompanyService.findAll(req.query);
            this.handleSuccess(res, 200, documents); // Use the handleSuccess method
        } catch (error) {
            console.error('Error reading company:', error);
            this.handleError(res, error); // Use the handleError method
        }
    }

    findById = async (req, res) => {
        try {
            if (req.params.id) {
                throw new BadRequestError("Please enter Id");
            }
            
            const document = await CompanyService.findById(req.params.id);
            this.handleSuccess(res, 200, document); // Use the handleSuccess method

        } catch (error) {
            console.error('Error reading company:', error);
            this.handleError(res, error); // Use the handleError method
        }
    };

    update = async (req, res) => {
        try {
            if (!req.params.id || !req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid ID or data provided');
            }

            const result = await CompanyService.update(req.params.id, req.body);
            this.handleSuccess(res, 200, result); // Use the handleSuccess method
        } catch (error) {
            console.error('Error updating company:', error);
            this.handleError(res, error); // Use the handleError method
        }
    };

    delete = async (req, res) => {
        try {
            if (!req.params.id) {
                throw new BadRequestError('Invalid ID provided');
            }

            await CompanyService.delete(req.params.id);
            res.status(204).end(); // No content to return on success
        } catch (error) {
            console.error('Error deleting company:', error);
            this.handleError(res, error); // Use the handleError method
        }
    };
}

export default new CompanyController();