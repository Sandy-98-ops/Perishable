import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";

const expenseCategorySchema = new mongoose.Schema({
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company"
    },
    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    maxAmount: {
        type: Number
    }
});

expenseCategorySchema.index({ company: 1 });

class ExpenseCategory extends BaseModel {
    constructor() {
        super("ExpenseCategory", expenseCategorySchema)
    }
}

export default new ExpenseCategory();