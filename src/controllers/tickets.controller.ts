import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { Ticket, TicketModel } from '../models/ticket.model';
import { PassModel } from '../models/pass.model';
import { tr } from 'date-fns/locale';

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

	isValid(userTicket: any): boolean {
		// day pass checks here //

		// week-end pass checks here //

		// other passes here //

		return true;
	}
}
