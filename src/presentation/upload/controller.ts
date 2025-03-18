import {Request, Response} from 'express';
import { CustomError } from '../../domain';
import path from 'path';
import mongoose from 'mongoose';
import fs from 'fs';
import * as xlsx from 'xlsx';
import { DataUploadService } from '../services/data.upload.service';
import {UploadedFile} from 'express-fileupload';
import { FileUploadService } from '../services/file-upload.service';
import {UserModel} from '../../data';
import {IndicadorModel} from '../../data/mongo/models/nps.models';



export class NpsController {
    private fileUploadService: FileUploadService;

    constructor(fileUploadService: FileUploadService) {
      this.fileUploadService = fileUploadService;
      // this.uploadNps = this.uploadNps.bind(this); // ⚠️ Esto es clave para evitar `undefined`
    }


    private handleError=(error:unknown, res:Response)=>{
        //* validamos si error recibido esta instanciado en nuestra clase 
        if (error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message});
        }

        return res.status(500).json({error:`Internal Error`})
    }

    private uploadFile = async (file: UploadedFile): Promise<string>=>{
      const uploaded = await this.fileUploadService.uploadSingle(file, 'uploads', ['xlsx', 'xls']);
      const  filePath = path.resolve(__dirname, '../../../uploads', uploaded.fileName);
      return filePath;
    }



    async uploadNpsBD(req: Request, res: Response) {
          const filePath  = await this.uploadFile(req.body.files[0]);
          try {
          const result = await DataUploadService.uploadIndicadores(filePath );
          res.json({ message: 'Archivo procesado correctamente', data: result });
    
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error al procesar el archivo' });
        }
      }




      getNpsUser= async (req:Request, res:Response)=>{

        const nps = await IndicadorModel.findById(req.params.terminal);
        res.json(nps);

      }




        



}


