import { Express } from "express";
import * as express from 'express' ;
import { config } from "dotenv";

const app: Express = express();
const port: number = 3000 ;

config() ;
app.listen(port);


app.listen(port , () => {
    console.log("app running") ;
});