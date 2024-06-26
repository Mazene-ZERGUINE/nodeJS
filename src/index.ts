require('dotenv').config();
import express, { Express, Request, Response } from 'express';
import sequelize from './database/dbConnexion';
import AppRouter from './utils/AppRouter';
import { insertPasses, insertPostes } from './utils/insertRols';
import session from 'express-session';
import { useMiddlewaresAndRoutes } from './utils/app-uses.utils';
import { emptyBodyError } from './middlewares/input-errors-handler.middleware';

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

insertPostes();
insertPasses();
useMiddlewaresAndRoutes(app);
//app.use(emptyBodyError);

const appRouter = new AppRouter();
appRouter.initRoutes(app);

app.listen(PORT, () => {
	console.log('app is running at port ' + PORT);
});
