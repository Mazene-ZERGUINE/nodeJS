import { Request, Response } from 'express';
import { compareAsc, compareDesc } from 'date-fns';

import { EntretienCarnetsModel } from '../models/entretien-carnets.model';
import { AccountsModel } from '../models/accounts.model';

export class EntretienCarnetsController {
	static async create(req: Request, res: Response): Promise<void> {
		const { nom, type, date_debut, date_fin, id } = req.body;
		let dateDebut: null | Date = null;
		let dateFin: null | Date = null;

		{
			const splittedProvidedDateDeNaissance = date_debut.split('/');
			const providedDay = splittedProvidedDateDeNaissance[0];
			const providedMonth = splittedProvidedDateDeNaissance[1];
			const providedYear = splittedProvidedDateDeNaissance[2];

			dateDebut = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
		}
		{
			const splittedProvidedDateDeDiagnostic = date_fin.split('/');
			const providedDay = splittedProvidedDateDeDiagnostic[0];
			const providedMonth = splittedProvidedDateDeDiagnostic[1];
			const providedYear = splittedProvidedDateDeDiagnostic[2];

			dateFin = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
			const isDateFinBeforeDateDebut: boolean = compareDesc(dateFin, new Date(dateDebut)) == 1;
			if (isDateFinBeforeDateDebut) {
				res.status(400).json({ message: 'bad end date' });
				return;
			}
		}

		try {
			if (await EntretienCarnetsModel.findOne({ where: { nom } })) {
				res.status(400).json({ message: 'booklet already exists' });
				return;
			}

			await EntretienCarnetsModel.create({
				nom,
				type,
				date_debut: dateDebut,
				date_fin: dateFin,
				id,
			});

			res.status(201).end();
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async deleteById(req: Request, res: Response): Promise<void> {
		try {
			const carnet = await EntretienCarnetsModel.findByPk(req.params.id_entretien_carnets);
			if (!carnet) {
				res.status(400).end();
				return;
			}

			await carnet.destroy();
			res.status(200).json({ message: 'booklet deleted' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		try {
			const carnets = await EntretienCarnetsModel.findAll({
				attributes: { exclude: ['id_entretien_carnets'] },
				limit: 1_000,
			});
			if (!carnets) {
				res.status(400).end();
				return;
			}

			res.status(200).json(carnets);
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const carnet = await EntretienCarnetsModel.findByPk(req.params.id_entretien_carnets, {
				attributes: { exclude: ['id_entretien_carnets'] },
			});
			if (!carnet) {
				res.status(400).end();
				return;
			}

			res.status(200).json(carnet);
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async updateById(req: Request, res: Response): Promise<void> {
		const { nom, type, date_debut, date_fin, id } = req.body;

		try {
			let dateDebut: null | Date = null;
			let dateFin: null | Date = null;
			let isProvidedDateDebutSameAsCurrentCarnet = true;
			let isProvidedDateFinSameAsCurrentCarnet = true;

			const carnet = await EntretienCarnetsModel.findByPk(req.params.id_entretien_carnets);
			if (!carnet) {
				res.status(400).end();
				return;
			}

			const {
				nom: carnetNom,
				type: carnetType,
				date_debut: carnetDateDebut,
				date_fin: carnetDateFin,
				id: carnetId,
			} = carnet.toJSON();

			const isSameNom: boolean = nom === carnetNom;
			if (!isSameNom) {
				if (await EntretienCarnetsModel.findOne({ where: { nom } })) {
					res.status(400).json({ message: 'cannot update booklet.' });
					return;
				}
			}

			const isSameAccountForeignKey: boolean = id === carnetId;
			if (!isSameAccountForeignKey) {
				if (!(await AccountsModel.findByPk(id))) {
					res.status(400).json({ message: 'cannot update booklet!' });
					return;
				}
			}

			{
				const splittedProvidedDateDeNaissance = date_debut.split('/');
				const providedDay = splittedProvidedDateDeNaissance[0];
				const providedMonth = splittedProvidedDateDeNaissance[1];
				const providedYear = splittedProvidedDateDeNaissance[2];

				dateDebut = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
				isProvidedDateDebutSameAsCurrentCarnet = compareAsc(dateDebut, new Date(carnetDateDebut)) == 0;
			}
			{
				const splittedProvidedDateDeDiagnostic = date_fin.split('/');
				const providedDay = splittedProvidedDateDeDiagnostic[0];
				const providedMonth = splittedProvidedDateDeDiagnostic[1];
				const providedYear = splittedProvidedDateDeDiagnostic[2];

				dateFin = new Date(`${providedYear}-${providedMonth}-${providedDay}`);
				const isDateFinBeforeDateDebut: boolean = compareDesc(dateFin, new Date(dateFin)) == 1;
				if (isDateFinBeforeDateDebut) {
					res.status(400).json({ message: 'bad end date' });
					return;
				}

				isProvidedDateFinSameAsCurrentCarnet = compareAsc(date_fin, new Date(carnetDateFin)) == 0;
			}

			const shouldUpdateCarnet: boolean =
				nom !== carnetNom ||
				type !== carnetType ||
				!isProvidedDateDebutSameAsCurrentCarnet ||
				!isProvidedDateFinSameAsCurrentCarnet ||
				id !== carnetId;

			if (!shouldUpdateCarnet) {
				res.status(400).json({ message: 'useless booklet update' });
				return;
			}

			carnet.setAttributes({
				nom,
				type,
				date_debut: dateDebut,
				date_fin: dateFin,
				id,
			});

			await carnet.save();
			res.status(204).end();
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
