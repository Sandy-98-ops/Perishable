import BaseController from "../base/BaseController.js";
import Company from "../models/Company.js";
import Counter from "../models/Counter.js"; // Import Counter model
import { BadRequestError, InternalServerError } from "../utils/errors.js";

class CompanyController extends BaseController {
    constructor() {
        super(Company);
    }

    create = async (req, res) => {
        try {
            // Validate data before creating
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            // Determine the sequence type for company_id
            const sequenceType = 'company';

            // Generate a sequential company_id
            const counter = await Counter.model.findOneAndUpdate(
                { sequenceType: sequenceType },
                { $inc: { sequenceValue: 1 } },
                { new: true, upsert: true }
            );

            if (!counter) {
                throw new InternalServerError('Failed to generate company_id');
            }

            console.log(counter)
            req.body.companyId = counter.sequenceValue; // Use the incremented sequence value

            const document = await this.model.create(req.body);
            this.handleSuccess(res, 201, document);
        } catch (error) {
            this.handleError(res, error);
        }
    }
}

export default new CompanyController();
