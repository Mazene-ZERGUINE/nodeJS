import { Request, Response } from 'express';

import { AnimauxModel } from '../models/animaux.model';
import { compareAsc } from 'date-fns';

export class AnimauxController {
	static async create(req: Request, res: Response): Promise<void> {
		const { nom, sexe, date_de_naissance } = req.body;
		let providedDate: null | Date = null;

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
			const animal = await AnimauxModel.findOne({ where: { nom } });
			if (animal) {
				res.status(400).json({ message: 'name already exists' });
				return;
			}

			await AnimauxModel.create({
				nom,
				sexe,
				date_de_naissance: !date_de_naissance ? null : providedDate,
			});

			res.status(201).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
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
			const animals = await AnimauxModel.findAll({ attributes: { exclude: ['id_animaux'] }, limit: 1_000 });
			if (!animals) {
				res.status(400).end();
				return;
			}

			res.status(200).json(animals);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const animal = await AnimauxModel.findByPk(req.params.id, { attributes: { exclude: ['id_animaux'] } });
			if (!animal) {
				res.status(400).end();
				return;
			}

			res.status(200).json(animal);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
