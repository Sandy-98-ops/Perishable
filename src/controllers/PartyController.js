import BaseController from "../base/BaseController.js";
import Counter from "../models/Counter.js";
import Ledger from "../models/Ledger.js";
import Party from "../models/Party.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/errors.js";
import LedgerController from "./LedgerController.js";

class PartyController extends BaseController {
    constructor() {
        super(Party);
    }

    create = async (req, res) => {
        try {
            // Validate data before creating
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const { companyId, openingBalance } = req.body; // Extract openingBalance from request body
            if (!companyId) {
                throw new BadRequestError('Company ID is required');
            }

            // Determine the sequence type for accountNo
            const sequenceType = 'party';

            // Generate a sequential accountNo for the specific company
            const counter = await Counter.model.findOneAndUpdate(
                { companyId: companyId, sequenceType: sequenceType },
                { $inc: { sequenceValue: 1 } },
                { new: true, upsert: true }
            );

            if (!counter) {
                throw new InternalServerError('Failed to generate accountNo');
            }

            req.body.accountNo = counter.sequenceValue;
            req.body.companyId = companyId; // Ensure companyId is included

            // Create the party document
            const document = await Party.model.create(req.body);

            // Create the initial ledger entry with the opening balance
            if (req.body.creditInfo.openingBalance !== undefined) {
                await this.createInitialLedgerEntry(companyId, document);
            }

            this.handleSuccess(res, 201, document);
        } catch (error) {
            this.handleError(res, error);
        }
    }

    // Method to create the initial ledger entry
    createInitialLedgerEntry = async (companyId, document) => {
        try {

            // Define the ledger entry
            const ledgerEntry = {
                party: document._id,
                company: document.companyId,
                ledgerCategory: '66d69b876011e5adde1ef28d',
                ledgerData: [{
                    date: new Date(),
                    transactionId: await LedgerController.generateUniqueTransactionId(companyId),
                    credit: 0,
                    debit: 0,
                    balance: document.creditInfo.iPay ? -document.creditInfo.openingBalance : document.creditInfo.openingBalance,
                    description: {
                        'en': 'Initial opening balance',
                        'kn': 'ಪ್ರಾರಂಭಿಕ ಶೇಷ', // Kannada
                        'mr': 'प्रारंभिक शिल्लक', // Marathi
                        'hi': 'प्रारंभिक शेष', // Hindi
                        'te': 'ప్రాథమిక బాలన్స్' // Telugu
                    }
                }]
            };

            if (document.creditInfo.iPay) {
                ledgerEntry.ledgerData[0].debit = -document.creditInfo.openingBalance;
            } else {
                ledgerEntry.ledgerData[0].credit = document.creditInfo.openingBalance;
            }

            // Create the ledger document
            await Ledger.model.create(ledgerEntry);
        } catch (error) {
            console.error('Error creating initial ledger entry:', error);
            throw new InternalServerError('Error creating initial ledger entry');
        }
    }

    async findByName(req, res) {
        try {
            const { name } = req.params;

            if (!name || typeof name !== 'string') {
                throw new BadRequestError('Invalid name parameter');
            }

            const query = {
                $or: [
                    { 'name.en': { $regex: name, $options: 'i' } },
                    { 'name.hi': { $regex: name, $options: 'i' } },
                    { 'name.kn': { $regex: name, $options: 'i' } },
                    { 'name.mr': { $regex: name, $options: 'i' } }
                ]
            };

            const party = await this.model.findOne(query);

            if (!party) {
                throw new NotFoundError('Document not found');
            }

            res.json(party);
        } catch (error) {
            console.error('Error finding party by name:', error);
            this.handleError(res, error);
        }
    }

    async findByCompany(req, res) {
        try {
            const { company } = req.params;

            res.json(await Party.find({ companyId: company }));

        } catch (error) {
            console.error('Error finding party by company:', error);
            this.handleError(res, error);
        }
    }
}

export default new PartyController();
