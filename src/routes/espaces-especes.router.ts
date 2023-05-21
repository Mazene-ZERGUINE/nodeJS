import { Router } from 'express';
import { body, param } from 'express-validator';

import { isAuthenticated, isEmploye } from '../middlewares/Authentication';
import { EspacesEspecesController } from '../controllers/espaces-especes.controller';
import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';

const id_espaces = 'id_espaces';
const id_especes = 'id_especes';

const router = Router();
router
	.get('/', [isAuthenticated, isEmploye], EspacesEspecesController.getAll)
	.get(
		`/espaces/:${id_espaces}/especes/:${id_especes}`,
		[isAuthenticated, isEmploye, param([id_espaces, id_especes]).isNumeric({ no_symbols: true })],
		EspacesEspecesController.getOneById,
	)
	.post(
		'/',
		[
			isAuthenticated,
			isEmploye,
			body(id_espaces).isInt({ min: 1 }),
			body(id_especes).isInt({ min: 1 }),
			handleInputErrors,
		],
		EspacesEspecesController.create,
	)
	.delete(
		`/espaces/:${id_espaces}/especes/:${id_especes}`,
		[isAuthenticated, isEmploye, param([id_espaces, id_especes]).isNumeric({ no_symbols: true })],
		EspacesEspecesController.deleteById,
	);

export default router;
