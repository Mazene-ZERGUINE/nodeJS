import { Request, Response } from 'express';

import { AnimauxModel } from '../models/animaux.model';
import { compareAsc } from 'date-fns';
import { SuiviCarnetsModel } from '../models/suivi-carnets.model';

export class AnimauxController {
	static async create(req: Request, res: Response): Promise<void> {
		const { nom, sexe, date_de_naissance, id_especes, id_suivi_carnets } = req.body;
		let providedDate: null | Date = null;

		if (typeof date_de_naissance !== 'string' || date_de_naissance.length !== 10 || date_de_naissance[2] != '/') {
			res.status(400).send('bad format date must be dd/mm/yyyy');
			return;
		}

		if (date_de_naissance) {
			const splittedProvidedDateDeNaissance = date_de_naissance.split('/');
			const providedDay = splittedProvidedDateDeNaissance[0];
			const providedMonth = splittedProvidedDateDeNaissance[1];
			const providedYear = splittedProvidedDateDeNaissance[2];

			providedDate = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
			const todayDate = new Date();

			const isProvidedDateAfterToday: boolean = compareAsc(providedDate, todayDate) == 1;
			if (isProvidedDateAfterToday) {
				res.status(400).json({ message: 'bad birth of date' });
				return;
			}
		}

		try {
			if (!id_suivi_carnets) {
				if (await AnimauxModel.findOne({ where: { nom } })) {
					res.status(400).json({ message: 'name already exists' });
					return;
				}
			}

			if (!(await SuiviCarnetsModel.findByPk(id_suivi_carnets))) {
				res.status(400).json({ message: 'cannot create animal.' });
				return;
			}

			if (await AnimauxModel.findOne({ where: { id_suivi_carnets } })) {
				res.status(400).json({ message: 'cannot create animal!' });
				return;
			}

			await AnimauxModel.create({
				nom,
				sexe,
				date_de_naissance: !date_de_naissance ? null : providedDate,
				id_especes,
				id_suivi_carnets,
			});

			res.status(201).end();
		} catch (error) {
			res.status(500).json({ message: 'internal server error' });
			console.log(error);
		}
	}

	static async deleteById(req: Request, res: Response): Promise<void> {
		try {
			const animal = await AnimauxModel.findByPk(req.params.id);
			if (!animal) {
				res.status(400).end();
				return;
			}

			await animal.destroy();
			res.status(200).json({ message: 'animal deleted' });
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		try {
			const animals = await AnimauxModel.findAll({
				limit: 1_000,
				include: {
					model: SuiviCarnetsModel,
				},
			});
			if (!animals) {
				res.status(400).end();
				return;
			}

			res.status(200).json(animals);
		} catch (_) {
			console.log(_);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const animal = await AnimauxModel.findByPk(req.params.id);
			if (!animal) {
				res.status(400).end();
				return;
			}

			res.status(200).json(animal);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async updateById(req: Request, res: Response): Promise<void> {
		const { id } = req.params;
		const {
			nom: providedNom,
			sexe: providedSexe,
			date_de_naissance: providedDate_de_naissance,
			id_suivi_carnets: providedSuiviCarnets,
		} = req.body;

		try {
			const animal = await AnimauxModel.findByPk(id);
			if (!animal) {
				res.status(400).end();
				return;
			}

			if (providedSuiviCarnets) {
				if (!(await SuiviCarnetsModel.findByPk(providedSuiviCarnets))) {
					res.status(400).json({ message: 'cannot update animal!' });
					return;
				}

				const animal = await AnimauxModel.findOne({ where: { id_suivi_carnets: providedSuiviCarnets } });
				const isSameAnimal: boolean = animal?.getDataValue('id_animaux') === Number(id);
				if (!isSameAnimal) {
					res.status(400).json({ message: 'cannot update animal.' });
					return;
				}
			}

			const {
				id_animaux,
				nom: animalNom,
				sexe: animalSexe,
				date_de_naissance: animalDateDeNaissance,
				id_suivi_carnets: animalSuiviCarnets,
			} = animal.toJSON();

			let providedDate: null | Date = null;
			let isProvidedDateSameAsCurrentAnimal =
				providedDate_de_naissance === undefined ? true : providedDate_de_naissance === animalDateDeNaissance;

			if (providedDate_de_naissance) {
				const splittedProvidedDateDeNaissance = providedDate_de_naissance.split('/');
				const providedDay = splittedProvidedDateDeNaissance[0];
				const providedMonth = splittedProvidedDateDeNaissance[1];
				const providedYear = splittedProvidedDateDeNaissance[2];
				providedDate = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
				const todayDate = new Date();
				todayDate.setHours(0, 0, 0, 0);

				const isProvidedDateAfterToday = compareAsc(providedDate, todayDate) == 1;
				if (isProvidedDateAfterToday) {
					res.status(400).json({ message: 'bad birth of date' });
					return;
				}

				isProvidedDateSameAsCurrentAnimal = compareAsc(providedDate, new Date(animalDateDeNaissance)) == 0;
			}

			const shouldUpdateAnimal: boolean =
				providedNom !== animalNom ||
				providedSexe !== animalSexe ||
				!isProvidedDateSameAsCurrentAnimal ||
				providedSuiviCarnets !== animalSuiviCarnets;
			if (!shouldUpdateAnimal) {
				res.status(400).json({ message: 'useless update animal' });
				return;
			}

			animal.setAttributes({
				id_animaux,
				nom: !providedNom ? animalNom : providedNom,
				sexe: providedSexe == null ? animalSexe : providedSexe,
				date_de_naissance: !providedDate_de_naissance ? animalDateDeNaissance : providedDate,
				id_suiviCarnets: providedSuiviCarnets === undefined ? animalSuiviCarnets : providedSuiviCarnets,
			});

			await animal.save();
			res.status(204).end();
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
