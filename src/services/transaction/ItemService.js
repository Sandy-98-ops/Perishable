import BaseService from "../base/BaseService.js";
import Item from "../../models/transaction/Item.js";
import { InternalServerError } from "../../utils/errors.js";
import ItemLedgerService from "../ledger/ItemLedgerService.js";
import BatchService from "./BatchService.js";
import { formatDateToDDMMYYYY } from "../../utils/dateUtils.js";

class ItemService extends BaseService {

    constructor() {
        super(Item, 'item_id');
    }

    create = async (data) => {
        try {
            // Create the item
            const item = await this.model.create(data);

            // Format the current date
            const now = new Date();
            const formattedDate = formatDateToDDMMYYYY(now); // Use the utility function

            // Create the batch name
            const batchName = `${item.item_name}_${formattedDate}`;

            // Create the batch
            const batch = await BatchService.create({
                item_id: item.item_id,
                batch_name: batchName,
                initial_stock: 0,
                creation_date: new Date()
            });

            // Create the item ledger
            const itemLedger = await ItemLedgerService.create({
                company_id: item.company_id,
                item_id: item.item_id,
                batch_id: batch.batch_id,
                transaction_type: "Purchase",
                quantity: 1
            });

            return { data: item, batch, itemLedger };

        } catch (error) {
            console.error(error);
            throw new InternalServerError(`Internal Server Error: ${error}`);
        }
    }
}

export default new ItemService();
