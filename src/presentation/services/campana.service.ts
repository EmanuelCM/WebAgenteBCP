import { CampanaModel } from "../../data";
import {CampanaDto, CustomError, TerminalDto} from '../../domain';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import {TerminalModel} from '../../data/mongo/models/terminal.model';
import { ObjectId, Types } from "mongoose";
import { ICampana } from '../../data/mongo/models/campana.model';



export class CampanaService{

    constructor(){}

    private validateDataUpdate (campana: ICampana, update: Partial<CampanaDto> ) {

        const validFields = Object.keys(new CampanaDto('', '', '', new Date(), new Date(), false, ''));
        const validUpdate: Record<string, any> = {};

        for (const key of Object.keys(update)) {
            if (!validFields.includes(key)) {
                throw CustomError.badRequest(`Invalid field: ${key}`);
            }
            
            // Validar cada campo individualmente
            const error = CampanaDto.validateField(key, update[key as keyof CampanaDto]);
            if (error) {
                throw CustomError.badRequest(`Invalid ${key}: ${error}`);
            }
            
            // Procesar valores especiales
            if (key === 'fechaInicio' || key === 'fechaFin') {
                validUpdate[key] = CampanaDto.parseDate(update[key as keyof CampanaDto]);
            } else if (key === 'estado' && typeof update.estado !== 'boolean') {
                validUpdate[key] = update.estado === 'true';
            } else {
                validUpdate[key] = update[key as keyof CampanaDto];
            }
        }

        const error = CampanaDto.validateDate(validUpdate, campana );
        if (error) {
            throw CustomError.badRequest(`${error}`);
        }

        return validUpdate
    }

     async createCampana(campanaDto:CampanaDto){

        try {
            const campana = new CampanaModel(campanaDto);
            await campana.save();
            return campana;

        }
        catch (error){
            throw CustomError.internalServer(`${error},test`);

        }
    }


    async getCampanas(paginacionDto:PaginationDto){

        const {page,limit}= paginacionDto;

        try{

            const [total,camapana]= await Promise.all([
                CampanaModel.countDocuments(),
                CampanaModel.find()
                .skip((page-1)*limit)
                .limit(limit)
    
                //todo:populate
                ])
           
     
                return {
                    page,
                    limit,
                    total,
                    camapana
                    
                }

        }

        catch(error){
            throw CustomError.internalServer('Internal server Error')
        }
    }

    async updateCampana(campana: ICampana, update: Partial<CampanaDto>) {
        try {

            const  validUpdate =  this.validateDataUpdate(campana,update)
                        
            const updateCampana = await CampanaModel.findOneAndUpdate(
                { _id: campana._id },
                { $set: validUpdate },
                { new: true, runValidators: true }
            );
            
            return updateCampana;
        } catch (error: any) {
            console.log('Error updating Campana', error);
            throw CustomError.internalServer(error.message);
        }
    }




    async deleteCampana(campanaID:Types.ObjectId){
        try {
            const  campana= await CampanaModel.findByIdAndDelete(campanaID);
            if(!campana)throw CustomError.badRequest('Campana not Exist')
           
            return campana
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer(`Error al eliminar la campaña: ${error}`);
        }
     

        



    }

}