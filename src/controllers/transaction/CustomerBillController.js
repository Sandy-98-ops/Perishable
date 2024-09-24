import CustomerBillService from "../../services/transaction/CustomerBillService.js";
import { BadRequestError } from "../../utils/errors.js";
import BaseController from "../base/BaseController.js";

class CustomerBillController extends BaseController {
    create = async (req, res) => {
        try {
            // TODO: Implement create method
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Please Enter proper data');
            }

            this.handleSuccess(res, 201, (await CustomerBillService.create(req.body)));

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findById = async (req, res) => {
        try {
            // TODO: Implement findById method

            this.handleSuccess(res, 200, (await CustomerBillService.findById(req.params.id)));

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findAll = async (req, res) => {
        try {
            // TODO: Implement findAll method

            this.handleSuccess(res, 200, (await CustomerBillService.findAll()));

        } catch (error) {
            this.handleError(res, error);
        }
    }

    findOne = async (req, res) => {
        try {
            // TODO: Implement findAll method

            this.handleSuccess(res, 200, (await CustomerBillService.findOne(/*Query*/)));

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
export default new CustomerBillController();