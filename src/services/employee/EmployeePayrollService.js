import Employee from '../../models/employee/Employee.js';
import EmployeePayroll from '../../models/employee/EmployeePayroll.js';
import EmployeeAdvance from '../../models/employee/EmployeeAdvance.js';
import AdvanceLedger from '../../models/ledger/AdvanceLedger.js';
import BaseService from '../../base/BaseService.js';
import { BadRequestError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import SalaryLedgerService from '../ledger/SalaryLedgerService.js';
import EmployeeLedger from '../../models/ledger/EmployeeLedger.js';

class EmployeePayrollService extends BaseService {
    constructor() {
        super(EmployeePayroll, 'employee_payroll_id');
    }

    createPayroll = async (data) => {
        const {
            employee_id, hours_worked, overtime_hours, tax_deductions,
            other_deductions, advance_deductions, pay_period, overtime_rate, company_id, direct_salary, payment_mode
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

            const advanceLedger = await AdvanceLedger.findOne({
                where: { employee_id },
                order: [['updatedAt', 'DESC']],
                transaction
            });

            if (advanceLedger) {
                if (advanceLedger.balance < advance_deductions) {
                    throw new BadRequestError('Insufficient advance balance');
                }

                advanceLedger.balance -= advance_deductions;

                if (advanceLedger.balance === 0) {
                    await advanceLedger.destroy({ transaction });
                } else {
                    await advanceLedger.save({ transaction });
                }
            } else if (advance_deductions > 0) {
                throw new BadRequestError('No advance ledger found for deduction');
            }

            const { total_earnings, net_pay } = this.calculatePayroll(
                employee, hours_worked, overtime_hours, tax_deductions, other_deductions, advance_deductions, pay_period, overtime_rate, direct_salary
            );

            const payroll = await this.create({
                employee_id,
                base_salary: employee.salary,
                hours_worked,
                overtime_hours,
                total_earnings,
                tax_deductions,
                other_deductions,
                advances_deducted: advance_deductions,
                net_pay,
                payment_status: 'Pending',
                pay_period,
                company_id,
                payment_mode
            }, { transaction });

            const salaryLedger = await SalaryLedgerService.createSalaryLedger({
                payroll_id: payroll.employee_payroll_id,
                company_id: payroll.company_id,
                date: payroll.date,
                payment_mode: payroll.payment_mode,
                amount: total_earnings
            });

            const employeeLedger = await EmployeeLedgerSe

            return { payroll, ledgerService };

        });
    }

    updatePayroll = async (id, data) => {
        const {
            employee_id, hours_worked, overtime_hours, tax_deductions, other_deductions, advance_deductions, pay_period, overtime_rate, direct_salary, payment_mode
        } = data;

        return withTransaction(async (transaction) => {
            const payroll = await this.findById(id);

            const employee = await Employee.findOne({
                where: { id: employee_id },
                transaction
            });

            if (!employee) {
                throw new BadRequestError('Employee not found');
            }

            const advanceLedger = await AdvanceLedger.findOne({
                where: { employee_id },
                order: [['updatedAt', 'DESC']],
                transaction
            });

            let total_advance_deductions = 0;
            if (advanceLedger) {
                if (advanceLedger.balance < advance_deductions) {
                    throw new BadRequestError('Insufficient advance balance');
                }

                advanceLedger.balance -= advance_deductions;

                if (advanceLedger.balance === 0) {
                    await advanceLedger.destroy({ transaction });
                } else {
                    await advanceLedger.save({ transaction });
                }

                total_advance_deductions = advance_deductions;
            } else if (advance_deductions > 0) {
                throw new BadRequestError('No advance ledger found for deduction');
            }

            const { total_earnings, net_pay } = this.calculatePayroll(
                employee, hours_worked, overtime_hours, tax_deductions, other_deductions, total_advance_deductions, pay_period, overtime_rate, direct_salary
            );

            await payroll.update({
                base_salary: employee.salary,
                hours_worked,
                overtime_hours,
                total_earnings,
                tax_deductions,
                other_deductions,
                advances_deducted: total_advance_deductions,
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

    calculatePayroll(employee, hours_worked, overtime_hours, tax_deductions = 0, other_deductions = 0, advance_deductions = 0, pay_period = 'monthly', overtime_rate = 0, direct_salary = 0) {
        const validPeriods = ['weekly', 'bi-weekly', 'monthly'];
        if (!validPeriods.includes(pay_period)) {
            pay_period = 'monthly'; // Default to monthly if an invalid period is provided
        }

        if (direct_salary > 0) {
            // If direct_salary is provided, use it directly
            const total_earnings = direct_salary;
            const net_pay = direct_salary - (tax_deductions + other_deductions + advance_deductions);
            return { total_earnings, net_pay };
        }

        const hourly_rate = employee.hourly_rate;
        let total_earnings = 0;

        // Calculate earnings based on pay period
        switch (pay_period) {
            case 'weekly':
                total_earnings = ((hourly_rate * hours_worked) + (overtime_rate * overtime_hours)) * 7;
                break;
            case 'bi-weekly':
                total_earnings = (hourly_rate * hours_worked * 2) + (overtime_rate * overtime_hours * 2);
                break;
            case 'monthly':
                // Assuming 4.33 weeks per month for calculation purposes
                const hours_per_month = hours_worked * 7 * 4.33;
                const overtime_per_month = overtime_hours;
                total_earnings = (hourly_rate * hours_per_month) + (overtime_rate * overtime_per_month);
                break;
        }

        // Calculate net pay after deductions
        const net_pay = total_earnings - (tax_deductions + other_deductions + advance_deductions);

        return { total_earnings, net_pay };
    }
}

export default new EmployeePayrollService();