import BaseService from '../base/BaseService.js';
import LedgerMaster from "../../models/ledger/LedgerMaster.js";
import Ledger from "../../models/ledger/Ledger.js";
import LedgerService from "./LedgerService.js"; // Import LedgerService or similar
import { BadRequestError, InternalServerError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";

class LedgerMasterService extends BaseService {
    constructor() {
        super(LedgerMaster);
    }

    // Create a new LedgerMaster entry and associated Ledger entry
    createLedgerMasterWithLedger = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            // Create LedgerMaster entry within the transaction
            const ledgerMaster = await this.model.create(data, { transaction });

            // Generate a unique transaction ID
            const transactionId = await LedgerService.generateUniqueTransactionId(data.company, transaction);

            // Define the ledger entry
            const ledgerEntry = {
                ledgerMasterId: ledgerMaster.id, // Assuming Sequelize uses id for primary keys
                company: data.company,
                ledgerId: '66d69b876011e5adde1ef28d', // Ensure this ID is valid or generate it
                ledgerData: [{
                    date: new Date(),
                    transactionId,
                    credit: 0,
                    debit: 0,
                    balance: 0,
                    description: {
                        'en': 'Initial opening balance',
                        'kn': 'ಪ್ರಾರಂಭಿಕ ಶೇಷ',
                        'mr': 'प्रारंभिक शिल्लक',
                        'hi': 'प्रारंभिक शेष',
                        'te': 'ప్రాథమిక బాలెన్స్'
                    }
                }]
            };

            // Create Ledger entry within the same transaction
            await Ledger.create(ledgerEntry, { transaction });

            return ledgerMaster;
        });
    }
}

export default new LedgerMasterService();