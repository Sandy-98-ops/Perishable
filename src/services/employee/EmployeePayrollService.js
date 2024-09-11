import Employee from '../../models/employee/Employee.js';
import EmployeePayroll from '../../models/employee/EmployeePayroll.js';
import EmployeeAdvance from '../../models/employee/EmployeeAdvance.js';
import AdvanceLedger from '../../models/ledger/AdvanceLedger.js';
import BaseService from '../../base/BaseService.js';
import { BadRequestError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';

class EmployeePayrollService extends BaseService {
    constructor() {
        super(EmployeePayroll);
    }

    createPayroll = async (data) => {
        const {
            employee_id, hours_worked, overtime_hours, tax_deductions,
            other_deductions, advance_deductions, pay_period, overtime_rate, company_id, direct_salary
        } = data;

        if (!employee_id || !pay_period || !company_id) {
            throw new BadRequestError('Employee ID, pay period, and company ID are required');
        }

        return withTransaction(async (transaction) => {
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

            const payroll = await this.model.create({
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
                company_id
            }, { transaction });

            return payroll;
        });
    }

    updatePayroll = async (id, data) => {
        const {
            employee_id, hours_worked, overtime_hours, tax_deductions, other_deductions, advance_deductions, pay_period, overtime_rate, direct_salary
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

    calculatePayroll(employee, hours_worked, overtime_hours, tax_deductions = 0, other_deductions = 0, advance_deductions = 0, pay_period = 'monthly', overtime_rate, direct_salary) {
        const validPeriods = ['weekly', 'bi-weekly', 'monthly'];
        if (!validPeriods.includes(pay_period)) {
            pay_period = 'monthly';
        }

        if (direct_salary) {
            const total_earnings = direct_salary;
            const net_pay = direct_salary - (tax_deductions + other_deductions + advance_deductions);
            return { total_earnings, net_pay };
        }

        let hourly_rate = employee.hourly_rate;
        let total_earnings = 0;

        let total_hours = hours_worked + overtime_hours;

        switch (pay_period) {
            case 'weekly':
            case 'bi-weekly':
                total_earnings = (hourly_rate * total_hours) + (overtime_rate * overtime_hours);
                break;
            case 'monthly':
                total_earnings = (hourly_rate * total_hours) + (overtime_rate * overtime_hours);
                break;
        }

        const net_pay = total_earnings - (tax_deductions + other_deductions + advance_deductions);

        return { total_earnings, net_pay };
    }
}

export default new EmployeePayrollService();