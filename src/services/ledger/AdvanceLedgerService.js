import BaseService from "../base/BaseService.js";
import AdvanceLedger from '../../models/ledger/AdvanceLedger.js';
import { InternalServerError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import BankLedgerService from './BankLedgerService.js';
import CashLedgerService from './CashLedgerService.js';
import Counter from "../../utils/Counter.js";

class AdvanceLedgerService extends BaseService {
    constructor() {
        super(AdvanceLedger);
    }

    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (company_id, transaction) => {
        try {
            const sequence_type = 'advance_transaction';

            let counter = await Counter.findOne({
                where: { company_id, sequence_type },
                transaction
            });

            if (!counter) {
                counter = await Counter.create({
                    company_id: company_id,
                    sequence_type: sequence_type,
                    sequence_value: 1,
                    prefix: "Adv"
                }, { transaction });
            } else {
                await counter.increment('sequence_value', { transaction });
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
            throw new InternalServerError('Error generating unique transaction ID');
        }
    }

    // Method to create advance ledger entry with transaction support
    createAdvanceLedger = async (data, transaction) => {
        try {
            const uniqueTransactionId = await this.generateUniqueTransactionId(data.company_id, transaction);

            const recentEntry = await AdvanceLedger.findOne({
                where: { company_id: data.company_id },
                order: [['created_at', 'DESC']],
                transaction
            });

            const previousBalance = recentEntry ? recentEntry.balance : 0;

            let debit = 0;
            let credit = 0;
            let newBalance;

            // Set debit and credit amounts based on the transaction type
            if (data.credit > 0.0) {
                credit = data.amount;
                newBalance = previousBalance + credit;
            } else if (data.debit > 0.0) {
                debit = data.amount;
                newBalance = previousBalance - debit;
            } else {
                throw new InternalServerError('Either credit or debit amount must be greater than 0');
            }

            // Create advance ledger entry
            const advanceLedger = await this.create({
                employee_id: data.employee_id,
                company_id: data.company_id,
                advance_id: data.advance_id, // Use correct field name
                date: data.date,
                description: data.description,
                transaction_id: uniqueTransactionId,
                payment_mode: data.payment_mode,
                debit,
                credit,
                balance: newBalance
            }, transaction);

            let cashLedger = null, bankLedger = null;

            if (advanceLedger) {
                const ledgerData = {
                    company_id: data.company_id,
                    date: data.date,
                    description: data.description,
                    payment_mode: data.payment_mode,
                    transaction_id: advanceLedger.transaction_id,
                    debit: 0,
                    credit: 0
                };

                if (advanceLedger.payment_mode === 'Cash' || advanceLedger.payment_mode === 'Cash on Delivery') {
                    ledgerData.debit = credit; // Reverse credit to debit
                    ledgerData.credit = debit; // Reverse debit to credit
                    cashLedger = await CashLedgerService.createCashLedger(ledgerData, transaction);
                } else if (['Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Online Payment Gateway', 'Mobile Payment'].includes(advanceLedger.payment_mode)) {
                    ledgerData.debit = credit; // Reverse credit to debit
                    ledgerData.credit = debit; // Reverse debit to credit
                    bankLedger = await BankLedgerService.createBankLedger(ledgerData, transaction);
                }
            }

            return { advanceLedger, cashLedger, bankLedger };
        } catch (error) {
            console.error('Error creating advance ledger:', error);
            throw new InternalServerError('Error creating advance ledger');
        }
    }
}

export default new AdvanceLedgerService();