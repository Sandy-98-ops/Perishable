import BaseService from "../../base/BaseService.js";
import Batch from "../../models/transaction/Batch.js";

class BatchService extends BaseService {

    constructor() {
        super(Batch)
    }
}

export default new BatchService();