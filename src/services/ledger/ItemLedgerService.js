import ItemLedger from "../../models/ledger/ItemLedger.js";
import BaseService from "../base/BaseService.js";

class ItemLedgerService extends BaseService {

    constructor() {
        super(ItemLedger, 'item_ledger_id')
    }

}

export default new ItemLedgerService();