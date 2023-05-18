import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { EspecesController } from '../controllers/especes.controller';
import { NomValidation } from '../models/especes.model';

const id = 'id';
const nom = 'nom';

const router = Router();
router
	.get('/', EspecesController.getAll)
	.get(`/:${id}`, param(id).isNumeric(), EspecesController.getOneById)
	.post(
		'/',
		[
			body(nom).isString().isLength({
				min: NomValidation.min,
				max: NomValidation.max,
			}),
			handleInputErrors,
		],
		EspecesController.create,
	)
	.put(
		`/:${id}`,
		[
			param(id).isNumeric({ no_symbols: true }),
			body(nom).isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
			handleInputErrors,
		],
		EspecesController.updateById,
	)
	.delete(`/:${id}`, param(id).isNumeric({ no_symbols: true }), EspecesController.deleteById);
export default router;
