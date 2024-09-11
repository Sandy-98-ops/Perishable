import ExpenseLedger from '../../models/ledger/ExpenseLedger.js';
import Counter from '../../models/utils/Counter.js';
import CashLedgerService from '../ledger/CashLedgerService.js';
import BankLedgerService from '../ledger/BankLedgerService.js';
import { InternalServerError, BadRequestError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import BaseService from '../../base/BaseService.js';

class ExpenseLedgerService extends BaseService {
    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (company_id, transaction) => {
        try {
            const sequence_type = 'expense_transaction';
            let counter = await Counter.findOne({
                where: { company_id, sequence_type },
                transaction
            });

            if (!counter) {
                counter = await Counter.create({
                    company_id: company_id,
                    sequence_type: sequence_type,
                    sequence_value: 1
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

            return `EXP-${counter.sequence_value}`;
        } catch (error) {
            console.error('Error generating unique transaction ID:', error);
            throw new InternalServerError(`Error generating unique transaction ID ${error}`);
        }
    }

    createExpenseLedger = async (expenseEntry) => {
        return withTransaction(async (transaction) => {
            try {
                const recentEntry = await ExpenseLedger.findOne({
                    where: { company_id: expenseEntry.company_id },
                    order: [['createdAt', 'DESC']],
                    transaction
                });

                const previousBalance = recentEntry ? recentEntry.balance : 0;
                const newBalance = previousBalance + expenseEntry.amount;

                const uniqueTransactionId = await this.generateUniqueTransactionId(expenseEntry.company_id, transaction);

                const expenseLedger = await ExpenseLedger.create({
                    company_id: expenseEntry.company_id,
                    expense_id: expenseEntry.id,
                    expense_category_id: expenseEntry.expense_category_id,
                    date: expenseEntry.date,
                    description: expenseEntry.description,
                    transaction_id: uniqueTransactionId,
                    payment_mode: expenseEntry.payment_mode,
                    debit: 0,
                    credit: expenseEntry.amount,
                    balance: newBalance
                }, { transaction });

                let cashLedger = null, bankLedger = null;
                if (expenseLedger) {
                    if (expenseLedger.payment_mode === 'Cash' || expenseLedger.payment_mode === 'Cash on Delivery') {
                        cashLedger = await CashLedgerService.createCashLedger({
                            company_id: expenseEntry.company_id,
                            date: expenseEntry.date,
                            description: expenseEntry.description,
                            payment_mode: expenseEntry.payment_mode,
                            debit: expenseEntry.amount,
                            credit: 0
                        }, transaction);
                    } else if (expenseLedger.payment_mode === 'Credit Card' || expenseLedger.payment_mode === 'Debit Card'
                        || expenseLedger.payment_mode === 'Bank Transfer' || expenseLedger.payment_mode === 'Cheque'
                        || expenseLedger.payment_mode === 'Online Payment Gateway' || expenseLedger.payment_mode === 'Mobile Payment'
                    ) {
                        bankLedger = await BankLedgerService.createBankLedger({
                            company_id: expenseEntry.company_id,
                            date: expenseEntry.date,
                            description: expenseEntry.description,
                            payment_mode: expenseEntry.payment_mode,
                            debit: expenseEntry.amount,
                            credit: 0
                        }, transaction);
                    }
                }

                return { expenseLedger, cashLedger, bankLedger };
            } catch (error) {
                console.error('Error creating expense ledger:', error);
                throw new InternalServerError('Error creating expense ledger');
            }
        });
    }
}

export default new ExpenseLedgerService();
