import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";

const expenseCollectionSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company"
    },
    category: {
        type: mongoose.Types.ObjectId,
        ref: "ExpenseCategories",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    receipt: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    approver: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    approved: {
        type: Boolean
    }
});

class ExpenseCollection extends BaseModel {
    constructor() {
        super("ExpenseCollection", expenseCollectionSchema)
    }
};

export default new ExpenseCollection();

