import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { EntretienType, NomValidation } from '../models/entretien-carnets.model';
import { EntretienCarnetsController } from '../controllers/entretien-carnets.controller';
import { checkUserRole, isAdmin, isAuthenticated, isEmploye } from '../middlewares/Authentication';
import { Roles } from '../models/roles.enum';

const idEntretienCarnets = 'id_entretien_carnets';
const nom = 'nom';
const type = 'type';
const dateDebut = 'date_debut';
const dateFin = 'date_fin';
const id = 'id';

const mandatoryValidators = [
	body(nom).isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
	body(type).isString().isIn([EntretienType.cleaning, EntretienType.renovation, EntretienType.repairs]),
	body(dateDebut).isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
	body(dateFin).isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
	body(id).isInt({ min: 1 }),
	handleInputErrors,
];

const router = Router();
router
	.get('/', [isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN)], EntretienCarnetsController.getAll)
	.get(
		`/:${idEntretienCarnets}`,
		param(idEntretienCarnets).isNumeric({ no_symbols: true }),
		checkUserRole(Roles.ADMIN),
		EntretienCarnetsController.getOneById,
	)
	.post(
		'/',
		[isAuthenticated, isEmploye, checkUserRole(Roles.MANTAINER), ...mandatoryValidators, handleInputErrors],
		EntretienCarnetsController.create,
	)
	.put(
		`/:${idEntretienCarnets}`,
		[
			isAuthenticated,
			isEmploye,
			checkUserRole(Roles.MANTAINER),
			param(idEntretienCarnets).isNumeric({ no_symbols: true }),
			...mandatoryValidators,
			handleInputErrors,
		],
		EntretienCarnetsController.updateById,
	)
	.delete(
		`/:${idEntretienCarnets}`,
		[isAuthenticated, isAdmin, param(idEntretienCarnets).isNumeric({ no_symbols: true })],
		EntretienCarnetsController.deleteById,
	);

export default router;
