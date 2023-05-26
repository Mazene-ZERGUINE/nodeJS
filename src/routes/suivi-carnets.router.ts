import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { SuiviCarnetsController } from '../controllers/suivi-carnets.controller';
import { EtatValidation, NomAnimalValidation } from '../models/suivi-carnets.model';
import { checkUserRole } from '../middlewares/Authentication';
import { Roles } from '../models/roles.enum';

const idSuiviCarnets = 'id_suivi_carnets';
const nomAnimal = 'nom_animal';
const etat = 'etat';
const descriptionSante = 'description_sante';
const poids = 'poids';
const taille = 'taille';
const dateDeNaissance = 'date_de_naissance';
const dateDeDiagnostic = 'date_de_diagnostic';
const id = 'id';

const mandatoryValidators = [
	body(nomAnimal).isString().isLength({ min: NomAnimalValidation.min, max: NomAnimalValidation.max }),
	body(etat)
		.isString()
		.isIn([EtatValidation.lost, EtatValidation.dead, EtatValidation.sick, EtatValidation.bad, EtatValidation.good]),
	body(poids).isFloat({ min: 0.01 }),
	body(taille).isNumeric({ no_symbols: true }),
	body(id).isInt({ min: 1 }),
	handleInputErrors,
];
const optionalValidators = [
	body(descriptionSante).optional().isString(),
	body(dateDeNaissance)
		.optional()
		.isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
	body(dateDeDiagnostic)
		.optional()
		.isDate({ format: 'DD/MM/YYYY', delimiters: ['/'] }),
];

const router = Router();
router
	.get('/', SuiviCarnetsController.getAll)
	.get(`/:${idSuiviCarnets}`, param(idSuiviCarnets).isNumeric({ no_symbols: true }), SuiviCarnetsController.getOneById)
	.post(
		'/',
		[checkUserRole(Roles.VET), ...mandatoryValidators, handleInputErrors],
		...optionalValidators,
		SuiviCarnetsController.create,
	)
	.put(
		`/:${idSuiviCarnets}`,
		[
			checkUserRole(Roles.VET),
			param(idSuiviCarnets).isNumeric({ no_symbols: true }),
			...mandatoryValidators,
			handleInputErrors,
		],
		...optionalValidators,
		SuiviCarnetsController.updateById,
	)
	.delete(
		`/:${idSuiviCarnets}`,
		[checkUserRole(Roles.VET), param(idSuiviCarnets).isNumeric({ no_symbols: true })],
		SuiviCarnetsController.deleteById,
	);

export default router;
