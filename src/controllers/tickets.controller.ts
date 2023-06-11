import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { Ticket, TicketModel } from '../models/ticket.model';
import { PassModel, Passes } from '../models/pass.model';

export class TiketController {
	constructor() {}

	async create(req: Request, res: Response): Promise<void> {
		const { allowed_spaces, date, pass_id } = req.body;

		try {
			const ticket: Model<Ticket> = await TicketModel.create({
				allowed_spaces: allowed_spaces,
				date: date,
				pass_id: pass_id,
			});

			res.status(201).send({ message: 'ticket createed', ticket: ticket }).end();
		} catch (error) {
			res.status(501).send('internal server error').end();
			console.log(error);
		}
	}

	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const tickets = await TicketModel.findAll({
				include: { model: PassModel, as: 'pass' },
			});
			res.status(200).send(tickets).end();
		} catch (error) {
			res.status(501).send('internal server error').end();
			console.log(error);
		}
	}

	async isValid(userTicket: Model<any>): Promise<boolean> {
		try {
			// day pass checks here //
			const pass = await PassModel.findByPk(userTicket.getDataValue('pass_id'));
			if (pass?.getDataValue('nom') === Passes.DAYPASS) {
				const passDay: Date = userTicket.getDataValue('date');
				const today: Date = new Date();

				if (
					passDay.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' }) !==
					today.toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' })
				) {
					return false;
				}
			}
			// week-end pass checks here //
			if (pass?.getDataValue('nom') === Passes.WEEKEDNPASS) {
				const today: string = new Date().toLocaleDateString('en-US', { weekday: 'long' });
				if (today !== 'Saturday' && today !== 'Sunday') {
					return false;
				}
			}
			// other passes here //
		} catch (error) {
			console.log(error);
			return false;
		}

		return true;
	}
}
