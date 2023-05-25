import { Router } from 'express';
import { body, param } from 'express-validator';

import { AnimauxController } from '../controllers/animaux.controller';
import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { NomValidation } from '../models/animaux.model';
import { Roles } from '../models/roles.enum';
import { checkUserRole, isAdmin, isAuthenticated, isEmploye } from '../middlewares/Authentication';

const id = 'id';
const nom = 'nom';
const sexe = 'sexe';
const dateDeNaissance = 'date_de_naissance';
const idEspeces = 'id_especes';
const idSuiviCarnets = 'id_suivi_carnets';

const router = Router();
router
	.get('/', [isAuthenticated, isEmploye], AnimauxController.getAll)
	.get(`/:${id}`, [isAuthenticated, isEmploye, param(id).isNumeric()], AnimauxController.getOneById)
	.post(
		'/',
		[
			isAuthenticated,
			isEmploye,
			isAdmin,
			body(nom).isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
			body(sexe).isBoolean(),
			body(idEspeces).isNumeric({ no_symbols: true }),
			handleInputErrors,
		],
		body(idSuiviCarnets).optional().isNumeric({ no_symbols: true }),
		body(dateDeNaissance)
			.optional()
			.isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
		AnimauxController.create,
	)
	.put(
		`/:${id}`,
		[
			isAuthenticated,
			isEmploye,
			checkUserRole(Roles.VET),
			param(id).isNumeric({ no_symbols: true }),
			body(nom).optional().isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
			body(sexe).optional().isBoolean(),
			body(idSuiviCarnets).optional().isNumeric({ no_symbols: true }),
			body(dateDeNaissance)
				.optional()
				.isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
		],
		AnimauxController.updateById,
	)
	.delete(
		`/:${id}`,
		[isAuthenticated, isEmploye, isAdmin, param(id).isNumeric({ no_symbols: true })],
		AnimauxController.deleteById,
	);

export default router;
