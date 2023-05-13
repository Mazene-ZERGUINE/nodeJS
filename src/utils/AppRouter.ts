import  { Express } from 'express';
import * as express from 'express';
import AccountsRoutes from '../routes/accounts.routes';



export default class AppRouter {
	constructor() {}
    private readonly accountsRoutes = new AccountsRoutes();
    

	initRoutes = (app: Express) => {
		app.use(express.json({ type: '*/*' }));
        app.use('/api/accounts/' , this.accountsRoutes.getRouter);
	};
}