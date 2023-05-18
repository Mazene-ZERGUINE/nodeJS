import { Router } from 'express';
import { body, param } from 'express-validator';

import { AnimauxController } from '../controllers/animaux.controller';
import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { NomValidation } from '../models/animaux.model';

const id = 'id';
const nom = 'nom';
const sexe = 'sexe';
const dateDeNaissance = 'date_de_naissance';
const idEspeces = 'id_especes';

const router = Router();
router
	.get('/', AnimauxController.getAll)
	.get(`/:${id}`, param(id).isNumeric(), AnimauxController.getOneById)
	.post(
		'/',
		[
			body(nom).isString().isLength({
				min: NomValidation.min,
				max: NomValidation.max,
			}),
			body(sexe).isBoolean(),
			body(idEspeces).isNumeric({ no_symbols: true }),
			handleInputErrors,
		],
		body(dateDeNaissance)
			.optional()
			.isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
		AnimauxController.create,
	)
	.put(
		`/:${id}`,
		[
			param(id).isNumeric({ no_symbols: true }),
			body(nom).optional().isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
			body(sexe).optional().isBoolean(),
			body(dateDeNaissance)
				.optional()
				.isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
		],
		AnimauxController.updateById,
	)
	.delete(`/:${id}`, param(id).isNumeric({ no_symbols: true }), AnimauxController.deleteById);

export default router;
