import BaseService from '../base/BaseService.js';
import EmployeeLedger from "../../models/ledger/EmployeeLedger.js";
import { withTransaction } from '../../utils/transactionHelper.js';
import { InternalServerError } from '../../utils/errors.js';
import CounterService from '../utils/CounterService.js';

class EmployeeLedgerService extends BaseService {

    constructor() {
        super(EmployeeLedger, 'employee_ledger_id')
    }

    createEmployeeLedger = async (data) => {
        return withTransaction(async (transaction) => {
            try {
                const uniqueTransactionId = await
                    CounterService.generateUniqueTransactionId(data.company_id, 'employee_ledger', 'Emp_Ledger', transaction);

                const recentEntry = await this.model.findOne({
                    where: { company_id: data.company_id },
                    order: [['created_at', 'DESC']],
                    transaction
                });

                const previousBalance = recentEntry ? recentEntry.balance : 0;

                // Use `let` instead of `const` for variables that will be reassigned
                let newBalance = previousBalance;

                if (data.credit > 0.0) {
                    newBalance += data.amount;
                } else if (data.debit > 0.0) {
                    newBalance -= data.amount;
                }

                // Use `let` instead of `const` for variables that will be reassigned
                let employeeLedger;

                if (data.credit > 0.0) {
                    employeeLedger = await this.model.create({
                        company_id: data.company_id,
                        employee_id: data.employee_id, // Make sure to set `employee_id` here
                        date: data.date,
                        description: data.description,
                        transaction_id: uniqueTransactionId,
                        payment_mode: data.payment_mode,
                        debit: 0,
                        credit: data.amount,
                        balance: newBalance
                    }, { transaction });
                } else if (data.debit > 0.0) {
                    employeeLedger = await this.model.create({
                        company_id: data.company_id,
                        employee_id: data.employee_id, // Make sure to set `employee_id` here
                        date: data.date,
                        description: data.description,
                        transaction_id: uniqueTransactionId,
                        payment_mode: data.payment_mode,
                        debit: data.amount,
                        credit: 0.0,
                        balance: newBalance
                    }, { transaction });
                }

                return { employeeLedger };
            } catch (error) {
                console.error('Error creating employee ledger:', error);
                throw new InternalServerError('Error creating employee ledger');
            }
        });
    }
}

export default new EmployeeLedgerService();