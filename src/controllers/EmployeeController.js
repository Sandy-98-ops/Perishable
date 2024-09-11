import BaseController from "../base/BaseController.js";
import Employee from "../models/Employee.js";


class EmployeeController extends BaseController {
    constructor() {
        super(Employee)
    }

    async findByCompany(req, res) {

        try {
            console.log("Entered")
            console.log(req.params.company)

            res.json(await Employee.find({ company: req.params.company }));
        } catch (error) {
            console.error('Error finding party by company:', error);
            this.handleError(res, error);
        }
    }
}

export default new EmployeeController();