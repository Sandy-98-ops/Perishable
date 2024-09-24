import express from 'express';
import DifferencesController from '../../controllers/transaction/DifferencesController.js';

const differencesRouter = express.Router();

differencesRouter.post('/', DifferencesController.create);
differencesRouter.get('/', DifferencesController.findAll);
differencesRouter.get('/:id', DifferencesController.findById);
differencesRouter.put('/:id', DifferencesController.update);
differencesRouter.delete('/:id', DifferencesController.delete);

export default differencesRouter;