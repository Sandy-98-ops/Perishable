import BaseController from "../base/BaseController.js";
import EmployeeAdvance from "../models/EmployeeAdvance.js";


class EmployeeAdvanceController extends BaseController {
    constructor() {
        super(EmployeeAdvance)
    }

    async findByCompany(req, res) {

        try {
            console.log("Entered")
            console.log(req.params.company)

            res.json(await EmployeeAdvance.find({ company: req.params.company }));
        } catch (error) {
            console.error('Error finding party by company:', error);
            this.handleError(res, error);
        }
    }

}

export default new EmployeeAdvanceController();