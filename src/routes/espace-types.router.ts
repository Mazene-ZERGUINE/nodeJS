import { Router } from 'express';
import { body, param } from 'express-validator';

import { EspaceTypesController } from '../controllers/espace-types.controller';
import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { NomValidation } from '../models/espace-types.model';
import { checkUserRole, isAuthenticated, isEmploye } from '../middlewares/Authentication';
import { Roles } from '../models/roles.enum';

const id = 'id';
const nom = 'nom';

const router = Router();
router
	.get('/', [isAuthenticated, isEmploye], EspaceTypesController.getAll)
	.get(`/:${id}`, [isAuthenticated, isEmploye, param(id).isNumeric()], EspaceTypesController.getOneById)
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
		EspaceTypesController.create,
	)
	.put(
		`/:${id}`,
		[
			isAuthenticated,
			isEmploye,
			checkUserRole(Roles.ADMIN),
			param(id).isNumeric({ no_symbols: true }),
			body(nom).isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
			handleInputErrors,
		],
		EspaceTypesController.updateById,
	)
	.delete(
		`/:${id}`,
		[isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN), param(id).isNumeric({ no_symbols: true })],
		EspaceTypesController.deleteById,
	);

export default router;
