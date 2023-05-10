import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'zoo',
  dialect: 'postgres',
  username: 'psql',
  password: 'root',
  host: 'localhost',
  port: 5432,
  models: [__dirname + '/models'],
  logging: false // set to true to enable SQL logging
});

export default sequelize;
