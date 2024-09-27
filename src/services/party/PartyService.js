import BaseService from '../base/BaseService.js';
import Party from "../../models/party/Party.js";
import Counter from "../../utils/Counter.js";
import Ledger from "../../models/ledger/Ledger.js";
import LedgerService from "../ledger/LedgerService.js";
import { InternalServerError, BadRequestError, NotFoundError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";
import { Op, ValidationError } from 'sequelize';
import CounterService from '../utils/CounterService.js';
import { formatDatetoDBDate, formatDateToDDMMYYYY } from '../../utils/dateUtils.js';

class PartyService extends BaseService {
    constructor() {
        super(Party, 'party_id');
    }


    // Method to create a party and initial ledger entry
    createParty = async (partyData) => {

        if (!partyData || Object.keys(partyData).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            const { company_id, credit_info } = partyData;

            // Generate a sequential account number for the specific company
            const account_no = await CounterService.generateAccountNumber('party', transaction);
            partyData.account_no = account_no;

            const existingParty = await this.findOne({ phone_no: partyData.phone_no });

            if (existingParty) {
                throw new ValidationError("Phone Number already exists");
            }

            // Create the party document
            const party = await this.create(partyData, transaction);

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
                party_id: partyDoc.party_id,
                company_id: partyDoc.company_id,
                ledger_master: null, // Set to a valid ID or null if not applicable
                date: formatDatetoDBDate(new Date()),
                description: {
                    'en': 'Initial opening balance',
                    'kn': 'ಪ್ರಾರಂಭಿಕ ಶೇಷ',
                    'mr': 'प्रारंभिक शिल्लक',
                    'hi': 'प्रारंभिक शेष',
                    'te': 'ప్రాథమిక బాలెన్స్'
                },
                credit: creditInfo.iPay ? 0 : creditInfo.opening_balance,
                debit: creditInfo.iPay ? creditInfo.opening_balance : 0,
                balance: creditInfo.iPay ? -creditInfo.opening_balance : creditInfo.opening_balance,
                payment_mode: creditInfo.payment_mode || null
            };

            if (!ledgerEntry.date || !ledgerEntry.description) {
                throw new BadRequestError('Ledger entry must include a date and description');
            }

            const noPrototypeObject = Object.assign(Object.create(null), ledgerEntry);


            await LedgerService.create(noPrototypeObject, { transaction });
        } catch (error) {
            console.error('Error creating initial ledger entry:', error);
            throw new InternalServerError(`Error creating initial ledger entry: ${error.message}`);
        }
    }

    findPartyByName = async (name, company_id) => {

        if ((!name || typeof name !== 'string') && !company_id) {
            throw new BadRequestError('Invalid name parameter / Name is not provided / Company id is not provided');
        }

        const party = await this.findAll({ name: { [Op.like]: `%${name}%` }, company_id: company_id });

        if (!party) {
            throw new NotFoundError('Party not found');
        }

        return party;
    };

    findPartyByPhoneNo = async (phone_no, company_id) => {
        return await this.findOne({ phone_no: phone_no, company_id: company_id });
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