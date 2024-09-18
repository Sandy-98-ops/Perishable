import BaseService from '../base/BaseService.js';
import ExpenseCategory from "../../models/expense/ExpenseCategories.js";

class ExpenseCategoryService extends BaseService {
    constructor() {
        super(ExpenseCategory);
    }

    // Add any additional methods specific to ExpenseCategory here, if needed
    // For example, if you need a special method for fetching categories by company
    findCategoriesByCompany = async (companyId) => {
        if (!companyId) {
            throw new BadRequestError('Company ID is required');
        }

        return this.model.findAll({
            where: {
                company_id: companyId
            }
        });
    }
}

export default new ExpenseCategoryService();