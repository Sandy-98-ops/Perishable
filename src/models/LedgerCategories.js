import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";


const LedgerCategorySchema = new mongoose.Schema({
    company: {
        type: mongoose.Types.ObjectId,
        ref: 'Company',
    },
    categoryName: {
        type: String,
        required: true,
        minLength: 5,
        unique: true,
        trim: true
    },
    description: {
        type: String,
    },
    referanceId: {
        type: mongoose.Types.ObjectId,
        ref: "LedgerCategories"
    },
    status: {
        type: String,
    }
});

LedgerCategorySchema.index({ company: 1, categoryName: 1 }, { unique: true });
class LedgerCategory extends BaseModel {
    constructor() {
        super("LedgerCategory", LedgerCategorySchema);
    }
}

export default new LedgerCategory()