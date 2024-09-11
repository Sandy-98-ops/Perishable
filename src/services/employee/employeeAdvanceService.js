import BaseService from "../../base/BaseService.js";
import EmployeeAdvance from "../../models/employee/EmployeeAdvance.js";
import { withTransaction } from "../../utils/transactionHelper.js";

class EmployeeAdvanceService extends BaseService {
    constructor() {
        super(EmployeeAdvance);
    }

    // Override create method to include transaction and additional logic
    create = async (data) => {
        return withTransaction(async (transaction) => {
            const advance = await this.model.create(data, { transaction });
            await AdvanceLedgerService.createAdvanceLedger(advance, transaction); // Call to ledger service
            return advance;
        });
    }

    // Custom method to find by company
    findByCompany = async (companyId) => {
        return this.model.findAll({ where: { company_id: companyId } });
    }
}

export default new EmployeeAdvanceService();
