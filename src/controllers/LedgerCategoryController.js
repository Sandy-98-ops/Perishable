import BaseController from "../base/BaseController.js";
import LedgerCategories from "../models/LedgerCategories.js";

class LedgerCategoryController extends BaseController {
    constructor() {
        super(LedgerCategories);
    }

    async findByCompany(req, res) {
        const company = req.params.company;

        res.json(await LedgerCategories.find({ company }))
    }
}

export default new LedgerCategoryController();