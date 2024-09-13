import BaseController from "../../base/BaseController.js";
import ItemCategoryService from "../../services/master/ItemCategoryService.js";
import { BadRequestError } from "../../utils/errors.js";


class ItemCategoryController extends BaseController {

    create = async (req, res) => {
        try {
            // TODO: Implement create method
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError("Please Enter Proper Data")
            }

            const itemCategory = await ItemCategoryService.create(req.body);

            this.handleSuccess(res, 201, itemCategory);

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findById = async (req, res) => {
        try {
            // TODO: Implement findById method

            const itemCategory = await ItemCategoryService.findById(req.params.id);

            this.handleSuccess(res, 201, itemCategory);

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findAll = async (req, res) => {
        try {
            // TODO: Implement findAll method
        } catch (error) {
            this.handleError(res, error);
        }
    }

    update = async (req, res) => {
        try {
            // TODO: Implement update method

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError("Please Enter Proper Data")
            }

            const itemCategory = await ItemCategoryService.update(req.params.id, req.body);

            this.handleSuccess(res, 201, itemCategory);
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

export default new ItemCategoryController();