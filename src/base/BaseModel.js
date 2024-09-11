import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Adjust the import based on your project structure

class BaseModel extends Model {
    // Method to create a record
    static async createRecord(data, options = {}) {
        try {
            const record = await this.create(data, options);
            return record;
        } catch (error) {
            throw error;
        }
    }

    // Method to find all records
    static async findAllRecords(query, options = {}) {
        try {
            const records = await this.findAll({ where: query, ...options });
            return records;
        } catch (error) {
            throw error;
        }
    }

    // Method to find a single record
    static async findOneRecord(query, options = {}) {
        try {
            const record = await this.findOne({ where: query, ...options });
            return record;
        } catch (error) {
            throw error;
        }
    }

    // Method to update a record
    static async updateRecord(id, data, options = {}) {
        try {
            const [updated] = await this.update(data, {
                where: { id },
                ...options
            });
            return updated;
        } catch (error) {
            throw error;
        }
    }

    // Method to delete a record
    static async deleteRecord(id, options = {}) {
        try {
            const deleted = await this.destroy({
                where: { id },
                ...options
            });
            return deleted;
        } catch (error) {
            throw error;
        }
    }

    // Method to create a record within a transaction
    static async createWithTransaction(data, transaction) {
        try {
            const record = await this.create(data, { transaction });
            return record;
        } catch (error) {
            throw error;
        }
    }

    // Method to find all records within a transaction
    static async findAllWithTransaction(query, options = {}, transaction) {
        try {
            const records = await this.findAll({ where: query, ...options, transaction });
            return records;
        } catch (error) {
            throw error;
        }
    }

    // Method to find one record within a transaction
    static async findOneWithTransaction(query, options = {}, transaction) {
        try {
            const record = await this.findOne({ where: query, ...options, transaction });
            return record;
        } catch (error) {
            throw error;
        }
    }

    // Method to update a record within a transaction
    static async updateWithTransaction(id, data, transaction) {
        try {
            const [updated] = await this.update(data, {
                where: { id },
                transaction
            });
            return updated;
        } catch (error) {
            throw error;
        }
    }

    // Method to delete a record within a transaction
    static async deleteWithTransaction(id, transaction) {
        try {
            const deleted = await this.destroy({
                where: { id },
                transaction
            });
            return deleted;
        } catch (error) {
            throw error;
        }
    }
}

export default BaseModel;
