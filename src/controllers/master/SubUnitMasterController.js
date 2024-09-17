import SubUnitMasterService from "../../services/master/SubUnitMasterService.js";
import BaseController from "../base/BaseController.js";

class SubUnitMasterController extends BaseController {
    create = async (req, res) => {
        try {
            // TODO: Implement create method
            if (!req.body || Object.keys(req.body).length === 0) {

            }

            const subUnitMaster = await SubUnitMasterService.create(req.body);

            this.handleSuccess(res, 201, subUnitMaster);

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findById = async (req, res) => {
        try {
            // TODO: Implement findById method
            this.handleSuccess(res, 200, (await SubUnitMasterService.findById(req.params.id)));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    findAll = async (req, res) => {
        try {
            // TODO: Implement findAll method
            this.handleSuccess(res, 200, (await SubUnitMasterService.findAll()));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    update = async (req, res) => {
        try {
            // TODO: Implement update method
        } catch (error) {
            this.handleError(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            // TODO: Implement delete method
        } catch (error) {
            this.handleError(res, error);
        }
    }
}
export default new SubUnitMasterController();