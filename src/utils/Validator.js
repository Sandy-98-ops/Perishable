import { BadRequestError, ValidationError } from "./errors";

class Validator {

    static validateCreate(data) {
        if (!data) {
            throw new ValidationError('Data is required for creation.');
        }
        // Base validation logic for creation
    }

    static validateRead(query) {
        if (query && typeof query !== 'object') {
            throw new BadRequestError('Invalid query parameters.');
        }
        // Base validation logic for reading
    }

    static validateUpdate(id, data) {
        if (!id) {
            throw new BadRequestError('ID is required for update.');
        }
        if (!data) {
            throw new BadRequestError('Update data is required.');
        }
        // Base validation logic for updating
    }

    static validateDelete(id) {
        if (!id) {
            throw new BadRequestError('ID is required for deletion.');
        }
        // Base validation logic for deletion
    }

}

export default Validator;
