import BaseController from "../base/BaseController.js";
import EmployeeAttendance from "../models/EmployeeAttendance.js";


class EmployeeAttendanceController extends BaseController {
    constructor() {
        super(EmployeeAttendance)
    }

    async findByCompany(req, res) {

        try {
            console.log("Entered")
            console.log(req.params.company)

            res.json(await EmployeeAttendance.find({ company: req.params.company }));
        } catch (error) {
            console.error('Error finding party by company:', error);
            this.handleError(res, error);
        }
    }

}

export default new EmployeeAttendanceController();