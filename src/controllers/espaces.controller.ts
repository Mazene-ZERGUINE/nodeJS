import { Request, Response } from 'express';

import { EspacesModel } from '../models/espaces.model';
import { EspaceTypesModel } from '../models/espace-types.model';
import { EspecesModel } from '../models/especes.model';

export class EspacesController {
	static async create(req: Request, res: Response): Promise<void> {
		const {
			nom,
			description,
			image,
			capacite,
			duree,
			a_acces_handicape,
			est_en_entretien,
			taux_frequentation,
			id_espace_types,
			id_especes,
		} = req.body;

		try {
			const espace = await EspacesModel.findOne({ where: { nom } });
			if (espace) {
				res.status(400).json({ message: 'name already exists' });
				return;
			}

			const isOneForeignKeyNotFound =
				!(await EspecesModel.findByPk(id_especes)) || !(await EspaceTypesModel.findByPk(id_espace_types));
			if (isOneForeignKeyNotFound) {
				res.status(400).end();
				return;
			}

			await EspacesModel.create({
				nom,
				description,
				image,
				capacite,
				duree,
				a_acces_handicape,
				est_en_entretien,
				taux_frequentation,
				id_espace_types,
				id_especes,
			});

			res.status(201).end();
		} catch (_) {
			console.log(_);
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async deleteById(req: Request, res: Response): Promise<void> {
		try {
			const espace = await EspacesModel.findByPk(req.params.id);
			if (!espace) {
				res.status(400).end();
				return;
			}

			await espace.destroy();
			res.status(200).json({ message: 'space deleted' });
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getAll(req: Request, res: Response): Promise<void> {
		try {
			const espaces = await EspacesModel.findAll({ attributes: { exclude: ['id_espaces'] }, limit: 1_000 });
			if (!espaces) {
				res.status(400).end();
				return;
			}

			res.status(200).json(espaces);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async getOneById(req: Request, res: Response): Promise<void> {
		try {
			const espace = await EspacesModel.findByPk(req.params.id, { attributes: { exclude: ['id_espaces'] } });
			if (!espace) {
				res.status(400).end();
				return;
			}

			res.status(200).json(espace);
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async updateById(req: Request, res: Response): Promise<void> {
		const {
			nom: providedNom,
			description: providedDescription,
			image: providedImage,
			capacite: providedCapacite,
			duree: providedDuree,
			a_acces_handicape: providedAAccesHandicape,
			est_en_entretien: providedEstEnEntretien,
			taux_frequentation: providedTauxFrequentation,
			id_espace_types: providedIdEspaceTypes,
			id_especes: providedIdEspeces,
		} = req.body;

		try {
			const espace = await EspacesModel.findByPk(req.params.id);
			if (!espace) {
				res.status(400).end();
				return;
			}

			const isOneForeignKeyNotFound =
				!(await EspecesModel.findByPk(providedIdEspeces)) || !(await EspaceTypesModel.findByPk(providedIdEspaceTypes));
			if (isOneForeignKeyNotFound) {
				res.status(400).end();
				return;
			}

			const {
				nom: especeNom,
				description: especeDescription,
				image: especeImage,
				capacite: especeCapacite,
				duree: especeDuree,
				a_acces_handicape: especeAAccesHandicape,
				est_en_entretien: especeEstEnEntretien,
				taux_frequentation: especeTauxFrequentation,
				id_espace_types: especeIdEspaceTypes,
				id_especes: especeIdEspeces,
			} = espace.toJSON();

			const shouldUpdateEspace: boolean =
				providedNom !== especeNom ||
				(providedDescription !== undefined && providedDescription !== especeDescription) ||
				(providedImage !== undefined && providedImage !== especeImage) ||
				providedCapacite !== especeCapacite ||
				providedDuree !== especeDuree ||
				providedAAccesHandicape !== especeAAccesHandicape ||
				providedEstEnEntretien !== especeEstEnEntretien ||
				(providedTauxFrequentation !== undefined && providedTauxFrequentation !== especeTauxFrequentation) ||
				providedIdEspaceTypes !== especeIdEspaceTypes ||
				providedIdEspeces !== especeIdEspeces;

			if (!shouldUpdateEspace) {
				res.status(400).end();
				return;
			}

			espace.setAttributes({
				nom: providedNom,
				description: providedDescription !== undefined ? especeDescription : providedDescription,
				image: providedImage !== undefined ? especeImage : providedImage,
				capacite: providedCapacite,
				duree: providedDuree,
				a_acces_handicape: providedAAccesHandicape,
				est_en_entretien: providedEstEnEntretien,
				taux_frequentation:
					providedTauxFrequentation !== undefined ? especeTauxFrequentation : providedTauxFrequentation,
				id_espace_types: providedIdEspaceTypes,
				id_especes: providedIdEspeces,
			});

			await espace.save();
			res.status(204).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}

	static async updateEstEnEntretienById(req: Request, res: Response): Promise<void> {
		const { est_en_entretien: providedEstEnEntretien } = req.body;

		try {
			const espace = await EspacesModel.findByPk(req.params.id);
			if (!espace) {
				res.status(400).end();
				return;
			}

			const { est_en_entretien } = espace.toJSON();
			const shouldUpdateEspace: boolean = providedEstEnEntretien !== est_en_entretien;
			if (!shouldUpdateEspace) {
				res.status(400).end();
				return;
			}

			espace.update({ est_en_entretien: providedEstEnEntretien });
			await espace.save();

			res.status(204).end();
		} catch (_) {
			res.status(500).json({ message: 'internal server error' });
		}
	}
}
