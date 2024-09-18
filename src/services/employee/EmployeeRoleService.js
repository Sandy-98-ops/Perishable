import EmployeeRoles from "../../models/employee/EmployeeRoles.js";
import BaseService from "../base/BaseService.js";

class EmployeeRoleService extends BaseService {

    constructor() {
        super(EmployeeRoles, 'employee_role_id')
    }
}

export default new EmployeeRoleService();