import express from 'express';
import BatchController from '../../controllers/transaction/BatchController.js';

const batchRouter = express.Router();
batchRouter.post('/', BatchController.create);
batchRouter.get('/', BatchController.findAll);
batchRouter.get('/:id', BatchController.findById);
batchRouter.put('/:id', BatchController.update);
batchRouter.delete('/:id', BatchController.delete);

export default batchRouter;