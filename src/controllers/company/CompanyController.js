import BaseController from "../base/BaseController.js";

import CompanyService from '../../services/company/CompanyService.js';
import { BadRequestError, NotFoundError } from '../../utils/errors.js';

class CompanyController extends BaseController {

    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            if (!req.body.phone_no) {
                throw new BadRequestError('Please enter Phone Number');
            }

            const document = await CompanyService.createCompany(req.body);

            // Success response with data and message
            return this.handleSuccess(res, 200, {
                data: document, // Set the created document as data
                message: 'Company created successfully', // Set a success message
            });
        } catch (error) {
            console.error('Error creating company:', error);
            this.handleError(res, error); // Handle the error appropriately
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
            if (!req.params.id) {
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

            this.handleSuccess(res, 200, await CompanyService.delete(req.params.id));
        } catch (error) {
            console.error('Error deleting company:', error);
            this.handleError(res, error); // Use the handleError method
        }
    };
}

export default new CompanyController();