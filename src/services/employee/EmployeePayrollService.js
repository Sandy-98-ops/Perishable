import Employee from '../../models/employee/Employee.js';
import EmployeePayroll from '../../models/employee/EmployeePayroll.js';
import BaseService from '../base/BaseService.js';
import { BadRequestError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import SalaryLedgerService from '../ledger/SalaryLedgerService.js';
import EmployeeLedgerService from '../ledger/EmployeeLedgerService.js';
import AdvanceLedgerService from '../ledger/AdvanceLedgerService.js';  // Import the AdvanceLedgerService

class EmployeePayrollService extends BaseService {
    constructor() {
        super(EmployeePayroll, 'employee_payroll_id');
    }

    createPayroll = async (data) => {
        const {
            employee_id, hours_worked, overtime_hours, tax_deductions,
            other_deductions, advances_deducted, pay_period, overtime_rate, company_id, direct_salary, payment_mode,
            date
        } = data;

        if (!employee_id || !pay_period || !company_id) {
            throw new BadRequestError('Employee ID, pay period, and company ID are required');
        }

        return withTransaction(async (transaction) => {
            const employee = await Employee.findOne({
                where: { emp_id: employee_id },
                transaction
            });

            if (!employee) {
                throw new BadRequestError('Employee not found');
            }

            // Handle advance deductions
            if (advances_deducted > 0) {
                const advanceLedgerData = {
                    company_id,
                    employee_id,  // Assuming advance_id can be the employee_id
                    advanceDate: new Date(),  // Use current date or appropriate date
                    description: `Advance deduction for employee ${employee_id}`,
                    credit: 0.0,
                    date: date,
                    debit: advances_deducted,
                    amount: advances_deducted,
                    payment_mode
                };

                const { advanceLedger, cashLedger, bankLedger } = await AdvanceLedgerService.createAdvanceLedger(advanceLedgerData, transaction);

                if (!advanceLedger) {
                    throw new BadRequestError('Failed to create advance ledger entry');
                }

                // Handle employee ledger entry for advance deduction
                const employeeLedger = await EmployeeLedgerService.createEmployeeLedger({
                    employee_id,
                    company_id,
                    date: date,
                    payment_mode,
                    credit: 0.0,
                    debit: advances_deducted,
                    description: `Advance deduction for employee ${employee_id}`,
                    amount: advances_deducted
                }, transaction);

                if (!employeeLedger) {
                    throw new BadRequestError('Failed to create employee ledger entry for advance deduction');
                }
            }

            const { total_earnings, net_pay } = this.calculatePayroll(
                employee, hours_worked, overtime_hours, tax_deductions, other_deductions, advances_deducted, pay_period, overtime_rate, direct_salary
            );

            const payroll = await this.model.create({
                employee_id,
                base_salary: employee.salary,
                hours_worked,
                overtime_hours,
                total_earnings,
                tax_deductions,
                other_deductions,
                advances_deducted: advances_deducted ? advances_deducted : 0.0,
                net_pay,
                payment_status: 'Pending',
                pay_period,
                company_id,
                payment_mode,
                date
            }, { transaction });

            const salaryLedger = await SalaryLedgerService.createSalaryLedger({
                payroll_id: payroll.employee_payroll_id,
                company_id: payroll.company_id,
                date: payroll.date,
                payment_mode: payroll.payment_mode,
                amount: total_earnings
            }, transaction);

            const employeeLedger1 = await EmployeeLedgerService.createEmployeeLedger({
                employee_id: payroll.employee_id,
                company_id: payroll.company_id,
                date: date,
                payment_mode: payroll.payment_mode,
                credit: total_earnings,
                debit: 0.0,
                description: "Salary credited",
                amount: total_earnings
            }, transaction);

            const employeeLedger2 = await EmployeeLedgerService.createEmployeeLedger({
                employee_id: payroll.employee_id,
                company_id: payroll.company_id,
                date: date,
                payment_mode: payroll.payment_mode,
                credit: 0.0,
                debit: total_earnings,
                description: "Salary debited",
                amount: total_earnings
            }, transaction);

            return { payroll, salaryLedger, employeeLedger1, employeeLedger2 };
        });
    }

    updatePayroll = async (id, data) => {
        const {
            employee_id, hours_worked, overtime_hours, tax_deductions, other_deductions, advances_deducted, pay_period, overtime_rate, direct_salary, payment_mode
        } = data;

        return withTransaction(async (transaction) => {
            const payroll = await this.findById(id);

            if (!payroll) {
                throw new BadRequestError('Payroll record not found');
            }

            const employee = await Employee.findOne({
                where: { emp_id: employee_id },
                transaction
            });

            if (!employee) {
                throw new BadRequestError('Employee not found');
            }

            // Handle advance deductions
            if (advances_deducted > 0) {
                const advanceLedgerData = {
                    company_id: payroll.company_id,
                    employee_id,  // Use employee_id for advance deduction
                    advanceDate: new Date(),  // Use current date or appropriate date
                    description: `Advance deduction for employee ${employee_id}`,
                    credit: 0.0,
                    debit: advances_deducted,
                    amount: advances_deducted,
                    payment_mode
                };

                const { advanceLedger } = await AdvanceLedgerService.createAdvanceLedger(advanceLedgerData, transaction);

                if (!advanceLedger) {
                    throw new BadRequestError('Failed to create advance ledger entry');
                }

                // Handle employee ledger entry for advance deduction
                const employeeLedger = await EmployeeLedgerService.createEmployeeLedger({
                    employee_id,
                    company_id: payroll.company_id,
                    date: new Date(),
                    payment_mode,
                    credit: 0.0,
                    debit: advances_deducted,
                    description: `Advance deduction for employee ${employee_id}`,
                    amount: advances_deducted
                }, transaction);

                if (!employeeLedger) {
                    throw new BadRequestError('Failed to create employee ledger entry for advance deduction');
                }
            }

            const { total_earnings, net_pay } = this.calculatePayroll(
                employee, hours_worked, overtime_hours, tax_deductions, other_deductions, advances_deducted, pay_period, overtime_rate, direct_salary
            );

            await payroll.update({
                base_salary: employee.salary,
                hours_worked,
                overtime_hours,
                total_earnings,
                tax_deductions,
                other_deductions,
                advances_deducted: advances_deducted,
                net_pay,
                pay_period
            }, { transaction });

            return payroll;
        });
    }

    findByCompany = async (company_id) => {
        if (!company_id) {
            throw new BadRequestError('Company ID is required');
        }

        return this.model.findAll({ where: { company_id } });
    }

    calculatePayroll(employee, hours_worked, overtime_hours, tax_deductions = 0, other_deductions = 0, advances_deducted = 0, pay_period = 'monthly', overtime_rate = 0, direct_salary = 0) {
        const validPeriods = ['weekly', 'bi-weekly', 'monthly'];
        if (!validPeriods.includes(pay_period)) {
            pay_period = 'monthly'; // Default to monthly if an invalid period is provided
        }

        if (direct_salary > 0) {
            // If direct_salary is provided, use it directly
            const total_earnings = direct_salary;
            const net_pay = direct_salary - (tax_deductions + other_deductions + advances_deducted);
            return { total_earnings, net_pay };
        }

        const hourly_rate = employee.hourly_rate;
        let total_earnings = 0;

        // Calculate earnings based on pay period
        switch (pay_period) {
            case 'weekly':
                total_earnings = (hourly_rate * hours_worked) + (overtime_rate * overtime_hours);
                break;
            case 'bi-weekly':
                total_earnings = (hourly_rate * hours_worked * 2) + (overtime_rate * overtime_hours * 2);
                break;
            case 'monthly':
                // Assuming 4.33 weeks per month for calculation purposes
                const hours_per_month = hours_worked * 7 * 4.33;
                const overtime_per_month = overtime_hours * 4.33;
                total_earnings = (hourly_rate * hours_per_month) + (overtime_rate * overtime_per_month);
                break;
        }

        // Calculate net pay after deductions
        const net_pay = total_earnings - (tax_deductions + other_deductions + advances_deducted);

        return { total_earnings, net_pay };
    }
}

export default new EmployeePayrollService();