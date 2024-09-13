import express from 'express';
import ItemCategoryController from '../../controllers/master/ItemCategoryController.js';

const itemCategoryRouter = express.Router();
itemCategoryRouter.post('/', ItemCategoryController.create);
itemCategoryRouter.get('/', ItemCategoryController.findAll);
itemCategoryRouter.get('/:id', ItemCategoryController.findById);
itemCategoryRouter.put('/:id', ItemCategoryController.update);
itemCategoryRouter.delete('/:id', ItemCategoryController.delete);

export default itemCategoryRouter;