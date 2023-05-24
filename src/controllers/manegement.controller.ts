import { Request, Response } from 'express';
import Accounts, { AccountsModel } from '../models/accounts.model';
import { Roles } from '../models/roles.enum';
import { Model } from 'sequelize';
import { tr } from 'date-fns/locale';
import { Ticket, TicketModel } from '../models/ticket.model';
import { isValid } from 'date-fns';
import { TiketController } from './tickets.controller';
import { EspacesModel } from '../models/espaces.model';
import sequelize from '../database/dbConnexion';

export class ManegementController {
	constructor() {}

	async openZoo(req: Request, res: Response): Promise<void> {
		const employes: any[] = req.body;

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
			const isValid: boolean = new TiketController().isValid(userTicket);
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

			console.log(userTicket);

			//updating statistiques //

			res.status(200).send({ ms: `user enterd the space ${currentEspace?.getDataValue('nom')}`, userTicket });
		} catch (error) {
			res.status(501).send('internal server error');
			console.log(error);
		}
	}

	async exitZoo(req: Request, res: Response): Promise<void> {
		const { espace, ticket_id } = req.params;
		try {
			// checking if the ticket exists //
			const userTicket = await TicketModel.findByPk(Number(ticket_id));
			console.log(userTicket);
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

			// checking the pass type and if the pass is valide //
			const isValid: boolean = new TiketController().isValid(userTicket);
			if (!isValid) {
				res.status(400).send({ message: 'ticket not valid' });
				return;
			}

			// updating the allowed spaces list//
			const newSpaces = allowedSpaces.filter((space) => space != Number(espace));
			console.log(newSpaces);
			console.log(newSpaces);
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

			//updating statistiques here  //

			res.status(200).send({ ms: `user exited the space ${currentEspace?.getDataValue('nom')}`, userTicket });
		} catch (error) {
			res.status(501).send('internal server error');
			console.log(error);
		}
	}

	async oneSpaceFrequantation(req: Request, res: Response): Promise<void> {
		const espaceId = req.params.espace;
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
}
