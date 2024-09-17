import BaseService from '../base/BaseService.js';
import ExpenseEntry from "../../models/expense/ExpenseEntry.js";
import ExpenseLedgerService from "../ledger/ExpenseLedgerService.js";
import { BadRequestError, InternalServerError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";

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
                throw new InternalServerError(`Error creating expense entry: ${error.message}`);
            }
        });
    };

    findEntriesByCompany = async (companyId) => {
        if (!companyId) {
            throw new BadRequestError('Company ID is required');
        }

        return this.model.findAll({
            where: { company_id: companyId }
        });
    };

    updateExpenseEntry = async (id, updateData) => {
        if (!id || !updateData || Object.keys(updateData).length === 0) {
            throw new BadRequestError('Invalid data provided or Entry ID is required');
        }

        return withTransaction(async (transaction) => {
            try {
                // Fetch the existing expense entry
                const existingEntry = await this.model.findOne({
                    where: { id },
                    transaction
                });

                if (!existingEntry) {
                    throw new BadRequestError('Expense entry not found');
                }

                // Update the expense entry
                const updatedEntry = await existingEntry.update(updateData, { transaction });

                // Update the related expense ledger
                const updatedLedgerData = await ExpenseLedgerService.updateExpenseLedger(
                    updatedEntry.id,
                    updatedEntry.company_id,
                    updateData,
                    transaction
                );

                return { updatedEntry, updatedLedgerData };
            } catch (error) {
                console.error('Error updating expense entry:', error);
                throw new InternalServerError(`Error updating expense entry: ${error.message}`);
            }
        });
    };
}

export default new ExpenseEntryService();