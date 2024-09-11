import BaseService from '../../base/BaseService.js';
import AdvanceLedger from '../../models/ledger/AdvanceLedger.js';
import Counter from '../../models/utils/Counter.js';
import { InternalServerError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';
import BankLedgerService from './BankLedgerService.js';
import CashLedgerService from './CashLedgerService.js';

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
            throw new InternalServerError('Error generating unique transaction ID');
        }
    }

    // Method to create advance ledger entry with transaction support
    createAdvanceLedger = async (data) => {
        return withTransaction(async (transaction) => {
            try {
                const uniqueTransactionId = await this.generateUniqueTransactionId(data.company_id, transaction);

                const recentEntry = await AdvanceLedger.findOne({
                    where: { company_id: data.company_id },
                    order: [['createdAt', 'DESC']],
                    transaction
                });

                const previousBalance = recentEntry ? recentEntry.balance : 0;
                const newBalance = previousBalance + data.amount;

                const advanceLedger = await AdvanceLedger.create({
                    company_id: data.company_id,
                    advance_id: data.id,
                    date: data.advanceDate,
                    description: data.description,
                    transaction_id: uniqueTransactionId,
                    payment_mode: data.payment_mode,
                    debit: 0,
                    credit: data.amount,
                    balance: newBalance
                }, { transaction });

                let cashLedger = null, bankLedger = null;
                if (advanceLedger) {
                    if (advanceLedger.payment_mode === 'Cash' || advanceLedger.payment_mode === 'Cash on Delivery') {
                        cashLedger = await CashLedgerService.createCashLedger({
                            company_id: data.company_id,
                            date: data.advanceDate,
                            description: data.description,
                            payment_mode: data.payment_mode,
                            debit: data.amount,
                            credit: 0
                        }, transaction);

                    } else if (advanceLedger.payment_mode === 'Credit Card' || advanceLedger.payment_mode === 'Debit Card'
                        || advanceLedger.payment_mode === 'Bank Transfer' || advanceLedger.payment_mode === 'Cheque'
                        || advanceLedger.payment_mode === 'Online Payment Gateway' || advanceLedger.payment_mode === 'Mobile Payment'
                    ) {
                        bankLedger = await BankLedgerService.createBankLedger({
                            company_id: data.company_id,
                            date: data.advanceDate,
                            description: data.description,
                            payment_mode: data.payment_mode,
                            debit: data.amount,
                            credit: 0
                        }, transaction);
                    }
                }

                return { advanceLedger, cashLedger, bankLedger };
            } catch (error) {
                console.error('Error creating advance ledger:', error);
                throw new InternalServerError('Error creating advance ledger');
            }
        });
    }
}

export default new AdvanceLedgerService();