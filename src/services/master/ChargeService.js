import Charge from "../../models/master/Charge.js";
import BaseService from "../base/BaseService.js";

class ChargeService extends BaseService {

    constructor() {
        super(Charge, 'charge_id')
    }
}

export default new ChargeService();