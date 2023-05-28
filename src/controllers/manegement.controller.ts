import { Request, Response } from 'express';
import Accounts, { AccountsModel } from '../models/accounts.model';
import { Roles } from '../models/roles.enum';
import { Model, Op } from 'sequelize';
import { TicketModel } from '../models/ticket.model';
import { TiketController } from './tickets.controller';
import { EspacesModel } from '../models/espaces.model';
import sequelize from '../database/dbConnexion';
import { StatistiquesModel } from '../models/statistiques.model';
import { type } from 'os';

export class ManegementController {
	constructor() {}

	async openZoo(req: Request, res: Response): Promise<void> {
		const { employes } = req.body;

		if (!Array.isArray(employes)) {
			res.status(400).send({ message: 'bad request', error: 'expect a list of employes' });
			return;
		}
		const areAllEmployes = employes.every((employe) => {
			return (
				typeof employe.nom === 'string' &&
				typeof employe.prenom === 'string' &&
				typeof employe.email === 'string' &&
				typeof employe.mot_de_pass === 'string' &&
				typeof employe.a_badge === 'boolean' &&
				typeof employe.est_admin == 'boolean' &&
				typeof employe.est_employee === 'boolean' &&
				// TODO: check
				typeof employe.id_post === 'object' &&
				typeof employe.id_post.id_posts === 'number' &&
				typeof employe.id_post.nom === 'string'
			);
		});
		if (!areAllEmployes) {
			res.status(400).send({ message: 'bad request', error: 'expect a list of employes' });
			return;
		}

		// checking employes number //
		if (employes.length < 5) {
			res.status(400).send({ message: 'bad request', error: 'at least 5 employees are required to open the parc' });
			return;
		}
		// checking if accounts belonge to employées
		let notAllEmployes: boolean = false;
		employes.map((employe: Accounts): void => {
			if (!employe.est_employee) {
				notAllEmployes = true;
			}
		});
		if (notAllEmployes) {
			res.status(400).send({ message: 'bad request', error: 'only employees are required to open the parc' });
			return;
		}
		const hasSeller: boolean = employes.some((employe) => employe.id_post.nom === Roles.SELLER);
		const hasVet: boolean = employes.some((employe) => employe.id_post.nom === Roles.VET);
		const hasDesk: boolean = employes.some((employe) => employe.id_post.nom === Roles.DESK);
		const hasMantainer: boolean = employes.some((employe) => employe.id_post.nom === Roles.MANTAINER);
		const hasCarrer: boolean = employes.some((employe) => employe.id_post.nom === Roles.CAREARE);

		if (!hasDesk || !hasSeller || !hasVet || !hasCarrer || !hasMantainer) {
			res.status(400).send({
				message: 'bad request',
				error:
					'at least one seller one desk guy and one vet are one mantainer and one careare required to open the zoo',
			});
			return;
		}

		//checking if accounts are registerd
		let accountNotRegisterd: boolean = false;
		employes.forEach(async (employe: Accounts) => {
			try {
				const account: Model<Accounts> | null = await AccountsModel.findOne({
					where: {
						email: employe.email,
					},
				});
				if (!account) {
					accountNotRegisterd = false;
				}
			} catch (error) {
				res.status(501).send('internal server error').end();
				return;
			}
		});

		if (!accountNotRegisterd) {
			res.status(400).send({ message: 'bad request', error: 'one or many employes are not registerd' }).end();
			return;
		}

		res.status(200).send({ message: 'zoo can be opend' });
	}

