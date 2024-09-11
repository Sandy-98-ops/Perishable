import BaseService from '../../base/BaseService.js';
import EmployeeAttendance from '../../models/employee/EmployeeAttendance.js';

class EmployeeAttendanceService extends BaseService {
    constructor() {
        super(EmployeeAttendance);
    }

    // Custom method to find by company
    findByCompany = async (companyId) => {
        if (!companyId) {
            throw new BadRequestError('Company ID is required');
        }

        return this.model.findAll({ where: { company_id: companyId } });
    }
}

export default new EmployeeAttendanceService();
