import path from 'path';
import fs from 'fs';
import { UploadedFile } from "express-fileupload";
import { Uuid } from '../../config';
import { CustomError } from '../../domain';


export class FileUploadService {
    constructor(private readonly uuid = Uuid.v4) {}

    private checkFolder(folderPath: string) {
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
    }

    async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['xlsx', 'xls'] 
    ) {
        try {
            // ✅ Obtener la extensión del archivo correctamente
            const fileExtension = path.extname(file.name).replace('.', '').toLowerCase(); 

            if (!validExtensions.includes(fileExtension)) {
                throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid ones: ${validExtensions}`);
            }

            const destination = path.resolve(__dirname, '../../../', folder);
            this.checkFolder(destination);

            const fileName = `${this.uuid()}.${fileExtension}`;

            await file.mv(`${destination}/${fileName}`);

            return { fileName };
                
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    //* segun la carga de archivos llamara al single 
    async uploadMultiple(
        files:UploadedFile[],
        folder:string = 'uploads',
        validExtensions: string[]= ['png','jpg','jpeg','gif']
    ){

        const fileNames = await Promise.all(
            files.map(file=> this.uploadSingle(file, folder,validExtensions)
            )
        )
        return fileNames;

    }


}