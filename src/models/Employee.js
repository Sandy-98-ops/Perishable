import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";



const bankAccountSchema = new mongoose.Schema({

    accountNumber: {
        type: String
    },
    routingNumber: {
        type: String
    }
}, { _id: false });

const taxDetailsSchema = new mongoose.Schema({
    taxId: {
        type: String
    },
    exemptions: {
        type: Number
    }
}, { _id: false })

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company"
    },
    employeeId: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    phoneNo: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    hireDate: {
        type: String
    },
    jobTitle: {
        type: String
    },
    department: {
        type: String
    },
    salary: {
        type: Number
    },
    numberofhours: {
        type: Number
    },
    hourlyRate: {
        type: Number
    },
    paymentMethod: {
        type: String
    },
    bankAccount: bankAccountSchema,
    taxDetails: taxDetailsSchema,
});

class Employee extends BaseModel {
    constructor() {
        super("Employee", employeeSchema)
    }
}

export default new Employee();