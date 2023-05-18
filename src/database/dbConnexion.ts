import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize';

const sequelize = new Sequelize({
	database: process.env.DB_NAME as string,
	dialect: process.env.DB_DIALECT as Dialect,
	username: process.env.DB_USER as string,
	password: process.env.DB_PASSWORD as string,
	host: process.env.DB_HOST as string,
	port: parseInt(process.env.DB_PORT as string),
	models: [__dirname + '/models'],
	logging: false,
});

export default sequelize;
