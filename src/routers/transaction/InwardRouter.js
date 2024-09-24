import express from 'express';
import InwardController from '../../controllers/transaction/InwardController.js';

const inwardRouter = express.Router();
inwardRouter.post('/', InwardController.create);
inwardRouter.get('/', InwardController.findAll);
inwardRouter.get('/:id', InwardController.findById);
inwardRouter.put('/:id', InwardController.update);
inwardRouter.delete('/:id', InwardController.delete);

export default inwardRouter;