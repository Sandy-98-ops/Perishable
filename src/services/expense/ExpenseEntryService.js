import BaseService from "../../base/BaseService.js";
import ExpenseEntry from "../../models/expense/ExpenseEntry.js";
import { BadRequestError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";
import ExpenseLedgerService from "../ledger/ExpenseLedgerService.js";


class ExpenseEntryService extends BaseService {
    constructor() {
        super(ExpenseEntry);
    }

    createExpenseEntry = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            try {
                // Create ExpenseEntry within the transaction
                const entry = await this.model.create(data, { transaction });

                // Create ExpenseLedger within the same transaction
                const ledgerData = await ExpenseLedgerService.createExpenseLedger(entry, transaction);

                return { entry, ledgerData };
            } catch (error) {
                console.error('Error creating expense entry:', error);
                throw new InternalServerError('Error creating expense entry');
            }
        });
    };

    findEntriesByCompany = async (companyId) => {
        if (!companyId) {
            throw new BadRequestError('Company ID is required');
        }

        return this.model.findAll({
            where: {
                company: companyId
            }
        });
    };
}

export default new ExpenseEntryService();