	async enterZoo(req: Request, res: Response): Promise<void> {
		const { espace, ticket_id } = req.params;

		let areParamsValid = !Object.is(NaN, Number(espace)) && !Object.is(NaN, Number(ticket_id));
		if (!areParamsValid) {
			res.status(400).send({ message: 'bad params' });
			return;
		}

		try {
			// checking if the ticket exists //
			const userTicket = await TicketModel.findByPk(Number(ticket_id));

			if (!userTicket) {
				res.status(404).send({ message: 'ticket not found' });
				return;
			}

			// checking for the space //
			const currentEspace = await EspacesModel.findByPk(Number(espace));
			if (!currentEspace) {
				res.status(400).send({ message: "space dosen't exist" });
				return;
			}
			// checking if the ticket is used //
			if (userTicket.getDataValue('is_used')) {
				res.status(400).send({ message: 'ticket alleady used' });
				return;
			}

			// checking if the ticket allow entery to the space //
			const allowedSpaces: number[] = userTicket.getDataValue('allowed_spaces');
			const isAllowed = allowedSpaces.includes(Number(espace));

			if (!isAllowed) {
				res.status(400).send({ message: 'you are not allowed to enter this space' });
				return;
			}

			// checking the current space and the space to enter current space must be null or differnt //
			if (userTicket.getDataValue('current_space') == espace) {
				res.status(400).send({ message: 'you are already in the space' });
				return;
			}

			// checking the pass type and if the pass is valide //
			const isValid: boolean = await new TiketController().isValid(userTicket);
			if (!isValid) {
				res.status(400).send({ message: 'ticket not valid' });
				return;
			}

			// updating the current space //
			userTicket.set({ current_space: espace });

			// updating the space frequantation //
			currentEspace?.set({ taux_frequentation: currentEspace.getDataValue('taux_frequentation') + 1 });

			await userTicket?.save();
			await currentEspace?.save();

			//updating statistiques //
			const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
			await StatistiquesModel.create({
				date: now,
				ticket_id: Number(ticket_id),
				espace_id: Number(espace),
			});

			res.status(200).send({ ms: `user enterd the space ${currentEspace?.getDataValue('nom')}`, userTicket });
		} catch (error) {
			res.status(501).send('internal server error');
			console.log(error);
		}
	}

	async exitZoo(req: Request, res: Response): Promise<void> {
		const { espace, ticket_id } = req.params;

		let areParamsValid = !Object.is(NaN, Number(espace)) && !Object.is(NaN, Number(ticket_id));
		if (!areParamsValid) {
			res.status(400).send({ message: 'bad params' });
			return;
		}

		try {
			// checking if the ticket exists //
			const userTicket = await TicketModel.findByPk(Number(ticket_id));
			if (!userTicket) {
				res.status(404).send({ message: 'ticket not found' });
				return;
			}

			// checking if the ticket is used //
			if (userTicket.getDataValue('is_used')) {
				res.status(400).send({ message: 'ticket alleady used' });
				return;
			}

			// checking if the ticket allow entery to the space //
			const allowedSpaces: number[] = userTicket.getDataValue('allowed_spaces');
			const isAllowed = allowedSpaces.includes(Number(espace));

			if (!isAllowed) {
				res.status(400).send({ message: 'you are not allowed to enter this space' });
				return;
			}

			if (userTicket.getDataValue('current_space') != espace) {
				res.status(400).send({ message: 'you are in the wrong space' });
				return;
			}

			// updating the allowed spaces list//
			const newSpaces = allowedSpaces.filter((space) => space != Number(espace));

			userTicket.set({ allowed_spaces: newSpaces });

			if (newSpaces.length === 0) {
				userTicket.set({ is_used: true });
			}
			// updating the current space //
			await userTicket.set({ current_space: null });

			// updating the space frequantation //
			const currentEspace = await EspacesModel.findByPk(Number(espace));
			currentEspace?.set({ taux_frequentation: currentEspace.getDataValue('taux_frequentation') - 1 });

			await userTicket?.save();
			await currentEspace?.save();

			res.status(200).send({ ms: `user exited the space ${currentEspace?.getDataValue('nom')}`, userTicket });
		} catch (error) {
			res.status(501).send('internal server error');
			console.log(error);
		}
	}

	async oneSpaceFrequantation(req: Request, res: Response): Promise<void> {
		const { espace: espaceId } = req.params;

		let isEspaceIdNumber = !Object.is(NaN, Number(espaceId));
		if (!isEspaceIdNumber) {
			res.status(400).send({ message: 'bad param' });
			return;
		}

		try {
			const espace = await EspacesModel.findByPk(Number(espaceId));
			if (!espace) {
				res.status(404).send({ message: 'espace not found' }).end();
				return;
			}

			const freq = espace.getDataValue('taux_frequentation');
			res
				.status(200)
				.send({
					espace: espace.getDataValue('nom'),
					taux_frequentation: freq,
				})
				.end();
		} catch (error) {
			res.status(501).send('internal server error');
			console.log(error);
		}
	}

	async allSpacesFrequantation(req: Request, res: Response): Promise<void> {
		try {
			const allSpaces = await EspacesModel.findAll({
				attributes: [[sequelize.fn('SUM', sequelize.col('taux_frequentation')), 'total_taux_frequentation']],
			});

			if (!allSpaces) {
				res.status(400).send('you need to create somme spaces first');
				return;
			}

			const sum = allSpaces[0].getDataValue('total_taux_frequentation');

			res.status(200).send({ freqantation: sum }).end();
		} catch (error) {
			res.status(501).send('internal server error');
			console.log(error);
		}
	}

