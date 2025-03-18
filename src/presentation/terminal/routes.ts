import { Router } from "express";
import { TerminalController } from "./controller";
import { TerminalService } from "../services/terminal.service";



export class TerminalRoutes{

     static get routes(): Router {

        const router=Router();
        const terminalService=new TerminalService();
        const controller= new TerminalController(terminalService);

        router.post('/create/',controller.createTerminal);
        router.put('/update/:terminal',controller.updateTerminal);
        router.delete('/delete/:terminal',controller.deleteTerminal);
        router.get('/find/:terminal',controller.getByTerminal);
        router.get('/find-by-ruc/:ruc',controller.getTerminalByRuc);




            return router;
    }

    
}