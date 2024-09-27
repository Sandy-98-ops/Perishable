import Role from "../../models/master/Role.js";
import BaseService from "../base/BaseService.js";

class RoleService extends BaseService {

    constructor() {
        super(Role, 'role_id')
    }

    create = async (data) => {
        return await this.model.create(data);
    }

    findById = async (id) => {
        return await Role.findByPk(id);
    }

    update = async (id, data) => {
        return await this.model.update(data, { where: { role_id: data.role_id } });
    }

    delete = async (id) => {
        return await Role.destroy(id);
    }
}

export default new RoleService();