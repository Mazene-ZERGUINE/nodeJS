import { Router, Request, Response } from 'express';
import { TiketController } from '../controllers/tickets.controller';

export default class TicketsRoutes {
	private readonly router: Router = Router();
	private readonly ticketsController: TiketController = new TiketController();

	constructor() {
		this.setRoutes();
	}

	get getRouter(): Router {
		return this.router;
	}
	setRoutes(): void {
		this.router.post('/', this.ticketsController.create);
	}
}
