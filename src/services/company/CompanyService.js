import BaseService from "../base/BaseService.js";
import Company from '../../models/company/Company.js';
import { ConflictError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import ExpenseCategoryService from "../expense/ExpenseCategoryService.js";
import EmployeeService from "../employee/EmployeeService.js";
import CounterService from "../utils/CounterService.js";
import EmployeeRoleService from "../employee/EmployeeRoleService.js";
import RoleService from "../master/RoleService.js";

class CompanyService extends BaseService {
    constructor() {
        super(Company, 'company_id');
    }

    // Override create method to add extra logic
    create = async (data) => {
        return withTransaction(async (transaction) => {
            // Check if company with the same phone number already exists
            const existingCompany = await this.model.findOne({
                where: { phone_no: data.phone_no },
                transaction
            });

            if (existingCompany) {
                throw new ConflictError(`Company with phone No ${data.phone_no} already exists`);
            }

            // Create new company record
            const company = await this.model.create(data, { transaction });

            await ExpenseCategoryService.create({
                company_id: company.id,
                category_name: "Salary"
            }, transaction);

            // Generate unique employee ID
            const employeeId = await CounterService.generateUniqueTransactionId(company.company_id, 'employee_id', transaction);

            // Create default employee record
            const employee = await EmployeeService.create({
                employee_id: employeeId,
                company_id: company.company_id,
                first_name: data.first_name, // Assuming `data` has these fields
                last_name: data.last_name,
                email: data.email,
                phone_no: data.phone_no,
                password: data.password
            }, transaction);

            // Find the 'Admin' role
            const role = await RoleService.findOne({ role_name: 'Admin' });

            if (!role) {
                throw new Error('Admin role not found');
            }

            // Assign 'Admin' role to the created employee
            await EmployeeRoleService.create({
                employee_id: employee.emp_id, // Assuming `employee_id` is the correct field
                role_id: role.role_id,
            }, transaction);

            // Return the created entities
            return { company, employee }; // Return only relevant objects
        });
    }
}

export default new CompanyService();