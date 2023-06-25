import { Request, Response } from 'express';

import { EspaceTypesModel } from '../models/espace-types.model';

export class EspaceTypesController {
	static async create(req: Request, res: Response): Promise<void> {
		const { nom } = req.body;

		try {
			const espace = await EspaceTypesModel.findOne({ where: { nom } });
			if (espace) {
				res.status(400).json({ message: 'name already exists' });
				return;
			}

			await EspaceTypesModel.create({ nom });
			res.status(201).end();
		} catch (error) {
			res.status(500).json({ message: 'internal server error', error });
			console.log(error);
		}
	}

	static async deleteById(req: Request, res: Response): Promise<void> {
		try {
			const espaceType = await EspaceTypesModel.findByPk(req.params.id);
			if (!espaceType) {
				res.status(400).end();
				return;
			}

			await espaceType.destroy();
			res.status(200).json({ message: 'space type deleted' });
		} catch (e) {
			console.log(e);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		try {
			const espaceTypes = await EspaceTypesModel.findAll({
				limit: 1_000,
			});
			if (!espaceTypes) {
				res.status(400).end();
				return;
			}

			res.status(200).json(espaceTypes);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const espaceType = await EspaceTypesModel.findByPk(req.params.id);
			if (!espaceType) {
				res.status(400).end();
				return;
			}

			res.status(200).json(espaceType);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async updateById(req: Request, res: Response): Promise<void> {
		const { nom: providedNom } = req.body;

		try {
			const espaceType = await EspaceTypesModel.findByPk(req.params.id);
			if (!espaceType) {
				res.status(400).end();
				return;
			}

			const { id_espace_types, nom: especeNom } = espaceType.toJSON();

			const shouldUpdateEspaceType: boolean = providedNom !== especeNom;
			if (!shouldUpdateEspaceType) {
				res.status(409).end();
				return;
			}

			espaceType.setAttributes({ id_espace_types, nom: providedNom });
			await espaceType.save();

			res.status(204).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
