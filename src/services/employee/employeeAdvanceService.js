import BaseService from '../base/BaseService.js';
import EmployeeAdvance from "../../models/employee/EmployeeAdvance.js";
import AdvanceLedgerService from '../ledger/AdvanceLedgerService.js';
import { withTransaction } from "../../utils/transactionHelper.js";
import { BadRequestError } from '../../utils/errors.js';
import EmployeeLedgerService from '../ledger/EmployeeLedgerService.js';

class EmployeeAdvanceService extends BaseService {
    constructor() {
        super(EmployeeAdvance);
    }

    // Override create method to include transaction and additional logic
    create = async (data) => {
        return withTransaction(async (transaction) => {
            const { employee_id, company_id, advance_amount, advance_date, repayment_start_date, repayment_terms, remaining_balance, status, payment_mode } = data;

            if (!employee_id || !company_id || advance_amount <= 0 || !advance_date || !payment_mode) {
                throw new BadRequestError('Invalid data provided for creating an advance');
            }

            // Create the advance record within the transaction
            const advance = await this.model.create(data, { transaction });

            // Check if advance was created successfully
            if (!advance || !advance.id) {
                throw new BadRequestError('Failed to create advance record');
            }

            // Prepare data for AdvanceLedger
            const advanceLedgerData = {
                employee_id,
                company_id,
                advance_id: advance.id, // Use advance.id as advance_id
                date: advance_date,
                description: `Advance of ${advance_amount} for employee ${employee_id}`,
                credit: advance_amount,
                debit: 0.0,
                amount: advance_amount,
                payment_mode
            };

            // Call to AdvanceLedgerService to create the ledger entry
            const { advanceLedger, cashLedger, bankLedger } = await AdvanceLedgerService.createAdvanceLedger(advanceLedgerData, transaction);

            // Prepare data for EmployeeLedger
            const employeeLedgerData = {
                employee_id,
                company_id,
                date: advance_date,
                payment_mode,
                credit: advance_amount,
                debit: 0.0,
                description: `Advance taken: ${advance_amount}`,
                amount: advance_amount
            };

            // Call to EmployeeLedgerService to create the employee ledger entry
            const employeeLedger = await EmployeeLedgerService.createEmployeeLedger(employeeLedgerData, transaction);

            return { advance, advanceLedger, cashLedger, bankLedger, employeeLedger };
        });
    }

    // Custom method to find by company
    findByCompany = async (companyId) => {
        return this.model.findAll({ where: { company_id: companyId } });
    }
}

export default new EmployeeAdvanceService();