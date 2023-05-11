import { useMiddlewaresAndRoutes } from './utils/app-uses.utils';

require('dotenv').config();
import express, { Express, Request, Response } from 'express';

import sequelize from './database/dbConnexion';

const app: Express = express();
const HOST = process.env.SERVER_HOST || 'localhost';
const PORT = process.env.SERVER_PORT || 3000;

// database connexion
sequelize
	.sync({ force: false })
	.then(() => {
		console.log('Database connected');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

useMiddlewaresAndRoutes(app);

// starting server
app.listen(PORT, () => {
	console.log('app running');
});

app.get('/', (req: Request, res: Response) => {
	res.send(`app is listening on ${HOST}:${PORT}`);
});
