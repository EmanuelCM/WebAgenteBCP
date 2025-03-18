import { Router } from 'express';
import { CampanasController } from './controller';
import { CampanaService } from '../services/campana.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';




export class CampanasRoutes{


    static get routes():Router{

        const router=Router ();

        const campanaService = new CampanaService();

        const controller = new CampanasController(campanaService);

        router.post('/create/',controller.createCampanas);
        router.delete('/delete/:id',controller.deleteCampana);
        router.put('/update/:id',controller.updateCampanas);
        router.get('/get-camapans/',controller.getCampanas);



        return router;


    }




}