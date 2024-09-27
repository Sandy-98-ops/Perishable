import BaseService from '../base/BaseService.js';
import Counter from '../../utils/Counter.js'
import { InternalServerError } from '../../utils/errors.js';
import { getCurrentUser } from '../../utils/context.js';

class CounterService extends BaseService {

    constructor() {
        super(Counter, 'counter_id')
    }

    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (companyId, sequenceType, prefix, transaction, includeCompanyId = true) => {

        const currentUser = getCurrentUser();
        companyId = currentUser?.company_id;

        let counter = await this.findOne({ sequence_type: sequenceType }, [], includeCompanyId);

        if (!counter) {
            counter = await this.create({
                sequence_type: sequenceType,
                prefix: prefix,
                sequence_value: 1
            }, transaction, includeCompanyId);
        } else {
            counter = await counter.increment('sequence_value', { transaction });
            counter = await this.findOne(
                { sequence_type: sequenceType }, [], includeCompanyId
            );
        }

        if (!counter) {
            throw new InternalServerError('Failed to generate transaction ID');
        }

        return `${counter.prefix}_${counter.sequence_value}`;
    }

    // Method to generate a unique account number
    generateAccountNumber = async (sequence_type, transaction) => {
        try {
            let counter = await this.findOne({ sequence_type });

            if (!counter) {
                counter = await this.create({
                    sequence_type,
                    sequence_value: 1
                }, transaction);
            } else {
                counter = await counter.increment('sequence_value', { transaction });
                counter = await this.findOne({ sequence_type });
            }

            if (!counter) {
                throw new InternalServerError('Failed to generate account number');
            }

            return counter.sequence_value;
        } catch (error) {
            console.error('Error generating account number:', error);
            throw new InternalServerError(`Error generating account number: ${error.message}`);
        }
    }

}

export default new CounterService();