import { Express } from 'express';
import * as express from 'express';

import AccountsRoutes from '../routes/accounts.routes';
import animauxRouter from '../routes/animaux.router';
import especesRouter from '../routes/especes.router';
import espaceTypesRouter from '../routes/espace-types.router';
import espacesRouter from '../routes/espaces.router';

export default class AppRouter {
	constructor() {}

	private readonly accountsRoutes = new AccountsRoutes();

	initRoutes = (app: Express) => {
		app.use(express.json({ type: '*/*' }));
		app
			.use('/api/accounts/', this.accountsRoutes.getRouter)
			.use('/api/animaux', animauxRouter)
			.use('/api/especes', especesRouter)
			.use('/api/espace-types', espaceTypesRouter)
			.use('/api/espaces', espacesRouter);
	};
}
