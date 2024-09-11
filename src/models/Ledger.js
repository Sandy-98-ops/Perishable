import mongoose from 'mongoose';
import BaseModel from '../base/BaseModel.js';
import PAYMENT_MODES from '../constants/paymentModes.js';

// Define the schema for metaData
const metaDataSchema = new mongoose.Schema({
    invoiceNo: { type: String, trim: true },
    receiptNo: { type: String, trim: true },
    purchaseNo: { type: String, trim: true },
    paymentNo: { type: String, trim: true },
    creditNote: { type: String, trim: true },
    debitNote: { type: String, trim: true },
    saleReturn: { type: String, trim: true },
    purchaseReturn: { type: String, trim: true }
}, { _id: false });

// Define the schema for the ledger data
const ledgerDataSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: {
        type: Map,
        of: String, // Allows multiple language entries
        required: true
    },
    transactionId: { type: String, trim: true },
    paymentMode: {
        type: String,
        enum: PAYMENT_MODES,
        trim: true
    },
    credit: { type: Number, default: 0 },
    debit: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    metaData: metaDataSchema
}, { _id: false });

// Define the schema for the ledger
const ledgerSchema = new mongoose.Schema({
    company: { type: mongoose.Types.ObjectId, ref: 'Company', required: true },
    party: { type: mongoose.Types.ObjectId, ref: 'Party' },
    ledgerMaster: { type: mongoose.Schema.Types.String, ref: "LedgerMaster" },
    ledgerData: [ledgerDataSchema]
});

// Add indexes
ledgerSchema.index({ 'ledgerData.metaData.invoiceNo': 1 }); // Index on invoiceNo
ledgerSchema.index({ 'ledgerData.metaData.receiptNo': 1 }); // Index on receiptNo
ledgerSchema.index({ 'ledgerData.metaData.purchaseNo': 1 }); // Index on purchaseNo
ledgerSchema.index({ 'ledgerData.metaData.paymentNo': 1 }); // Index on paymentNo
ledgerSchema.index({ 'ledgerData.transactionId': 1 }); // Index on transactionId

class Ledger extends BaseModel {
    constructor() {
        super("Ledger", ledgerSchema);
    }
}

export default new Ledger();
