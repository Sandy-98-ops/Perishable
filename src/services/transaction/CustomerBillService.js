import CustomerBill from "../../models/transaction/CustomerBill.js";
import { InternalServerError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";
import BaseService from "../base/BaseService.js";
import CounterService from "../utils/CounterService.js";

class CustomerBillService extends BaseService {

    constructor() {
        super(CustomerBill, 'customer_bill_id')
    }

    create = async (data) => {

        try {

            return withTransaction(async (transaction) => {
                const counter = await CounterService.generateUniqueTransactionId(data.company_id, 'customer_bill', 'cust_bill_no', transaction);

                data.bill_number = counter;

                const cb = await this.model.create(data, { transaction });

                return cb;

            });
        } catch (error) {
            console.log(error)
            throw new InternalServerError(error);
        }

    }
}

export default new CustomerBillService();