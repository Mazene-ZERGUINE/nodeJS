import { Roles } from './../models/roles.enum';
import { Router, Request, Response } from 'express';
import { checkUserRole, isAuthenticated, isEmploye } from '../middlewares/Authentication';
import { ManegementController } from '../controllers/manegement.controller';

export default class ManegementRoutes {
	private readonly router: Router = Router();
	private readonly manegementController: ManegementController = new ManegementController();

	constructor() {
		this.setRoutes();
	}

	get getRouter(): Router {
		return this.router;
	}
	setRoutes(): void {
		this.router.post(
			'/opening',
			[isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN)],
			this.manegementController.openZoo,
		);
	}
}
