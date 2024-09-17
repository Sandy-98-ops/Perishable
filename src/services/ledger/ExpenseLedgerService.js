import ExpenseLedger from '../../models/ledger/ExpenseLedger.js';
import CashLedgerService from '../ledger/CashLedgerService.js';
import BankLedgerService from '../ledger/BankLedgerService.js';
import { InternalServerError, BadRequestError } from '../../utils/errors.js';
import BaseService from "../base/BaseService.js";
import Counter from '../../utils/Counter.js';

class ExpenseLedgerService extends BaseService {
    constructor() {
        super(ExpenseLedger);
    }

    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (company_id, transaction) => {
        try {
            const sequence_type = 'expense_transaction';
            let counter = await Counter.findOne({ where: { company_id, sequence_type }, transaction });

            if (!counter) {
                counter = await Counter.create({ company_id, sequence_type, sequence_value: 1 }, { transaction });
            } else {
                await counter.increment('sequence_value', { transaction });
                counter = await Counter.findOne({ where: { company_id, sequence_type }, transaction });
            }

            if (!counter) {
                throw new InternalServerError('Failed to generate transaction ID');
            }

            return `EXP-${counter.sequence_value}`;
        } catch (error) {
            console.error('Error generating unique transaction ID:', error);
            throw new InternalServerError(`Error generating unique transaction ID: ${error.message}`);
        }
    }

    createExpenseLedger = async (expenseEntry, transaction) => {
        try {
            const recentEntry = await this.model.findOne({
                where: { company_id: expenseEntry.company_id },
                order: [['created_at', 'DESC']],
                transaction
            });

            const previousBalance = recentEntry ? recentEntry.balance : 0;
            const newBalance = previousBalance + expenseEntry.amount;

            const uniqueTransactionId = await this.generateUniqueTransactionId(expenseEntry.company_id, transaction);

            const data = {
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
            };

            const expenseLedger = await ExpenseLedger.create(data, { transaction });

            let cashLedger = null, bankLedger = null;

            if (expenseLedger) {
                const ledgerData = {
                    company_id: expenseEntry.company_id,
                    date: expenseEntry.date,
                    description: expenseEntry.description,
                    payment_mode: expenseEntry.payment_mode,
                    debit: expenseEntry.amount,
                    credit: 0
                };

                if (expenseLedger.payment_mode === 'Cash' || expenseLedger.payment_mode === 'Cash on Delivery') {
                    cashLedger = await CashLedgerService.createCashLedger(ledgerData, transaction);
                } else if (['Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Online Payment Gateway', 'Mobile Payment'].includes(expenseLedger.payment_mode)) {
                    bankLedger = await BankLedgerService.create(ledgerData, transaction);
                }
            }

            return { expenseLedger, cashLedger, bankLedger };
        } catch (error) {
            console.error('Error creating expense ledger:', error.message, error.stack);
            throw new InternalServerError('Error creating expense ledger');
        }
    }

    updateExpenseLedger = async (expense_id, company_id, updateData, transaction) => {
        try {
            // Fetch the existing ledger entry
            const existingLedger = await this.model.findOne({
                where: { expense_id, company_id },
                transaction
            });

            if (!existingLedger) {
                throw new BadRequestError('Expense ledger entry not found');
            }

            // Fetch the most recent ledger entry for the company to calculate balance
            const recentEntry = await this.model.findOne({
                where: { company_id },
                order: [['created_at', 'DESC']],
                transaction
            });

            // Calculate the updated balance
            const previousCredit = existingLedger.credit;
            const previousDebit = existingLedger.debit;
            const previousBalance = recentEntry ? recentEntry.balance : 0; // Use recentEntry if available

            // Adjust balance based on the difference between new and old credit and debit values
            const updatedBalance = previousBalance - (updateData.amount + previousCredit);

            // Update the ledger entry
            const updatedLedger = await existingLedger.update({
                ...updateData,
                balance: updatedBalance,
                credit: updateData.amount,
                debit: 0
            }, { transaction });

            // Handle dependent ledgers if necessary
            let cashLedger = null, bankLedger = null;
            const ledgerData = {
                company_id: updatedLedger.company_id,
                date: updatedLedger.date,
                description: updatedLedger.description,
                payment_mode: updatedLedger.payment_mode,
                debit: updatedLedger.debit,
                credit: updatedLedger.credit
            };

            if (updatedLedger.payment_mode === 'Cash' || updatedLedger.payment_mode === 'Cash on Delivery') {

                const cashLedger =
                    cashLedger = await CashLedgerService.updateCashLedger(ledgerData, transaction);
            } else if (['Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Online Payment Gateway', 'Mobile Payment'].includes(updatedLedger.payment_mode)) {
                bankLedger = await BankLedgerService.update(ledgerData, transaction);
            }

            return { updatedLedger, cashLedger, bankLedger };
        } catch (error) {
            console.error('Error updating expense ledger:', error.message, error.stack);
            throw new InternalServerError('Error updating expense ledger');
        }
    }

}

export default new ExpenseLedgerService();