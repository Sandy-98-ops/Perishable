import express from 'express';
import CustomerBillController from '../../controllers/transaction/CustomerBillController.js';

const customerBillRouter = express.Router();
customerBillRouter.post('/', CustomerBillController.create);
customerBillRouter.get('/', CustomerBillController.findAll);
customerBillRouter.get('/:id', CustomerBillController.findById);
customerBillRouter.put('/:id', CustomerBillController.update);
customerBillRouter.delete('/:id', CustomerBillController.delete);

export default customerBillRouter;