import BaseController from "../base/BaseController.js";
import ExpenseCategory from "../models/ExpenseCategories.js";


class ExpenseCategoryController extends BaseController {
    constructor() {
        super(ExpenseCategory)
    }

    async findByCompany(req, res) {

        try {
            console.log("Entered")
            console.log(req.params.company)

            res.json(await ExpenseCategory.find({ company: req.params.company }));
        } catch (error) {
            console.error('Error finding party by company:', error);
            this.handleError(res, error);
        }
    }

}

export default new ExpenseCategoryController();