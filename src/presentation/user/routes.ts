import { Router } from "express";
import { UserController } from "./controller";
import { UserService } from '../services/user.service';



export class UserRoutes{

     static get routes(): Router {

        const router=Router();
        const userService= new UserService();
        const controller = new UserController(userService);

        router.post('/create/',controller.createUser);
        router.delete('/delete/:ruc',controller.deleteUser);
        router.put('/update/:ruc',controller.updateUser);
        router.get('/find/:ruc',controller.findUser);
        router.get('/find-all/',controller.findUserAll);

            return router;
    }

    
}