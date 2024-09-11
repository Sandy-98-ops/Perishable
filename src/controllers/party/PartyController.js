import BaseController from "../../base/BaseController.js";
import PartyService from "../../services/party/PartyService.js";
import { BadRequestError } from "../../utils/errors.js";

class PartyController extends BaseController {
    constructor() {
        super(PartyService);
    }

    // Create a new party
    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const party = await PartyService.createParty(req.body);

            this.handleSuccess(res, 201, party);
        } catch (error) {
            console.error('Error creating party:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve a party by name
    findByName = async (req, res) => {
        try {
            const { name } = req.params;

            if (!name || typeof name !== 'string') {
                throw new BadRequestError('Invalid name parameter');
            }

            const party = await PartyService.findPartyByName(name);

            this.handleSuccess(res, 200, party);
        } catch (error) {
            console.error('Error finding party by name:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve all parties by company
    findByCompany = async (req, res) => {
        try {
            const { company_id } = req.params;

            if (!company_id) {
                throw new BadRequestError('Company ID is required');
            }

            const parties = await PartyService.findPartiesByCompany(company_id);

            this.handleSuccess(res, 200, parties);
        } catch (error) {
            console.error('Error finding parties by company:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve all parties
    findAll = async (req, res) => {
        try {
            const parties = await PartyService.findAll();
            this.handleSuccess(res, 200, parties);
        } catch (error) {
            console.error('Error retrieving parties:', error);
            this.handleError(res, error);
        }
    }

    // Retrieve a party by ID
    findById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Party ID is required');
            }

            const party = await PartyService.findOne(id);

            if (!party) {
                throw new NotFoundError('Party not found');
            }

            this.handleSuccess(res, 200, party);
        } catch (error) {
            console.error('Error retrieving party:', error);
            this.handleError(res, error);
        }
    }

    // Update a party by ID
    update = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Party ID is required');
            }

            const updatedParty = await PartyService.update(id, req.body);

            if (!updatedParty) {
                throw new NotFoundError('Party not found');
            }

            this.handleSuccess(res, 200, updatedParty);
        } catch (error) {
            console.error('Error updating party:', error);
            this.handleError(res, error);
        }
    }

    // Delete a party by ID
    delete = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                throw new BadRequestError('Party ID is required');
            }

            const deletedParty = await PartyService.delete(id);

            if (!deletedParty) {
                throw new NotFoundError('Party not found');
            }

            this.handleSuccess(res, 200, { message: 'Party deleted successfully' });
        } catch (error) {
            console.error('Error deleting party:', error);
            this.handleError(res, error);
        }
    }
}

export default new PartyController();