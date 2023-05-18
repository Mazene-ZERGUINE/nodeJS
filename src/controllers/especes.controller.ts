import { Request, Response } from 'express';
import { EspecesModel } from '../models/especes.model';

export class EspecesController {
	static async create(req: Request, res: Response): Promise<void> {
		const { nom } = req.body;

		try {
			const espece = await EspecesModel.findOne({ where: { nom } });
			if (espece) {
				res.status(400).json({ message: 'name already exists' });
				return;
			}

			await EspecesModel.create({ nom });
			res.status(201).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
