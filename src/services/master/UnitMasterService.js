import BaseService from "../../base/BaseService.js";
import UnitMaster from "../../models/master/UnitMaster.js";

class UnitMasterService extends BaseService {

    constructor() {
        super(UnitMaster)
    }
}

export default new UnitMasterService();