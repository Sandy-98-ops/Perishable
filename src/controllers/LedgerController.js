// controllers/LedgerController.js
import BaseController from "../base/BaseController.js";
import Ledger from "../models/Ledger.js";
import Counter from '../models/Counter.js';
import { BadRequestError, NotFoundError, InternalServerError } from '../utils/errors.js';
import mongoose from "mongoose";
import { toObjectId, validateObjectId } from "../utils/validateModels.js";

class LedgerController extends BaseController {
    constructor() {
        super(Ledger);
    }

    create = async (req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                throw new BadRequestError('Invalid data provided');
            }

            const { company, party, ledgerData } = req.body;

            let ledger = await this.model.findOne({ party });

            if (ledger) {
                const existingTransactionIds = ledger.ledgerData.map(entry => entry.transactionId);

                const newRecords = ledgerData.map(async (entry) => {
                    if (entry.transactionId && existingTransactionIds.includes(entry.transactionId)) {
                        await this.updateRecord(ledger, entry);
                        return null;
                    } else {
                        const transactionId = await this.generateUniqueTransactionId(company);
                        return {
                            ...entry,
                            transactionId
                        };
                    }
                });

                const newLedgerData = (await Promise.all(newRecords)).filter(entry => entry);

                if (newLedgerData.length > 0) {
                    await this.createRecord(ledger, newLedgerData);
                }


                if (newLedgerData.ledgerData.paymentMode) {
                    const companyLedger = await this.model.findOne({ ledgerMaster: newLedgerData.ledgerData.paymentMode });
                    
                }

                this.handleSuccess(res, 200, { message: 'Ledger records updated successfully' });

            } else {
                const newLedgerData = await Promise.all(ledgerData.map(async entry => ({
                    ...entry,
                    transactionId: await this.generateUniqueTransactionId(company)
                })));
                await this.model.create({
                    party,
                    ledgerData: newLedgerData
                });
                this.handleSuccess(res, 201, { message: 'New ledger created successfully' });
            }

        } catch (error) {
            console.error('Error creating ledger:', error);
            this.handleError(res, error);
        }
    }

    generateUniqueTransactionId = async (companyId) => {
        try {
            const sequenceType = 'ledger';
            const counter = await Counter.model.findOneAndUpdate(
                { companyId: companyId, sequenceType: sequenceType },
                { $inc: { sequenceValue: 1 } },
                { new: true, upsert: true }
            );

            return `${counter.sequenceValue}`;
        } catch (error) {
            console.error('Error generating unique transactionId:', error);
            throw new InternalServerError('Error generating unique transactionId');
        }
    }

    updateRecord = async (ledger, updatedEntry) => {
        try {
            ledger.ledgerData = ledger.ledgerData.map(entry =>
                entry.transactionId === updatedEntry.transactionId
                    ? { ...entry, ...updatedEntry }
                    : entry
            );

            let currentBalance = 0;
            for (const entry of ledger.ledgerData) {
                if (entry.credit) {
                    currentBalance += entry.credit;
                }
                if (entry.debit) {
                    currentBalance -= entry.debit;
                }
                entry.balance = currentBalance;
            }

            await ledger.save();
        } catch (error) {
            console.error('Error updating record:', error);
            throw new InternalServerError('Error updating record');
        }
    }

    createRecord = async (ledger, newLedgerData) => {
        try {
            ledger.ledgerData.push(...newLedgerData);

            let currentBalance = 0;
            for (const entry of ledger.ledgerData) {
                if (entry.credit) {
                    currentBalance += entry.credit;
                }
                if (entry.debit) {
                    currentBalance -= entry.debit;
                }
                entry.balance = currentBalance;
            }

            await ledger.save();
        } catch (error) {
            console.error('Error adding records:', error);
            throw new InternalServerError('Error adding records');
        }
    }

    findLedgerByParty = async (req, res) => {
        try {
            const party = toObjectId(req.params.party);

            const ledger = await this.model.findOne({ party });

            if (!ledger) {
                throw new NotFoundError('Ledger not found');
            }

            this.handleSuccess(res, 200, ledger);

        } catch (error) {
            console.error('Error finding ledger by party:', error);
            this.handleError(res, error);
        }
    }
}

export default new LedgerController();