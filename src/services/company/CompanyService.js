import BaseService from "../base/BaseService.js";
import Company from '../../models/company/Company.js';
import { ConflictError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import ExpenseCategory from "../../models/expense/ExpenseCategories.js";
import Employee from "../../models/employee/Employee.js";
import Role from "../../models/master/Role.js";
import EmployeeRoles from "../../models/employee/EmployeeRoles.js";
import Counter from "../../utils/Counter.js";
import CounterService from "../utils/CounterService.js";
import ExpenseCategoryService from "../expense/ExpenseCategoryService.js";

class CompanyService extends BaseService {
    constructor() {
        super(Company, 'company_id');
    }

    // Override create method to add extra logic
    createCompany = async (data) => {
        console.log("Entered")
        return withTransaction(async (transaction) => {
            // Check if company with the same phone number already exists
            const existingCompany = await this.findOne({ phone_no: data.phone_no }, [], false);

            if (existingCompany) {
                throw new ConflictError(`Company with phone No ${data.phone_no} already exists`);
            }

            // Create new company record
            const company = await this.model.create({
                ...data,
                // Add created_by field if necessary
            }, { transaction });

            await ExpenseCategory.create({
                company_id: company.company_id,
                category_name: "Salary"
            }, { transaction });

            // Generate unique employee ID
            const employeeId = await CounterService.generateUniqueTransactionId(company.company_id, 'employee_id', 'Emp', transaction, false);

            // Create default employee record
            const employee = await Employee.create({
                employee_id: employeeId,
                company_id: company.company_id,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                phone_no: data.phone_no,
                password: data.password,
                // Add created_by field if necessary
            }, { transaction });

            // Find the 'Admin' role
            const role = await Role.findOne({ where: { role_name: 'Admin' }, transaction });

            if (!role) {
                throw new Error('Admin role not found');
            }

            // Assign 'Admin' role to the created employee
            await EmployeeRoles.create({
                employee_id: employee.emp_id,
                role_id: role.role_id,
            }, { transaction });

            // Return the created entities
            return { company, employee };
        });
    }
}

export default new CompanyService();