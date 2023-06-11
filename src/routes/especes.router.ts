import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { EspecesController } from '../controllers/especes.controller';
import { NomValidation } from '../models/especes.model';
import { checkUserRole, isAuthenticated, isEmploye } from '../middlewares/Authentication';
import { Roles } from '../models/roles.enum';

const id = 'id';
const nom = 'nom';

const router = Router();
router
	.get('/', EspecesController.getAll)
	.get(
		`/:${id}`,
		[isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN), param(id).isNumeric()],
		EspecesController.getOneById,
	)
	.post(
		'/',
		[
			isAuthenticated,
			isEmploye,
			checkUserRole(Roles.ADMIN),
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
			isAuthenticated,
			isEmploye,
			param(id).isNumeric({ no_symbols: true }),
			body(nom).isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
			handleInputErrors,
		],
		EspecesController.updateById,
	)
	.delete(
		`/:${id}`,
		[isAuthenticated, isEmploye, param(id).isNumeric({ no_symbols: true })],
		EspecesController.deleteById,
	);

export default router;
