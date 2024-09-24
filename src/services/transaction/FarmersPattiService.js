import FarmersPatti from "../../models/transaction/FarmersPatti.js";
import { InternalServerError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";
import BaseService from "../base/BaseService.js";
import CounterService from "../utils/CounterService.js";

class FarmersPattiService extends BaseService {

    constructor() {
        super(FarmersPatti, "farmers_Patti_id")
    }

    create = async (data) => {

        try {
            return await withTransaction(async (transaction) => {

                const counter = await CounterService.generateUniqueTransactionId(data.company_id, 'Farmers_Patti_No', 'bill_no', transaction);

                data.bill_number = counter;

                const fp = await this.model.create(data);

                return fp;
            });

        } catch (error) {
            throw InternalServerError(error);
        }

    }
}

export default new FarmersPattiService();