import express from 'express';
import ItemController from '../../controllers/transaction/ItemController.js';

const itemRouter = express.Router();
itemRouter.post('/', ItemController.create);
itemRouter.get('/', ItemController.findAll);
itemRouter.get('/:id', ItemController.findById);
itemRouter.put('/:id', ItemController.update);
itemRouter.delete('/:id', ItemController.delete);

export default itemRouter;