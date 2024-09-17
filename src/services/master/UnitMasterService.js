import BaseService from '../base/BaseService.js';
import UnitMaster from "../../models/master/UnitMaster.js";

class UnitMasterService extends BaseService {

    constructor() {
        super(UnitMaster, 'unit_master_id')
    }
}

export default new UnitMasterService();