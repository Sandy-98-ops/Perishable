import mongoose from 'mongoose';
import BaseModel from '../base/BaseModel.js';

const counterSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    sequenceType: {
        type: String,
        required: true
    },
    sequenceValue: {
        type: Number,
        default: 0
    },
    prefix: {
        type: String
    },
    suffix: {
        type: String
    },
    financialYear: {
        type: String
    }
});

counterSchema.index({ companyId: 1, sequenceType: 1 }, { unique: true });


class Counter extends BaseModel {
    constructor() {
        super("Counter", counterSchema);
    }
}

export default new Counter();
