import BaseService from '../base/BaseService.js';
import PAYMENT_MODES from "../../constants/paymentModes.js";
import Ledger from "../../models/ledger/Ledger.js";
import Counter from "../../utils/Counter.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";

class LedgerService extends BaseService{
    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (company_id, transaction) => {
        try {
            const sequence_type = 'ledger';

            let counter = await Counter.findOne({
                where: { company_id, sequence_type },
                transaction
            });

            if (!counter) {
                counter = await Counter.create({
                    company_id,
                    sequence_type,
                    prefix: 'TXN',
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

    // Create a new ledger entry
    create = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            const { company, credit, debit, paymentMode } = data;
            const uniqueTransactionId = await this.generateUniqueTransactionId(company, transaction);

            const previousBalance = 0; // Fetch the actual previous balance if necessary
            const newBalance = previousBalance + (credit || 0) - (debit || 0);

            const validatedPaymentMode = PAYMENT_MODES.includes(paymentMode) ? paymentMode : null;

            return await Ledger.create({
                ...data,
                transactionId: uniqueTransactionId,
                paymentMode: validatedPaymentMode,
                balance: newBalance
            }, { transaction });
        });
    }

    // Find a ledger record by ID
    findById = async (id) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        const ledger = await Ledger.findOne({ where: { id } });

        if (!ledger) {
            throw new NotFoundError('Ledger record not found');
        }

        return ledger;
    }

    // Find ledger records by party
    findLedgerByParty = async (party) => {
        if (!party) {
            throw new BadRequestError('Party is required');
        }

        const ledgers = await Ledger.findAll({
            where: { party }
        });

        if (ledgers.length === 0) {
            throw new NotFoundError('No ledger records found for the given party');
        }

        return ledgers;
    }

    // Find all ledger records with optional query parameters
    findAll = async (query = {}) => {
        return Ledger.findAll({ where: query });
    }

    // Update a ledger record by ID
    update = async (id, data) => {
        if (!id || !data || Object.keys(data).length === 0) {
            throw new BadRequestError('ID and data are required');
        }

        const [affectedRows] = await Ledger.update(data, {
            where: { id }
        });

        if (affectedRows === 0) {
            throw new NotFoundError('Ledger record not found');
        }

        return { message: 'Ledger record updated successfully' };
    }

    // Delete a ledger record by ID
    delete = async (id) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        const deletedRows = await Ledger.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw new NotFoundError('Ledger record not found');
        }

        return { message: 'Ledger record deleted successfully' };
    }
}

export default new LedgerService();