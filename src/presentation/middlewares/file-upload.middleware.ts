import { NextFunction ,Request,Response } from "express";



export class FileUploadMiddleware{


  static containFiles(req:Request, res:Response, next:NextFunction){

     //valida si se tiene algun objeto cargado
      if ( !req.files||Object.keys(req.files).length===0){
          return res.status(400).json({ error:'No files were Selected'});
      }

      //* req.files.file es un posible arreglo de files 
      if (!Array.isArray(req.files.file)){ //*valida si es un arreglo 
          req.body.files = [req.files.file];  //* si no es un arreglo asigna al body el file como un arrelgo 
      }else{
          req.body.files= req.files.file; //* si es un arreglo asigna el arreglo al body 
      }

      next();


  }


}

