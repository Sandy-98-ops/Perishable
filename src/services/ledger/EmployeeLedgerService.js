import BaseService from "../../base/BaseService.js";
import EmployeeLedger from "../../models/ledger/EmployeeLedger.js";
import Counter from "../../utils/Counter.js";
import CounterService from "../utils/CounterService.js";

class EmployeeLedgerService extends BaseService {

    constructor() {
        super(EmployeeLedger, 'employee_ledger_id')
    }

    // Method to generate unique transaction ID
    generateUniqueTransactionId = async (company_id, transaction) => {
        try {
            const sequence_type = 'employee_ledger';
            let counter = await CounterService.findOne({ company_id, sequence_type });

            if (!counter) {
                counter = await CounterService.create({
                    company_id,
                    sequence_type,
                    sequence_value: 1,
                    prefix: "Emp_Ledger"
                }, { transaction });
            } else {
                await counter.increment('sequence_value', { transaction });
                counter = await CounterService.findOne({ company_id, sequence_type });
            }

            if (!counter) {
                throw new InternalServerError('Failed to generate transaction ID');
            }

            return `${counter.prefix}${counter.sequence_value}`;
        } catch (error) {
            console.error('Error generating unique transaction ID:', error);
            throw new InternalServerError(`Error generating unique transaction ID: ${error.message}`);
        }
    }

}

export default new EmployeeLedgerService();