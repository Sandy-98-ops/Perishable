import BaseController from "../base/BaseController.js";
import EmployeePayroll from "../models/EmployeePayroll.js";


class EmployeePayrollController extends BaseController {
    constructor() {
        super(EmployeePayroll)
    }

    async findByCompany(req, res) {

        try {
            console.log("Entered")
            console.log(req.params.company)

            res.json(await EmployeePayroll.find({ company: req.params.company }));
        } catch (error) {
            console.error('Error finding party by company:', error);
            this.handleError(res, error);
        }
    }

}

export default new EmployeePayrollController();