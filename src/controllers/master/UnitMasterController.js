import BaseController from "../base/BaseController.js"; import { BadRequestError } from "../../utils/errors.js";
import UnitMasterService from "../../services/master/UnitMasterService.js";


class UnitMasterController extends BaseController {
    create = async (req, res) => {
        try {
            // TODO: Implement create method
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError("Please enter proper data")
            }

            const unitMaster = await UnitMasterService.create(req.body);

            return this.handleSuccess(res, 201, unitMaster);

        } catch (error) {
            console.log(error)
            this.handleError(res, error);
        }
    }

    findById = async (req, res) => {
        try {
            // TODO: Implement findById method
        } catch (error) {
            this.handleError(res, error);
        }
    }

    findAll = async (req, res) => {
        try {
            // TODO: Implement findAll method
            this.handleSuccess(res, 200, await UnitMasterService.findAll());
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
export default new UnitMasterController()