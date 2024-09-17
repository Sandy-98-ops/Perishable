import SubUnitMaster from "../../models/master/SubUnitMaster.js";
import BaseService from "../base/BaseService.js";

class SubUnitMasterService extends BaseService {

    constructor() {
        super(SubUnitMaster, 'sub_unit_master_id')
    }
}

export default new SubUnitMasterService();