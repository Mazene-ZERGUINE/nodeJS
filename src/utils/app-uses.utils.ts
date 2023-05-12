import { Express, json } from 'express';
import cors from 'cors';
import helmet from 'helmet';

export function useMiddlewaresAndRoutes(app: Express): void {
	useMiddlewares(app);
	useRoutes(app);
}

function useMiddlewares(app: Express): void {
	app
		.use(cors())
		.use(json({ type: '*/*' }))
		.use(helmet());
}

function useRoutes(app: Express): void {}
