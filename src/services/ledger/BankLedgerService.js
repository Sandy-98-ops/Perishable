import BaseService from '../../base/BaseService.js';
import BankLedger from '../../models/ledger/BankLedger.js';
import Counter from '../../models/utils/Counter.js';
import { InternalServerError } from '../../utils/errors.js';
import { withTransaction } from '../../utils/transactionHelper.js';

class BankLedgerService extends BaseService {
    constructor() {
        super(BankLedger);
    }

    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (company_id, transaction) => {
        try {
            const sequence_type = 'bank_transaction';

            let counter = await Counter.findOne({
                where: { company_id, sequence_type },
                transaction
            });

            if (!counter) {
                counter = await Counter.create({
                    company_id: company_id,
                    sequence_type: sequence_type,
                    prefix: 'BANK',
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

            return `${counter.prefix}-${counter.sequence_value}`;
        } catch (error) {
            console.error('Error generating unique transaction ID:', error);
            throw new InternalServerError('Error generating unique transaction ID');
        }
    }

    // Overridden create method with transaction support
    create = async (data) => {
        return withTransaction(async (transaction) => {
            try {
                const uniqueTransactionId = await this.generateUniqueTransactionId(data.company_id, transaction);

                const recentEntry = await BankLedger.findOne({
                    where: { company_id: data.company_id },
                    order: [['createdAt', 'DESC']],
                    transaction
                });

                const previousBalance = recentEntry ? recentEntry.balance : 0;

                let newBalance = 0;
                if (data.debit > 0) {
                    newBalance = previousBalance - data.debit;
                } else {
                    newBalance = previousBalance + data.credit;
                }

                const bankLedger = await BankLedger.create({
                    company_id: data.company_id,
                    date: data.date,
                    description: data.description,
                    transaction_id: uniqueTransactionId,
                    payment_mode: data.payment_mode,
                    credit: data.credit,
                    debit: data.debit,
                    balance: newBalance
                }, { transaction });

                return bankLedger;
            } catch (error) {
                console.error('Error creating bank ledger:', error);
                throw new InternalServerError('Error creating bank ledger');
            }
        });
    }
}

export default new BankLedgerService();