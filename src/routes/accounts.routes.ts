import { Router , Request , Response } from "express";
import AccountsController from "../controllers/accounts.controller";

export default class AccountsRoutes { 

    private readonly router: Router =  Router();
    private readonly accountsController: AccountsController = new AccountsController();

    constructor() {
        this.setRoutes();
     }

     get getRouter(): Router {
        return this.router ;
    }
    setRoutes(): void {
        this.router.get('/' , this.accountsController.getAll) ;
        this.router.get('/:account_id' , this.accountsController.getOne) ; 
        this.router.post('/create_account' , this.accountsController.create) ; 
        this.router.delete("/delete_account" ,this.accountsController.update) ;
        this.router.patch('/update_account/:account_id' ,this.accountsController.update);
    }

}