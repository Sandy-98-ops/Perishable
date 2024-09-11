import { Op } from 'sequelize';
import Employee from '../../models/employee/Employee.js';
import Counter from '../../models/utils/Counter.js';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';

class EmployeeService {
    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (companyId, transaction) => {
        try {
            const sequenceType = 'employee_id';

            let counter = await Counter.findOne({
                where: { company_id: companyId, sequence_type: sequenceType },
                transaction
            });

            if (!counter) {
                counter = await Counter.create({
                    company_id: companyId,
                    sequence_type: sequenceType,
                    prefix: 'Emp',
                    sequence_value: 1
                }, { transaction });
            } else {
                counter = await counter.increment('sequence_value', { transaction });
                counter = await Counter.findOne({
                    where: { company_id: companyId, sequence_type: sequenceType },
                    transaction
                });
            }

            if (!counter) {
                throw new InternalServerError('Failed to generate transaction ID');
            }

            return `${counter.prefix}-${counter.sequence_value}`;
        } catch (error) {
            console.error('Error generating unique transaction ID:', error);
            throw new InternalServerError('Error generating unique transaction ID');
        }
    }

    createEmployee = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        if (data.salary && data.number_of_hours) {
            data.hourly_rate = data.salary / data.number_of_hours;
        }

        return withTransaction(async (transaction) => {
            const existingEmployee = await Employee.findOne({
                where: {
                    [Op.or]: [
                        { email: data.email },
                        { phone_no: data.phone_no }
                    ],
                    company_id: data.company_id
                },
                transaction
            });

            if (existingEmployee) {
                throw new ConflictError('Email or phone number already exists');
            }

            const uniqueTransactionId = await this.generateUniqueTransactionId(data.company_id, transaction);
            data.employee_id = uniqueTransactionId;

            return Employee.create(data, { transaction });
        });
    }

    updateEmployee = async (id, data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        if (data.salary && data.number_of_hours) {
            data.hourly_rate = data.salary / data.number_of_hours;
        }

        return withTransaction(async (transaction) => {
            const employee = await Employee.findByPk(id, { transaction });

            if (!employee) {
                throw new NotFoundError('Employee not found');
            }

            await employee.update(data, { transaction });
            return employee;
        });
    }

    findEmployeesByCompany = async (companyId) => {
        if (!companyId) {
            throw new BadRequestError('Company ID is required');
        }

        return Employee.findAll({
            where: { company_id: companyId }
        });
    }
}

export default new EmployeeService();