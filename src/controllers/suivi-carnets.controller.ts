import { Request, Response } from 'express';
import { compareAsc } from 'date-fns';

import { SuiviCarnetsModel } from '../models/suivi-carnets.model';

export class SuiviCarnetsController {
	static async create(req: Request, res: Response): Promise<void> {
		const { nom_animal, etat, description_sante, poids, taille, date_de_naissance, date_de_diagnostic, id } = req.body;
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
			const carnet = await SuiviCarnetsModel.findOne({ where: { nom_animal, id } });
			if (carnet) {
				res.status(400).json({ message: 'booklet already exists' });
				return;
			}

			await SuiviCarnetsModel.create({
				nom_animal,
				etat,
				description_sante: description_sante ?? null,
				poids,
				taille,
				date_de_naissance: providedDateDeNaissance ?? null,
				date_de_diagnostic: providedDateDeDiagnostic ?? null,
				id,
			});

			res.status(201).end();
		} catch (_) {
			console.log(_);
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
			const carnets = await SuiviCarnetsModel.findAll({ limit: 1_000 });
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
			const carnet = await SuiviCarnetsModel.findByPk(req.params.id_suivi_carnets);
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
		const {
			nom_animal: providedNomAnimal,
			etat: providedEtat,
			description_sante: providedDescriptionSante,
			poids: providedPoids,
			taille: providedTaille,
			date_de_naissance: providedDate_de_naissance,
			date_de_diagnostic: providedDate_de_diagnostic,
			id: providedIdComptes,
			id_animaux: providedIdAnimaux,
		} = req.body;

		try {
			let dateDeNaissance: null | Date = null;
			let dateDeDiagnostic: null | Date = null;

			const carnet = await SuiviCarnetsModel.findByPk(req.params.id_suivi_carnets);
			if (!carnet) {
				res.status(400).end();
				return;
			}

			const {
				nom_animal: carnetNomAnimal,
				etat: carnetEtat,
				description_sante: carnetDescriptionSante,
				poids: carnetPoids,
				taille: carnetTaille,
				date_de_naissance: carnetDateDeNaissance,
				date_de_diagnostic: carnetDateDeDiagnostic,
				id: carnetIdComptes,
				id_animaux: carnetIdAnimaux,
			} = carnet.toJSON();

			let isProvidedDateDeNaissanceSameAsCurrentCarnet: boolean =
				providedDate_de_naissance === undefined ? true : providedDate_de_naissance === carnetDateDeNaissance;
			let isProvidedDateDeDiagnosticSameAsCurrentCarnet: boolean =
				providedDate_de_diagnostic === undefined ? true : providedDate_de_naissance === carnetDateDeDiagnostic;

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

				isProvidedDateDeNaissanceSameAsCurrentCarnet =
					compareAsc(dateDeNaissance, new Date(carnetDateDeNaissance)) == 0;
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

				isProvidedDateDeDiagnosticSameAsCurrentCarnet =
					compareAsc(dateDeDiagnostic, new Date(carnetDateDeDiagnostic)) == 0;
			}

			const shouldUpdateCarnet: boolean =
				providedNomAnimal !== carnetNomAnimal ||
				providedEtat !== carnetEtat ||
				(providedDescriptionSante !== undefined && providedDescriptionSante !== carnetDescriptionSante) ||
				providedPoids !== carnetPoids ||
				providedTaille !== carnetTaille ||
				!isProvidedDateDeNaissanceSameAsCurrentCarnet ||
				!isProvidedDateDeDiagnosticSameAsCurrentCarnet ||
				providedIdComptes !== carnetIdComptes ||
				providedIdAnimaux !== carnetIdAnimaux;

			if (!shouldUpdateCarnet) {
				res.status(400).json({ message: 'cannot update booklet' });
				return;
			}

			carnet.setAttributes({
				nom_animal: providedNomAnimal,
				etat: providedEtat,
				description_sante: providedDescriptionSante === undefined ? carnetDescriptionSante : providedDescriptionSante,
				poids: providedPoids,
				taille: providedTaille,
				date_de_naissance: !providedDate_de_naissance ? carnetDateDeNaissance : dateDeNaissance,
				date_de_diagnostic: !providedDate_de_diagnostic ? carnetDateDeDiagnostic : dateDeDiagnostic,
				id: providedIdComptes,
				id_animaux: providedIdAnimaux,
			});

			await carnet.save();
			res.status(204).end();
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
