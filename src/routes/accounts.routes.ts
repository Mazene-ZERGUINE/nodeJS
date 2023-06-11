import { Router, Request, Response } from 'express';
import AccountsController from '../controllers/accounts.controller';
import { checkUserRole, isAuthenticated, isEmploye } from '../middlewares/Authentication';
import { Roles } from '../models/roles.enum';

export default class AccountsRoutes {
	private readonly router: Router = Router();
	private readonly accountsController: AccountsController = new AccountsController();

	constructor() {
		this.setRoutes();
	}

	get getRouter(): Router {
		return this.router;
	}
	setRoutes(): void {
		this.router.get('/', [isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN)], this.accountsController.getAll);
		this.router.get(
			'/:account_id',
			[isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN)],
			this.accountsController.getOne,
		);
		this.router.post('/create_account', this.accountsController.create);
		this.router.delete(
			'/delete_account/:account_id',
			[isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN)],
			this.accountsController.delete,
		);
		this.router.patch(
			'/update_account/:account_id',
			[isAuthenticated, isEmploye, checkUserRole(Roles.ADMIN)],
			this.accountsController.update,
		);
		this.router.post('/login', this.accountsController.logIn);
		this.router.post('/logout', this.accountsController.logout);
	}
}
