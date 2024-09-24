import Inward from "../../models/transaction/Inward.js";
import BaseService from "../base/BaseService.js";

class InwardService extends BaseService {

    constructor() {
        super(Inward, 'inward_id')
    }
}

export default new InwardService();