import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { Uploadroutes } from './upload/routes';

import { CampanasRoutes } from './campanas/routes';
import { TerminalRoutes } from './terminal/routes';
import {AuthMiddleware} from './middlewares/auth.middleware';
import { UserRoutes } from './user/routes';






export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    // router.use(AuthMiddleware.validateJWT);
    router.use('/api/user', UserRoutes.routes);
    router.use('/api/terminal', TerminalRoutes.routes);
    router.use('/api/campanas', CampanasRoutes.routes);



    router.use('/api/upload', Uploadroutes.routes);




    return router;
  }


}

