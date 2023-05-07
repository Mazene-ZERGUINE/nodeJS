import { config } from "dotenv";
config() ;
import express, { Express, Request, Response } from 'express';

import sequelize from './database/dbConnexion';

const app: Express = express();
const port: number = 3000 ;


// database connexion
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


// starting server
app.listen(port , () => {
    console.log("app running") ;
});

app.get('/' , (req: Request , res: Response) => {
    res.send(`app is listening at port ${port}`);
})
