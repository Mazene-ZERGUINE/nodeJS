import { Request, Response } from 'express';
import { compareAsc } from 'date-fns';

import { SuiviCarnetsModel } from '../models/suivi-carnets.model';

export class SuiviCarnetsController {
	static async create(req: Request, res: Response): Promise<void> {
		const { etat, description_sante, poids, taille, date_de_naissance, date_de_diagnostic, id, id_animaux } = req.body;
		let providedDateDeNaissance: null | Date = null;
		let providedDateDeDiagnostic: null | Date = null;

		if (date_de_naissance) {
			const splittedProvidedDateDeNaissance = date_de_naissance.split('/');
			const providedDay = splittedProvidedDateDeNaissance[0];
			const providedMonth = splittedProvidedDateDeNaissance[1];
			const providedYear = splittedProvidedDateDeNaissance[2];

			providedDateDeNaissance = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
			const todayDate = new Date();

			const isProvidedDateAfterToday: boolean = compareAsc(providedDateDeNaissance, todayDate) == 1;
			if (isProvidedDateAfterToday) {
				res.status(400).json({ message: 'bad birth of date' });
				return;
			}
		}
		if (date_de_diagnostic) {
			const splittedProvidedDateDeDiagnostic = date_de_diagnostic.split('/');
			const providedDay = splittedProvidedDateDeDiagnostic[0];
			const providedMonth = splittedProvidedDateDeDiagnostic[1];
			const providedYear = splittedProvidedDateDeDiagnostic[2];

			providedDateDeDiagnostic = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
			const todayDate = new Date();

			const isProvidedDateAfterToday: boolean = compareAsc(providedDateDeDiagnostic, todayDate) == 1;
			if (isProvidedDateAfterToday) {
				res.status(400).json({ message: 'bad date of diagnosis' });
				return;
			}
		}

		try {
			const carnet = await SuiviCarnetsModel.findOne({ where: { id, id_animaux } });
			if (carnet) {
				res.status(400).json({ message: 'booklet already exists' });
				return;
			}

			await SuiviCarnetsModel.create({
				etat,
				description_sante: description_sante ?? null,
				poids,
				taille,
				date_de_naissance: providedDateDeNaissance ?? null,
				date_de_diagnostic: providedDateDeDiagnostic ?? null,
				id,
				id_animaux,
			});

			res.status(201).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async deleteById(req: Request, res: Response): Promise<void> {
		try {
			const carnet = await SuiviCarnetsModel.findByPk(req.params.id_suivi_carnets);
			if (!carnet) {
				res.status(400).end();
				return;
			}

			await carnet.destroy();
			res.status(200).json({ message: 'booklet deleted' });
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		try {
			const carnets = await SuiviCarnetsModel.findAll({ attributes: { exclude: ['id_suivi_carnets'] }, limit: 1_000 });
			if (!carnets) {
				res.status(400).end();
				return;
			}

			res.status(200).json(carnets);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const carnet = await SuiviCarnetsModel.findByPk(req.params.id_suivi_carnets, {
				attributes: { exclude: ['id_suivi_carnets'] },
			});
			if (!carnet) {
				res.status(400).end();
				return;
			}

			res.status(200).json(carnet);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async updateById(req: Request, res: Response): Promise<void> {
		let dateDeNaissance: null | Date = null;
		let dateDeDiagnostic: null | Date = null;
		const {
			etat: providedEtat,
			description_sante: providedDescriptionSante,
			poids: providedPoids,
			taille: providedTaille,
			date_de_naissance: providedDate_de_naissance,
			date_de_diagnostic: providedDate_de_diagnostic,
			id: providedIdComptes,
			id_animaux: providedIdAnimaux,
		} = req.body;

		if (providedDate_de_naissance) {
			const splittedProvidedDateDeNaissance = providedDate_de_naissance.split('/');
			const providedDay = splittedProvidedDateDeNaissance[0];
			const providedMonth = splittedProvidedDateDeNaissance[1];
			const providedYear = splittedProvidedDateDeNaissance[2];

			dateDeNaissance = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
			const todayDate = new Date();

			const isProvidedDateAfterToday: boolean = compareAsc(dateDeNaissance, todayDate) == 1;
			if (isProvidedDateAfterToday) {
				res.status(400).json({ message: 'bad birth of date' });
				return;
			}
		}
		if (providedDate_de_diagnostic) {
			const splittedProvidedDateDeDiagnostic = providedDate_de_diagnostic.split('/');
			const providedDay = splittedProvidedDateDeDiagnostic[0];
			const providedMonth = splittedProvidedDateDeDiagnostic[1];
			const providedYear = splittedProvidedDateDeDiagnostic[2];

			dateDeDiagnostic = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
			const todayDate = new Date();

			const isProvidedDateAfterToday: boolean = compareAsc(dateDeDiagnostic, todayDate) == 1;
			if (isProvidedDateAfterToday) {
				res.status(400).json({ message: 'bad date of diagnosis' });
				return;
			}
		}

		try {
			const carnet = await SuiviCarnetsModel.findByPk(req.params.id_suivi_carnets);
			if (!carnet) {
				res.status(400).end();
				return;
			}

			const {
				etat: carnetEtat,
				description_sante: carnetDescriptionSante,
				poids: carnetPoids,
				taille: carnetTaille,
				date_de_naissance: carnetDateDeNaissance,
				date_de_diagnostic: carnetDateDeDiagnostic,
				id: carnetIdComptes,
				id_animaux: carnetIdAnimaux,
			} = carnet.toJSON();

			const shouldUpdateCarnet: boolean =
				providedEtat !== carnetEtat ||
				(providedDescriptionSante !== undefined && providedDescriptionSante !== carnetDescriptionSante) ||
				providedPoids !== carnetPoids ||
				providedTaille !== carnetTaille ||
				(providedDate_de_naissance !== undefined && providedDate_de_naissance !== carnetDateDeNaissance) ||
				(providedDate_de_diagnostic !== undefined && providedDate_de_diagnostic !== carnetDateDeDiagnostic) ||
				providedIdComptes !== carnetIdComptes ||
				providedIdAnimaux !== carnetIdAnimaux;

			if (!shouldUpdateCarnet) {
				res.status(409).end();
				return;
			}

			carnet.setAttributes({
				etat: providedEtat,
				description_sante: providedDescriptionSante === undefined ? carnetDescriptionSante : providedDescriptionSante,
				poids: providedPoids,
				taille: providedTaille,
				date_de_naissance: providedDate_de_naissance === undefined ? carnetDateDeNaissance : dateDeNaissance,
				date_de_diagnostic: providedDate_de_diagnostic === undefined ? carnetDateDeDiagnostic : dateDeDiagnostic,
				id: providedIdComptes,
				id_animaux: providedIdAnimaux,
			});

			await carnet.save();
			res.status(204).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}
}