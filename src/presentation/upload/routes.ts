import { Router } from 'express';
import fs from 'fs';
import { NpsController } from './controller';
import {FileUploadMiddleware} from '../middlewares/file-upload.middleware';
import {DataUploadService} from '../services/data.upload.service';
import { FileUploadService } from '../services/file-upload.service';



export class Uploadroutes {


  static get routes(): Router {

    const router = Router();

    

    const fileUploadService= new FileUploadService();
    const controller= new NpsController(fileUploadService);

    router.use(FileUploadMiddleware.containFiles)

// Asegúrate de que exista el directorio de uploads
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

    // Definir las rutas
    router.post('/upload-nps/',controller.uploadNpsBD);
    // router.post('/upload-user/',controller.uploadNps);
    // router.post('/upload-/',controller.uploadNps);



    return router;
  }


}
