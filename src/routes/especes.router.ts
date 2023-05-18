import { Router } from 'express';
import { body } from 'express-validator';

import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { EspecesController } from '../controllers/especes.controller';
import { NomValidation } from '../models/especes.model';

const nom = 'nom';

const router = Router();
router.get('/', EspecesController.getAll).post(
	'/',
	[
		body(nom).isString().isLength({
			min: NomValidation.min,
			max: NomValidation.max,
		}),
		handleInputErrors,
	],
	EspecesController.create,
);

export default router;