	async datStats(req: Request, res: Response): Promise<void> {
		const { date: providedDate, espace: espace_id } = req.params;
		// TODO: check date
		let isEspaceIdNumber = !Object.is(NaN, Number(espace_id));
		if (!isEspaceIdNumber) {
			res.status(400).send({ message: 'bad params' });
			return;
		}

		const date = new Date(providedDate).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});

		try {
			if (espace_id === null || espace_id === undefined) {
				const stats = await StatistiquesModel.findAll({
					where: {
						date: date,
					},
				});

				const vistorsNumber: number = stats.length;

				res
					.status(200)
					.send({
						date: date,
						nomber_des_visiteurs: vistorsNumber,
						détailes: stats,
					})
					.end();
			} else {
				const espace = await EspacesModel.findByPk(Number(espace_id));
				if (!espace) {
					res.status(403).send('espace not found');
					return;
				}

				const stats = await StatistiquesModel.findAll({
					where: {
						date: date,
						espace_id: espace_id,
					},
				});
				const vistorsNumber: number = stats.length;
				res
					.status(200)
					.send({
						espace_id: espace_id,
						date: date,
						nomber_des_visiteurs: vistorsNumber,
						détailes: stats,
					})
					.end();
			}
		} catch (error) {
			res.status(501).send('internal server error');
			console.log(error);
		}
	}

	async monthStats(req: Request, res: Response): Promise<void> {
		const { espace, month: monthNumber } = req.params;

		let areParamsValid = !Object.is(NaN, Number(espace)) && !Object.is(NaN, Number(espace));
		if (!areParamsValid) {
			res.status(400).send({ message: 'bad params' });
			return;
		}
		// TODO: handle monthNumber

		if (espace === undefined) {
			// TODO: startDate & endDate
			const startDate = new Date(`2023-${monthNumber}-01`);
			const endDate = new Date(`2023-${monthNumber + 1}-01`);

			try {
				const data = await StatistiquesModel.findAll({
					where: {
						date: {
							[Op.between]: [startDate, endDate],
						},
					},
				});

				const month: string = startDate.toLocaleDateString('default', { month: 'long' });
				res.status(200).send({ month: month, nomber_des_visiteurs: data.length });
			} catch (error) {
				res.status(501).send('internal server error');
				console.log(error);
			}
		} else {
			try {
				const thisEspace = await EspacesModel.findByPk(Number(espace));
				if (!thisEspace) {
					res.status(403).send('espace not found');
					return;
				}

				// TODO: startDate & endDate
				const startDate = new Date(`2023-${monthNumber}-01`);
				const endDate = new Date(`2023-${monthNumber + 1}-01`);
				const data = await StatistiquesModel.findAll({
					where: {
						date: {
							[Op.between]: [startDate, endDate],
						},
						espace_id: espace,
					},
				});
				const month: string = startDate.toLocaleDateString('default', { month: 'long' });
				res.status(200).send({ month: month, nomber_des_visiteurs: data.length });
			} catch (error) {
				res.status(501).send('internal server error');
				console.log(error);
			}
		}
	}

	async bestMonthForRepairs(req: Request, res: Response) {
		const visitorCountByMonth: { [month: string]: number } = {};

		try {
			const data = await StatistiquesModel.findAll();
			// Calculate visitor count for each month
			data.forEach((detail: any) => {
				const visitDate = detail.date;
				const month = new Date(visitDate).toLocaleString('default', { month: 'long' });

				if (visitorCountByMonth.hasOwnProperty(month)) {
					visitorCountByMonth[month]++;
				} else {
					visitorCountByMonth[month] = 1;
				}
			});

			// Find month with the least number of visitors
			let leastVisitorsMonth: string | null = null;
			let minVisitorCount = Infinity;

			for (const month in visitorCountByMonth) {
				if (visitorCountByMonth.hasOwnProperty(month)) {
					const visitorCount = visitorCountByMonth[month];

					if (visitorCount < minVisitorCount) {
						minVisitorCount = visitorCount;
						leastVisitorsMonth = month;
					}
				}
			}

			res.send(leastVisitorsMonth);
		} catch (e) {
			res.status(500).end();
		}
	}
}
