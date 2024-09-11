import mongoose from 'mongoose';
import BaseModel from '../base/BaseModel.js';
import { validatePhoneNumber } from '../utils/validateModels.js';

// Define the schema for business details
const businessDetailsSchema = new mongoose.Schema({
    gstNo: {
        type: String,
        trim: true
    },
    panNo: {
        type: String,
        trim: true
    }
}, { _id: false });

// Define the schema for credit information
const creditInfoSchema = new mongoose.Schema({
    openingBalance: {
        type: Number,
        required: true
    },
    iPay: {
        type: Boolean
    },
    iReceive: {
        type: Boolean
    },
    creditPeriod: {
        type: Number
    },
    creditLimit: {
        type: Number,
        required: true
    }
}, { _id: false });

// Define the party schema
const partySchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Types.ObjectId,
        ref: "Company",
        required: true
    },
    name: {
        type: Map,
        of: String, // Allows multiple language entries
        required: true
    },
    phoneNo: {
        type: String, // Use String for phone numbers to handle leading zeros and non-numeric characters
        required: true,
        validate: [validatePhoneNumber, 'Invalid phone number format.']
    },
    partyType: {
        type: String,
        required: true
    },
    accountNo: {
        type: String,
        trim: true
    },
    businessDetails: businessDetailsSchema,
    creditInfo: creditInfoSchema,
    category: {
        type: String,
        required: true
    },
    categoryName: {
        type: Map,
        of: String // Allows multiple language entries
    },
    photo: {
        type: String
    },
    address: {
        type: Map,
        of: String // Allows multiple language entries
    },
    state: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    customField: {
        type: Map,
        of: String // Allows multiple language entries
    }
}, { timestamps: true }); // Add timestamps to the schema

// Add indexes
partySchema.index({ companyId: 1 }); // Index on companyId
partySchema.index({ companyId: 1, phoneNo: 1 }); // Composite index on companyId and phoneNo
partySchema.index({ companyId: 1, accountNo: 1 }); // Composite index on companyId and accountNo
partySchema.index({ companyId: 1, name: 1 }); // Composite index on companyId and name
partySchema.index({ companyId: 1, phoneNo: 1 }, { unique: true })
// Define the Party model class
class Party extends BaseModel {
    constructor() {
        super("Party", partySchema);
    }
}

// Export an instance of the Party model
export default new Party();
