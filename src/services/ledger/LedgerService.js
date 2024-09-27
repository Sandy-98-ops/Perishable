import BaseService from '../base/BaseService.js';
import PAYMENT_MODES from "../../constants/paymentModes.js";
import Ledger from "../../models/ledger/Ledger.js";
import Counter from "../../utils/Counter.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../../utils/errors.js";
import { withTransaction } from "../../utils/transactionHelper.js";
import CounterService from '../utils/CounterService.js';
import CashLedgerService from './CashLedgerService.js';
import BankLedgerService from './BankLedgerService.js';
import BankLedger from '../../models/ledger/BankLedger.js';

class LedgerService extends BaseService {
    constructor() {
        super(Ledger);
    }


    // Create a new ledger entry
    create = async (data) => {
        if (!data || Object.keys(data).length === 0) {
            throw new BadRequestError('Invalid data provided');
        }

        return withTransaction(async (transaction) => {
            const { company_id, credit, debit, payment_mode } = data;

            // Generate unique transaction ID
            const uniqueTransactionId = await CounterService.generateUniqueTransactionId(company_id, 'ledger', 'TXN', transaction);

            // Find the most recent entry for the company
            const recentEntry = await this.findOne(
                { company_id: data.company_id },
                [['created_at', 'DESC']] // Ordering by created_at, descending
            );

            // Calculate the previous balance
            const previousBalance = recentEntry ? recentEntry.balance : 0;

            // Calculate new balance
            let newBalance = 0;
            if (debit > 0) {
                newBalance = previousBalance - debit;
            } else {
                newBalance = previousBalance + credit;
            }

            // Validate payment mode
            const validatedPaymentMode = PAYMENT_MODES.includes(payment_mode) ? payment_mode : null;

            // Assign calculated values to data
            data.transaction_id = uniqueTransactionId;
            data.payment_mode = validatedPaymentMode;
            data.balance = newBalance;

            // Create the new ledger entry in the database
            const ledger = await this.model.create(data, { transaction });

            // Create a new Ledger object
            let ledgerData = ledger;

            let cashLedger = null, bankLedger = null;

            // Reverse the debit and credit based on payment mode
            if (ledgerData.payment_mode === 'Cash' || ledgerData.payment_mode === 'Cash on Delivery') {
                ledgerData.debit = credit;  // Reverse credit to debit
                ledgerData.credit = debit;  // Reverse debit to credit

                // Create cash ledger entry
                cashLedger = await CashLedgerService.createCashLedger(ledgerData, transaction);
            } else if (['Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Online Payment Gateway', 'Mobile Payment'].includes(ledgerData.payment_mode)) {
                ledgerData.debit = credit;  // Reverse credit to debit
                ledgerData.credit = debit;  // Reverse debit to credit

                // Create bank ledger entry
                bankLedger = await BankLedgerService.create(ledgerData, transaction);
            }

            return { ledger, cashLedger, bankLedger };
        });
    };


    // Find a ledger record by ID
    findById = async (id) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        const ledger = await Ledger.findOne({ where: { id } });

        if (!ledger) {
            throw new NotFoundError('Ledger record not found');
        }

