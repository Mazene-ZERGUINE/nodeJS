import { Request, Response } from 'express';

import { EspacesModel } from '../models/espaces.model';
import { EspecesModel } from '../models/especes.model';
import { EspacesEspecesModel } from '../models/espaces-especes';

export class EspacesEspecesController {
	static async create(req: Request, res: Response): Promise<void> {
		const { id_espaces, id_especes } = req.body;

		try {
			const espaceEspece = await EspacesEspecesModel.findOne({ where: { id_espaces, id_especes } });
			if (espaceEspece) {
				res.status(400).json({ message: 'already exists' });
				return;
			}

			const isOnePrimaryKeyNotFound =
				!(await EspacesModel.findByPk(id_espaces)) || !(await EspecesModel.findByPk(id_especes));
			if (isOnePrimaryKeyNotFound) {
				res.status(400).end();
				return;
			}

			await EspacesEspecesModel.create({ id_especes, id_espaces });
			res.status(201).end();
		} catch (_) {
			console.log(_);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async deleteById(req: Request, res: Response): Promise<void> {
		try {
			const { id_espaces, id_especes } = req.params;
			const espaceEspece = await EspacesEspecesModel.findOne({ where: { id_espaces, id_especes } });
			if (!espaceEspece) {
				res.status(400).end();
				return;
			}

			await espaceEspece.destroy();
			res.status(200).json({ message: 'deleted' });
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		try {
			const espaceEspeces = await EspacesEspecesModel.findAll({ limit: 1_000 });
			if (!espaceEspeces) {
				res.status(400).end();
				return;
			}

			res.status(200).json(espaceEspeces);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const { id_espaces, id_especes } = req.params;
			const espaceEspece = await EspacesEspecesModel.findOne({ where: { id_espaces, id_especes } });
			if (!espaceEspece) {
				res.status(400).end();
				return;
			}

			res.status(200).json(espaceEspece);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
