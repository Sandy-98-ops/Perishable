import BaseModel from "../base/BaseModel.js";

const userSchemaDefinition = {
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    phoneNo: { type: Number, required: true },
    role: { type: String, default: 'user' } // Add a role field
    // other fields...
};

class User extends BaseModel {
    constructor() {
        super('User', userSchemaDefinition);
    }
}

export default new User();