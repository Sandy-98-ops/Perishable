import express from 'express';
import ChargeController from '../../controllers/master/ChargeController.js';

const chargeRouter = express.Router();
chargeRouter.post('/', ChargeController.create);
chargeRouter.get('/', ChargeController.findAll);
chargeRouter.get('/:id', ChargeController.findById);
chargeRouter.put('/:id', ChargeController.update);
chargeRouter.delete('/:id', ChargeController.delete);

export default chargeRouter;