import BaseController from "../base/BaseController.js";
import Ledger from "../models/Ledger.js";
import LedgerMaster from "../models/LedgerMaster.js";
import LedgerController from "./LedgerController.js";

class LedgerMasterController extends BaseController {
    constructor() {
        super(LedgerMaster)
    }

    create = async (req, res) => {
        try {
            // Validate data before creating
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const document = await LedgerMaster.model.create(req.body);

            // Define the ledger entry
            const ledgerEntry = {
                ledgerMaster: document._id,
                company: req.body.company,
                ledgerId: '66d69b876011e5adde1ef28d',
                ledgerData: [{
                    date: new Date(),
                    transactionId: await LedgerController.generateUniqueTransactionId(req.body.company),
                    credit: 0,
                    debit: 0,
                    balance: 0,
                    description: {
                        'en': 'Initial opening balance',
                        'kn': 'ಪ್ರಾರಂಭಿಕ ಶೇಷ', // Kannada
                        'mr': 'प्रारंभिक शिल्लक', // Marathi
                        'hi': 'प्रारंभिक शेष', // Hindi
                        'te': 'ప్రాథమిక బాలన్స్' // Telugu
                    }
                }]
            }

            await Ledger.model.create(ledgerEntry);

            this.handleSuccess(res, 201, document);

        } catch (error) {
            this.handleError(res, error);
        }
    }
}
export default new LedgerMasterController();