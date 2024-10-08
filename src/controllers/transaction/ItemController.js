import BaseController from "../base/BaseController.js"; import ItemService from "../../services/transaction/ItemService.js";
import { BadRequestError } from "../../utils/errors.js";

class ItemController extends BaseController {
    create = async (req, res) => {
        try {
            // TODO: Implement create method
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError("Please enter proper data")
            }

            const item = await ItemService.create(req.body);

            this.handleSuccess(res, 201, item);

        } catch (error) {
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
            this.handleSuccess(res, 200, (await ItemService.findAll()));
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
export default new ItemController();