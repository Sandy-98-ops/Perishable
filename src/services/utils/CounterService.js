import BaseService from '../base/BaseService.js';
import Counter from '../../utils/Counter.js'
import { BadRequestError, InternalServerError } from '../../utils/errors.js';
import CompanyService from '../company/CompanyService.js';

class CounterService extends BaseService {

    constructor() {
        super(Counter, 'counter_id')
    }

    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (companyId, sequenceType, prefix, transaction) => {
        try {

            let counter = await this.findOne({ company_id: companyId, sequence_type: sequenceType },
                transaction
            );

            if (!counter) {
                counter = await this.model.create({
                    company_id: companyId,
                    sequence_type: sequenceType,
                    prefix: prefix,
                    sequence_value: 1
                }, { transaction });
            } else {
                counter = await counter.increment('sequence_value', { transaction });
                counter = await this.model.findOne({
                    where: { company_id: companyId, sequence_type: sequenceType },
                    transaction
                });
            }

            if (!counter) {
                throw new InternalServerError('Failed to generate transaction ID');
            }

            return `${counter.prefix}_${counter.sequence_value}`;
        } catch (error) {
            console.error('Error generating unique transaction ID:', error);
            throw new InternalServerError('Error generating unique transaction ID');
        }
    }
}

export default new CounterService();