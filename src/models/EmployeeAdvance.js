import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";


const repaymentTermsSchema = new mongoose.Schema({
    frequency: {
        type: String
    },
    amountPerPaycheck: {
        type: Number
    }
}, { _id: false });


const employeeAdvanceSchema = new mongoose.Schema({

    employee: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company"
    },
    advanceAmount: {
        type: Number,
        required: true
    },
    advanceDate: {
        type: Date,
        required: true
    },
    repaymentStartDate: {
        type: Date,
        required: true
    },
    repaymentTerms: repaymentTermsSchema,
    remainingBalance: {
        type: Number
    },
    status: {
        type: String
    }
});

class EmployeeAdvance extends BaseModel {
    constructor() {
        super("EmployeeAdvance", employeeAdvanceSchema);
    }
};

export default new EmployeeAdvance();