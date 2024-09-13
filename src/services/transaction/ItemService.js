import BaseService from "../../base/BaseService.js";
import Item from "../../models/transaction/Item.js";

class ItemService extends BaseService {

    constructor() {
        super(Item)
    }
}

export default new ItemService();