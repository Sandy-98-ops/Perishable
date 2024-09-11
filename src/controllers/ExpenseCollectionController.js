import BaseController from "../base/BaseController.js";
import ExpenseCollection from "../models/ExpenseCollection.js";


class ExpenseCollectionController extends BaseController {
    constructor() {
        super(ExpenseCollection)
    }

    async findByCompany(req, res) {

        try {
            console.log("Entered")
            console.log(req.params.company)

            res.json(await ExpenseCollection.find({ company: req.params.company }));
        } catch (error) {
            console.error('Error finding party by company:', error);
            this.handleError(res, error);
        }
    }

}

export default new ExpenseCollectionController();