import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";


const ledgerMasterSchema = new mongoose.Schema({
    ledgerCategory: {
        type: mongoose.Types.ObjectId,
        ref: 'LedgerCategories',
        required: true
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    ledgerName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 4
    },
    code: { // Fixed code for identifying the Cash Ledger
        type: String,
        required: true,
        unique: true, // Ensures the code is unique,
        minLength: 5
    },
    status: {
        type: String
    }
});

class LedgerMaster extends BaseModel {
    constructor() {
        super("LedgerMaster", ledgerMasterSchema);
    }
}

export default new LedgerMaster();