import express from 'express';
import UnitMasterController from '../../controllers/master/UnitMasterController.js';

const unitMasterRouter = express.Router();
unitMasterRouter.post('/', UnitMasterController.create);
unitMasterRouter.get('/', UnitMasterController.findAll);
unitMasterRouter.get('/:id', UnitMasterController.findById);
unitMasterRouter.put('/:id', UnitMasterController.update);
unitMasterRouter.delete('/:id', UnitMasterController.delete);

export default unitMasterRouter;