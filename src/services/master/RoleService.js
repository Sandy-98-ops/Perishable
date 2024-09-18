import Role from "../../models/master/Role.js";
import BaseService from "../base/BaseService.js";

class RoleService extends BaseService {

    constructor() {
        super(Role, 'role_id')
    }
}

export default new RoleService();