        return ledger;
    }

    // Find ledger records by party
    findLedgerByParty = async (party) => {
        if (!party) {
            throw new BadRequestError('Party is required');
        }

        const ledgers = await Ledger.findAll({
            where: { party }
        });

        if (ledgers.length === 0) {
            throw new NotFoundError('No ledger records found for the given party');
        }

        return ledgers;
    }

    // Find all ledger records with optional query parameters
    findAll = async (query = {}) => {
        return Ledger.findAll({ where: query });
    }

    // Update a ledger record by ID
    updateDoc = async (id, data) => {
        if (!id || !data || Object.keys(data).length === 0) {
            throw new BadRequestError('ID and data are required');
        }

        return withTransaction(async (transaction) => {
            // Fetch the existing ledger entry by ID
            const existingLedger = await this.findById(id);

            if (!existingLedger) {
                throw new NotFoundError("Document not found");
            }

            let affectedRows = 0;
            let cashLedger = null, bankLedger = null;
            let ledgerData = { ...data };

            // If payment mode has not changed, just update the existing ledger
            if (existingLedger.payment_mode === data.payment_mode) {

                affectedRows = await this.update(id, data, transaction);

                // If payment mode has changed, handle it
                if (['Cash on Delivery', 'Cash'].includes(data.payment_mode)) {

                    const existingEntry = await CashLedgerService.findOne({
                        company_id: data.company_id,
                        reference_id: data.transaction_id
                    });

                    // Adjust ledger debit/credit for cash
                    existingEntry.debit = data.credit;  // Reverse credit to debit
                    existingEntry.credit = data.debit;  // Reverse debit to credit
                    existingEntry.date = data.date;
                    existingEntry.description = data.description;

                    // Create a new cash ledger entry
                    cashLedger = await CashLedgerService.updateCashLedger(existingEntry.id, existingEntry, transaction);
                } else if (['Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Online Payment Gateway', 'Mobile Payment'].includes(data.payment_mode)) {
                    // Fetch the existing BankLedger entry by company_id and reference_id (transaction_id)

                    const existingEntry = await BankLedgerService.findOne({
                        company_id: data.company_id,
                        reference_id: data.transaction_id
                    });

                    if (!existingEntry) {
                        throw new NotFoundError('Bank Ledger entry not found');
                    }
                    console.log('Bank Ledger entry found:', existingEntry);

                    // Adjust debit/credit and other fields
                    existingEntry.debit = data.credit;  // Reverse credit to debit
                    existingEntry.credit = data.debit;  // Reverse debit to credit
                    existingEntry.date = data.date;
                    existingEntry.description = data.description;

                    // Log before updating
                    console.log('Updating BankLedger:', {
                        id: existingEntry.id,
                        data: existingEntry,
                        transaction
                    });

                    // Update the BankLedger entry
                    bankLedger = await BankLedgerService.updateBankLedger(existingEntry.id, existingEntry, transaction);

                }
            } else {
                // If payment mode has changed, handle it
                if (['Cash on Delivery', 'Cash'].includes(data.payment_mode)) {
                    // If the new payment mode is cash, delete the bank ledger entry (if exists)
                    const bankLedgerData = await BankLedgerService.findOne({
                        company_id: data.company_id,
                        reference_id: data.transaction_id
                    });
                    if (bankLedgerData) {
                        await BankLedgerService.delete({ id: bankLedgerData.id }, transaction);
                    }

                    // Adjust ledger debit/credit for cash
                    ledgerData.debit = data.credit;  // Reverse credit to debit
                    ledgerData.credit = data.debit;  // Reverse debit to credit

                    // Create a new cash ledger entry
                    cashLedger = await CashLedgerService.createCashLedger(ledgerData, transaction);
                } else if (['Credit Card', 'Debit Card', 'Bank Transfer', 'Cheque', 'Online Payment Gateway', 'Mobile Payment'].includes(data.payment_mode)) {
                    // If the new payment mode is bank-related, delete the cash ledger entry (if exists)
                    const cashLedgerData = await CashLedgerService.findOne({
                        company_id: data.company_id,
                        reference_id: data.transaction_id
                    });

                    if (cashLedgerData) {
                        await CashLedgerService.delete(cashLedgerData.id, transaction);
                    }

                    // Adjust ledger debit/credit for bank
                    ledgerData.debit = data.credit;  // Reverse credit to debit
                    ledgerData.credit = data.debit;  // Reverse debit to credit

                    // Create a new bank ledger entry
                    bankLedger = await BankLedgerService.create(ledgerData, transaction);
                }

                // Update the main ledger entry after handling cash or bank ledger
                affectedRows = await this.update(id, data, transaction);
            }

            // Throw error if no records were updated
            if (affectedRows === 0) {
                throw new NotFoundError('Ledger record not found');
            }

            return { message: 'Ledger record updated successfully', cashLedger, bankLedger };
        });
    };


    // Delete a ledger record by ID
    delete = async (id) => {
        if (!id) {
            throw new BadRequestError('ID is required');
        }

        const deletedRows = await Ledger.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw new NotFoundError('Ledger record not found');
        }

        return { message: 'Ledger record deleted successfully' };
    }
}

export default new LedgerService();