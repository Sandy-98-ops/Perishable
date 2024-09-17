import BaseService from '../base/BaseService.js';
import Party from "../../models/party/Party.js";
import Counter from "../../utils/Counter.js";
import Ledger from "../../models/ledger/Ledger.js";
import LedgerService from "../ledger/LedgerService.js";
import { InternalServerError, BadRequestError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";

class PartyService extends BaseService {
    constructor() {
        super(Party);
    }

    // Method to generate a unique account number
    generateAccountNumber = async (company_id, transaction) => {
        try {
            const sequence_type = 'party';
            let counter = await Counter.findOne({
                where: { company_id, sequence_type },
                transaction
            });

            if (!counter) {
                counter = await Counter.create({
                    company_id,
                    sequence_type,
                    sequence_value: 1
                }, { transaction });
            } else {
                counter = await counter.increment('sequence_value', { transaction });
                counter = await Counter.findOne({
                    where: { company_id, sequence_type },
                    transaction
                });
            }

            if (!counter) {
                throw new InternalServerError('Failed to generate account number');
            }

            return counter.sequence_value;
        } catch (error) {
            console.error('Error generating account number:', error);
            throw new InternalServerError(`Error generating account number: ${error.message}`);
        }
    }

    // Method to create a party and initial ledger entry
    createParty = async (partyData) => {
        if (!partyData || Object.keys(partyData).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            const { company_id, credit_info } = partyData;

            // Generate a sequential account number for the specific company
            const account_no = await this.generateAccountNumber(company_id, transaction);
            partyData.account_no = account_no;

            // Create the party document
            const party = await this.model.create(partyData, { transaction });

            // Create the initial ledger entry if credit_info is provided
            if (credit_info && credit_info.opening_balance !== undefined) {
                await this.createInitialLedgerEntry(company_id, party, credit_info, transaction);
            }

            return party;
        });
    }

    // Method to create the initial ledger entry
    createInitialLedgerEntry = async (companyId, partyDoc, creditInfo, transaction) => {
        try {
            const ledgerEntry = {
                party_id: partyDoc.id,
                company_id: partyDoc.company_id,
                ledger_master: null, // Set to a valid ID or null if not applicable
                date: new Date(),
                description: {
                    'en': 'Initial opening balance',
                    'kn': 'ಪ್ರಾರಂಭಿಕ ಶೇಷ',
                    'mr': 'प्रारंभिक शिल्लक',
                    'hi': 'प्रारंभिक शेष',
                    'te': 'ప్రాథమిక బాలెన్స్'
                },
                transaction_id: await LedgerService.generateUniqueTransactionId(companyId, transaction),
                credit: creditInfo.iPay ? 0 : creditInfo.opening_balance,
                debit: creditInfo.iPay ? creditInfo.opening_balance : 0,
                balance: creditInfo.iPay ? -creditInfo.opening_balance : creditInfo.opening_balance,
                payment_mode: creditInfo.payment_mode || null
            };

            if (!ledgerEntry.date || !ledgerEntry.description) {
                throw new BadRequestError('Ledger entry must include a date and description');
            }

            await Ledger.create(ledgerEntry, { transaction });
        } catch (error) {
            console.error('Error creating initial ledger entry:', error);
            throw new InternalServerError(`Error creating initial ledger entry: ${error.message}`);
        }
    }

    // Method to find party by name
    findPartyByName = async (name) => {
        if (!name || typeof name !== 'string') {
            throw new BadRequestError('Invalid name parameter');
        }

        const party = await Party.findOne({
            where: {
                [Op.or]: [
                    { 'name.en': { [Op.iLike]: `%${name}%` } },
                    { 'name.hi': { [Op.iLike]: `%${name}%` } },
                    { 'name.kn': { [Op.iLike]: `%${name}%` } },
                    { 'name.mr': { [Op.iLike]: `%${name}%` } }
                ]
            }
        });

        if (!party) {
            throw new NotFoundError('Party not found');
        }

        return party;
    }

    // Method to find parties by company
    findPartiesByCompany = async (company_id) => {
        if (!company_id) {
            throw new BadRequestError('Company ID is required');
        }

        return Party.findAll({
            where: { company_id }
        });
    }
}

export default new PartyService();