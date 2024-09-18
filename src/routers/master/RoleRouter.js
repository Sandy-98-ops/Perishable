import express from 'express';
import RoleController from '../../controllers/master/RoleController.js';

const roleRouter = express.Router();
roleRouter.post('/', RoleController.create);
roleRouter.get('/', RoleController.findAll);
roleRouter.get('/:id', RoleController.findById);
roleRouter.put('/:id', RoleController.update);
roleRouter.delete('/:id', RoleController.delete);

export default roleRouter;