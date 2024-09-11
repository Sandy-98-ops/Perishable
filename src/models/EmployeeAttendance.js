import mongoose from "mongoose";
import BaseModel from "../base/BaseModel.js";


const employeeAttendanceSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Employee"
    },
    company: {
        type: mongoose.Types.ObjectId,
        ref: "Company"
    },
    date: {
        type: Date,
        required: true
    },
    hoursWorked: {
        type: Number,
        required: true
    },
    overtimeHours: {
        type: Number
    },
    description: {
        type: String
    }
});

class EmployeeAttendance extends BaseModel {
    constructor() {
        super("EmployeeAttendance", employeeAttendanceSchema);
    }
}

export default new EmployeeAttendance();