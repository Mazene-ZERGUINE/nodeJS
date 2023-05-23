import { Request, Response } from 'express';
import { EspecesModel } from '../models/especes.model';
import { AnimauxModel } from '../models/animaux.model';
import { error } from 'console';

export class EspecesController {
	static async create(req: Request, res: Response): Promise<void> {
		const { nom, id_espaces } = req.body;

		try {
			const espece = await EspecesModel.findOne({ where: { nom } });
			if (espece) {
				res.status(400).json({ message: 'name already exists' });
				return;
			}

			await EspecesModel.create({ nom: nom, id_espaces: id_espaces });
			res.status(201).end();
		} catch (error) {
			res.status(500).json({ message: 'internal server error', error: error });
			console.log(error);
		}
	}

	static async deleteById(req: Request, res: Response): Promise<void> {
		try {
			const espece = await EspecesModel.findByPk(req.params.id);
			if (!espece) {
				res.status(400).end();
				return;
			}

			await espece.destroy();
			res.status(200).json({ message: 'species deleted' });
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		try {
			const espece = await EspecesModel.findAll({
				attributes: { exclude: ['id_especes'] },
				limit: 1_000,
				include: {
					model: AnimauxModel,
					as: 'animaux',
				},
			});
			if (!espece) {
				res.status(400).end();
				return;
			}

			res.status(200).json(espece);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
			console.log(error);
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const especes = await EspecesModel.findByPk(req.params.id, {
				attributes: { exclude: ['id_especes'] },
				include: {
					model: AnimauxModel,
					as: 'animaux',
				},
			});
			if (!especes) {
				res.status(400).end();
				return;
			}

			res.status(200).json(especes);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async updateById(req: Request, res: Response): Promise<void> {
		const { nom: providedNom } = req.body;

		try {
			const espece = await EspecesModel.findByPk(req.params.id);
			if (!espece) {
				res.status(400).end();
				return;
			}

			const { id_especes, nom: especeNom } = espece.toJSON();

			const shouldUpdateEspece: boolean = providedNom !== especeNom;
			if (!shouldUpdateEspece) {
				res.status(409).end();
				return;
			}

			espece.setAttributes({ id_especes, nom: providedNom });
			await espece.save();

			res.status(204).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
