import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import Employee from '../../models/employee/Employee.js';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import BaseService from "../base/BaseService.js";
import CounterService from '../utils/CounterService.js';
import EmployeeRoleService from './EmployeeRoleService.js';
import { generateOTP, sendOTPEmail } from '../../utils/otpHelper.js';
import { generateToken } from '../../utils/jwtHelper.js';

class EmployeeService extends BaseService {
    constructor() {
        super(Employee, 'emp_id');
    }

    createEmployee = async (data) => {
        try {
            if (!data || Object.keys(data).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            if (data.employee.salary && data.employee.number_of_hours) {
                data.employee.hourly_rate = data.employee.salary / data.employee.number_of_hours;
            }

            return await withTransaction(async (transaction) => {
                const existingEmployee = await this.findOne({
                    [Op.or]: [
                        { email: data.employee.email },
                        { phone_no: data.employee.phone_no }
                    ],
                    company_id: data.employee.company_id
                },
                    transaction
                );

                if (existingEmployee) {
                    throw new ConflictError('Email or phone number already exists');
                }

                const uniqueTransactionId = await CounterService.generateUniqueTransactionId(data.employee.company_id, 'employee_id', transaction);
                data.employee.employee_id = uniqueTransactionId;

                const employee = await this.create(data.employee, null, transaction);

                if (data.roles && data.roles.length > 0) {
                    for (const role of data.roles) {
                        await EmployeeRoleService.create({
                            employee_id: employee.emp_id, // Assuming `emp_id` is the field used for the employee's ID
                            role_id: role.role_id
                        }, transaction);
                    }
                }

                return employee; // Return the created employee
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerError('Error creating employee', error);
        }
    }

    updateEmployee = async (id, data) => {
        try {
            if (!data || Object.keys(data).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            if (data.salary && data.number_of_hours) {
                data.hourly_rate = data.salary / data.number_of_hours;
            }

            return await withTransaction(async (transaction) => {
                const employee = await this.findById(id, { transaction });

                if (!employee) {
                    throw new NotFoundError('Employee not found');
                }

                // Update the employee data
                await employee.update(data, { transaction });

                // If roles are provided, update employee roles
                if (data.roles && data.roles.length > 0) {
                    // First, remove existing roles
                    await EmployeeRoleService.deleteRolesByEmployeeId(id, transaction);

                    // Then, add the new roles
                    for (const role of data.roles) {
                        await EmployeeRoleService.create({
                            employee_id: employee.emp_id, // Assuming `emp_id` is the field used for the employee's ID
                            role_id: role.role_id
                        }, transaction);
                    }
                }

                return employee; // Return the updated employee
            });
        } catch (error) {
            console.error(error);
            throw new InternalServerError('Error updating employee', error);
        }
    }

    findEmployeesByCompany = async (companyId) => {
        try {
            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            return await this.findAll({ company_id: companyId });
        } catch (error) {
            console.error(error);
            throw new InternalServerError('Error finding employees by company', error);
        }
    }

    findAllEmployees = async () => {
        try {
            return await this.findAll();
        } catch (error) {
            console.error(error);
            throw new InternalServerError('Error finding all employees', error);
        }
    }

    // New method: Request OTP
    requestOTP = async (email) => {
        try {
            const employee = await this.findOne({ email: email });

            if (!employee) {
                throw new NotFoundError('Employee not found');
            }

            const otp = generateOTP();
            const expiration = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

            await this.update(employee.emp_id, { otp: otp, otp_expiration: expiration });

            await sendOTPEmail(email, otp);

            return { message: 'OTP sent to email' };
        } catch (error) {
            console.error(error);
            throw new InternalServerError('Error requesting OTP', error);
        }
    }

    // New method: Validate OTP and log in
    validateOTP = async (email, otp) => {
        try {
            const employee = await Employee.findOne({
                where: {
                    email,
                    otp,
                    otp_expiration: {
                        [Op.gt]: new Date() // Check if OTP is not expired
                    }
                }
            });

            if (!employee) {
                throw new BadRequestError('Invalid or expired OTP');
            }

            // Clear OTP after successful validation
            await employee.update({ otp: null, otp_expiration: null });

            // Generate and return a JWT token
            const token = await generateToken(employee);
            return { token };
        } catch (error) {
            console.error(error);
            throw new InternalServerError('Error validating OTP', error);
        }
    }
}

export default new EmployeeService();