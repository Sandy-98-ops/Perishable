import express from 'express';
import FarmersPattiController from '../../controllers/transaction/FarmersPattiController.js';

const farmersPattiRouter = express.Router();
farmersPattiRouter.post('/', FarmersPattiController.create);
farmersPattiRouter.get('/', FarmersPattiController.findAll);
farmersPattiRouter.get('/:id', FarmersPattiController.findById);
farmersPattiRouter.put('/:id', FarmersPattiController.update);
farmersPattiRouter.delete('/:id', FarmersPattiController.delete);

export default farmersPattiRouter;