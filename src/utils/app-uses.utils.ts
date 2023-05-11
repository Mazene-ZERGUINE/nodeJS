import { Express, json } from 'express';

export function useMiddlewaresAndRoutes(app: Express): void {
	useMiddlewares(app);
	useRoutes(app);
}

function useMiddlewares(app: Express): void {
	app.use(json({ type: '*/*' }));
}

function useRoutes(app: Express): void {}
