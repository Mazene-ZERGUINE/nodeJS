import { Router } from 'express';
import { body, param } from 'express-validator';

import { AnimauxController } from '../controllers/animaux.controller';
import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { NomValidation } from '../models/animaux.model';

const id = 'id';
const nom = 'nom';
const sexe = 'sexe';
const dateDeNaissance = 'date_de_naissance';

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
			handleInputErrors,
		],
		body(dateDeNaissance)
			.optional()
			.isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
		AnimauxController.create,
	)

export default router;
