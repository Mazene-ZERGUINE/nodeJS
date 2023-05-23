import { Request, Response } from 'express';
import { Model } from 'sequelize';
import { Ticket, TicketModel } from '../models/ticket.model';

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
}
