import BaseService from '../../base/BaseService.js';
import Company from '../../models/company/Company.js';
import ExpenseCategory from '../../models/expense/ExpenseCategories.js';
import { ConflictError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';

class CompanyService extends BaseService {
    constructor() {
        super(Company);
    }

    // Override create method to add extra logic
    create = async (data) => {
        return withTransaction(async (transaction) => {
            const existingCompany = await this.model.findOne({
                where: { phone_no: data.phone_no }
            }, { transaction });

            if (existingCompany) {
                throw new ConflictError(`Company with phone No ${data.phone_no} already exists`);
            }

            const company = await this.model.create(data, { transaction });
            await ExpenseCategory.create({
                company_id: company.id,
                category_name: "Salary"
            }, { transaction });

            return company; // Returning company as expense category is not required in response
        });
    }
}

export default new CompanyService();