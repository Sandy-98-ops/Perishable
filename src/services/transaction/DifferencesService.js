import Differences from "../../models/transaction/Differences.js";
import BaseService from "../base/BaseService.js";

class DifferencesService extends BaseService {

    constructor() {
        super(Differences, "difference_id");
    }
}

export default new DifferencesService();