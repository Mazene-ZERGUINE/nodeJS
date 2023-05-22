import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { SuiviCarnetsController } from '../controllers/suivi-carnets.controller';
import { EtatValidation } from '../models/suivi-carnets.model';

const idSuiviCarnets = 'id_suivi_carnets';
const etat = 'etat';
const descriptionSante = 'description_sante';
const poids = 'poids';
const taille = 'taille';
const dateDeNaissance = 'date_de_naissance';
const dateDeDiagnostic = 'date_de_diagnostic';
const idComptes = 'id';
const idAnimaux = 'id_animaux';

const mandatoryValidators = [
	body(etat)
		.isString()
		.isIn([EtatValidation.lost, EtatValidation.dead, EtatValidation.sick, EtatValidation.bad, EtatValidation.good]),
	body(poids).isFloat({ min: 0.01 }),
	body(taille).isNumeric({ no_symbols: true }),
	body(idComptes).isInt({ min: 1 }),
	body(idAnimaux).isInt({ min: 1 }),
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
	.post('/', [...mandatoryValidators, handleInputErrors], ...optionalValidators, SuiviCarnetsController.create)
	// .put(
	// 	`/:${idSuiviCarnets}`,
	// 	[
	// 		param(idSuiviCarnets).isNumeric({ no_symbols: true }),
	// 		// body(nom).isString(),
	// 		handleInputErrors,
	// 	],
	// 	SuiviCarnetsController.updateById,
	// )
	.delete(
		`/:${idSuiviCarnets}`,
		param(idSuiviCarnets).isNumeric({ no_symbols: true }),
		SuiviCarnetsController.deleteById,
	);

export default router;
