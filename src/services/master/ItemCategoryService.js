import BaseService from "../../base/BaseService.js";
import ItemCategory from "../../models/master/ItemCategory.js";


class ItemCategoryService extends BaseService {
    constructor() {
        super(ItemCategory, "item_category_id")
    }


}

export default new ItemCategoryService();