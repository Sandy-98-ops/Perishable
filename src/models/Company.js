import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";

// Define the schema for bank account details
const bankAccountSchema = new mongoose.Schema({
    accountNo: {
        type: String,
        trim: true
    },
    holderName: {
        type: String,
        trim: true
    },
    ifsc: {
        type: String,
        trim: true
    },
    branch: {
        type: String,
        trim: true
    }
}, { _id: false });

// Define the schema for address details
const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    postal_Code: {
        type: Number,
        min: [100000, 'Postal code must be at least 6 digits']
    },
    country: {
        type: String,
        trim: true
    }
}, { _id: false });

// Define the schema for the company
const companySchema = new mongoose.Schema({
    companyId: {
        type: String,
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    gstNo: {
        type: String,
        trim: true
    },
    panNo: {
        type: String,
        trim: true
    },
    industryType: {
        type: String,
        trim: true
    },
    businessType: {
        type: String,
        trim: true
    },
    bankAccount: bankAccountSchema,
    address: addressSchema,
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        trim: true
    },
    currency: {
        type: String,
        trim: true
    },
    planId: {
        type: String,
    },
    digitalSign: {
        type: String,
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt timestamps
});

// Add indexes for frequently queried fields
companySchema.index({ companyId: 1 });
// Define and export the Company model
class Company extends BaseModel {
    constructor() {
        super("Company", companySchema);
    }
}

export default new Company();
