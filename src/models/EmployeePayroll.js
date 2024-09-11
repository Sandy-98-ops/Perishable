import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";


const payrollItemsSchema = new mongoose.Schema({

    employee: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    baseSalary: {
        type: Number
    },
    hoursWorked: {
        type: Number
    },
    overtimeHours: {
        type: Number
    },
    totalEarnings: {
        type: Number
    },
    taxDeductions: {
        type: Number
    },
    otherDeductions: {
        type: Number
    },
    advancesDeducted: {
        type: Number
    },
    netPay: {
        type: Number
    },
    paymentStatus: {
        type: String
    }
}, { _id: false });

const employeePayrollSchema = new mongoose.Schema({
    payrollDate: {
        type: Date,
        required: true
    },
    payPeriodStart: {
        type: Date,
        required: true
    },
    payPeriodEnd: {
        type: Date,
        required: true
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company"
    },
    payrollItems: payrollItemsSchema
});

class EmployeePayroll extends BaseModel {
    constructor() {
        super("EmployeePayroll", employeePayrollSchema);
    }
}

export default new EmployeePayroll();