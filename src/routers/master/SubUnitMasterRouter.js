import express from 'express';
import SubUnitMasterController from '../../controllers/master/SubUnitMasterController.js';

const subUnitMasterRouter = express.Router();
subUnitMasterRouter.post('/', SubUnitMasterController.create);
subUnitMasterRouter.get('/', SubUnitMasterController.findAll);
subUnitMasterRouter.get('/:id', SubUnitMasterController.findById);
subUnitMasterRouter.put('/:id', SubUnitMasterController.update);
subUnitMasterRouter.delete('/:id', SubUnitMasterController.delete);

export default subUnitMasterRouter;