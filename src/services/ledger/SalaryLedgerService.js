import BaseService from '../base/BaseService.js';
import SalaryLedger from "../../models/ledger/SalaryLedger.js";
import Counter from "../../utils/Counter.js";
import CashLedgerService from "./CashLedgerService.js";
import BankLedgerService from "./BankLedgerService.js";
import { InternalServerError, BadRequestError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";

class SalaryLedgerService extends BaseService {
    constructor() {
        super(SalaryLedger, 'salary_Ledger_id');
    }

    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (company_id, transaction) => {
        try {
            const sequence_type = 'salary_transaction';
            let counter = await Counter.findOne({
                where: { company_id, sequence_type },
                transaction
            });

            if (!counter) {
                counter = await Counter.create({
                    company_id,
                    sequence_type,
                    sequence_value: 1,
                    prefix: "Sal"
                }, { transaction });
            } else {
                counter = await counter.increment('sequence_value', { transaction });
                counter = await Counter.findOne({
                    where: { company_id, sequence_type },
                    transaction
                });
            }

            if (!counter) {
                throw new InternalServerError('Failed to generate transaction ID');
            }

            return `${counter.prefix}-${counter.sequence_value}`;
        } catch (error) {
            console.error('Error generating unique transaction ID:', error);
            throw new InternalServerError(`Error generating unique transaction ID: ${error.message}`);
        }
    }

    // Method to create a salary ledger entry and related cash/bank ledger entries
    createSalaryLedger = async (salaryEntry, transaction) => {
        if (!salaryEntry || Object.keys(salaryEntry).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        // Fetch the most recent SalaryLedger entry for the company
        const recentEntry = await SalaryLedger.findOne({
            where: { company_id: salaryEntry.company_id },
            order: [['created_at', 'DESC']],
            transaction
        });

        const previousBalance = recentEntry ? recentEntry.balance : 0;
        const newBalance = previousBalance + salaryEntry.amount;

        const uniqueTransactionId = await this.generateUniqueTransactionId(salaryEntry.company_id, transaction);

        const salaryLedger = await this.model.create({
            employee_payroll_id: salaryEntry.payroll_id,
            company_id: salaryEntry.company_id,
            transaction_id: uniqueTransactionId,
            description: "Salary",
            date: salaryEntry.date,
            payment_mode: salaryEntry.payment_mode,
            balance: newBalance,
            debit: 0,
            credit: salaryEntry.amount,
        }, { transaction });

        let cashLedger = null, bankLedger = null;
        if (salaryLedger) {
            if (['Cash', 'Cash on Delivery'].includes(salaryEntry.payment_mode)) {
                cashLedger = await CashLedgerService.createCashLedger({
                    reference_id: salaryLedger.transaction_id,
                    company_id: salaryEntry.company_id,
                    date: salaryEntry.date,
                    description: "Salary",
                    payment_mode: salaryEntry.payment_mode,
                    debit: salaryEntry.amount,
                    credit: 0
                }, transaction);
            } else if (['Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Online Payment Gateway', 'Mobile Payment']
                .includes(salaryEntry.payment_mode)) {
                bankLedger = await BankLedgerService.createBankLedger({
                    reference_id: salaryLedger.transaction_id,
                    company_id: salaryEntry.company_id,
                    date: salaryEntry.date,
                    description: "Salary",
                    payment_mode: salaryEntry.payment_mode,
                    debit: salaryEntry.amount,
                    credit: 0
                }, transaction);
            }
        }

        return { salaryLedger, cashLedger, bankLedger };
    }
}

export default new SalaryLedgerService();