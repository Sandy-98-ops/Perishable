import ChargeService from "../../services/master/ChargeService.js";
import { BadRequestError } from "../../utils/errors.js";
import BaseController from "../base/BaseController.js";

class ChargeController extends BaseController {

    create = async (req, res) => {
        try {

            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Please Enter proper data');
            }

            this.handleSuccess(res, 201, (await ChargeService.create(req.body)));

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findById = async (req, res) => {
        try {
            // TODO: Implement findById method

            this.handleSuccess(res, 200, (await ChargeService.findById(req.params.id)));

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findAll = async (req, res) => {
        try {
            // TODO: Implement findAll method

            this.handleSuccess(res, 200, (await ChargeService.findAll()));

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findOne = async (req, res) => {
        try {
            // TODO: Implement findAll method

            this.handleSuccess(res, 200, (await ChargeService.findOne(/*Query*/)));

        } catch (error) {
            this.handleError(res, error);
        }
    }

    update = async (req, res) => {
        try {
            // TODO: Implement update method
            this.handleSuccess(res, 200, await ChargeService.update(req.params.id, req.body));
        } catch (error) {
            this.handleError(res, error);
        }
    }

    delete = async (req, res) => {
        try {
            // TODO: Implement delete method
            this.handleSuccess(res, 200, await ChargeService.delete(req.params.id))
        } catch (error) {
            this.handleError(res, error);
        }
    }
}
export default new ChargeController();