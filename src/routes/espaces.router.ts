import { Router } from 'express';
import { body, param } from 'express-validator';

import { handleInputErrors } from '../middlewares/input-errors-handler.middleware';
import { EspacesController } from '../controllers/espaces.controller';
import { NomValidation } from '../models/espaces.model';
import { isAdmin, isAuthenticated, isEmploye } from '../middlewares/Authentication';

const id = 'id';
const nom = 'nom';
const description = 'description';
const image = 'image';
const capacite = 'capacite';
const duree = 'duree';
const a_acces_handicape = 'a_acces_handicape';
const est_en_entretien = 'est_en_entretien';
const taux_frequentation = 'taux_frequentation';
const id_espace_types = 'id_espace_types';
const id_especes = 'id_especes';
const mandatoryValidators = [
	body(nom).isString().isLength({ min: NomValidation.min, max: NomValidation.max }),
	body(capacite).isInt({ min: 1 }),
	body(duree).isInt({ min: 0 }),
	body(a_acces_handicape).isBoolean(),
	body(est_en_entretien).isBoolean(),
	body(id_espace_types).isNumeric({ no_symbols: true }),
	handleInputErrors,
];
const optionalValidators = [
	body(description).optional().isString(),
	body(image).optional().isString(),
	body(taux_frequentation).optional().isInt({ min: 1 }),
];

const router = Router();
router
	.get('/', [isAuthenticated, isEmploye], EspacesController.getAll)
	.get(`/:${id}`, [isAuthenticated, isEmploye, param(id).isNumeric()], EspacesController.getOneById)
	.post('/', [isAuthenticated, isEmploye, ...mandatoryValidators], ...optionalValidators, EspacesController.create)
	.put(
		`/:${id}`,
		[isAuthenticated, isAdmin, param(id).isNumeric({ no_symbols: true }), ...mandatoryValidators],
		...optionalValidators,
		EspacesController.updateById,
	)
	.put(
		`/:${id}/entretien`,
		[isAuthenticated, isAdmin, param(id).isNumeric({ no_symbols: true }), body(est_en_entretien).isBoolean()],
		EspacesController.updateEstEnEntretienById,
	)
	.delete(
		`/:${id}`,
		[isAuthenticated, isEmploye, param(id).isNumeric({ no_symbols: true })],
		EspacesController.deleteById,
	);

export default router;
