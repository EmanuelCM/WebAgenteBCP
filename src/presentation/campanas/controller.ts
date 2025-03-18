import { CampanaDto, CustomError, PaginationDto } from '../../domain';
import { Request, Response } from 'express';
import { CampanaService } from '../services/campana.service';
import { CampanaModel } from '../../data';
import { Types } from 'mongoose';






export class CampanasController{


    constructor(
        private readonly CampanaService:CampanaService,

    ){} 


        private handleError(error:unknown,res:Response){
            
            if(error instanceof CustomError){
                return res.status(error.statusCode).json({error:error.message});
            }
            console.log(`${error}`);
            return res.status(500).json({error:'Internal Server Error'});
        }

    createCampanas = (req: Request, res: Response) => {
        const [error, campanaDto] = CampanaDto.create(req.body);
        if (error) {
            return this.handleError(CustomError.badRequest(error), res);
        }

        this.CampanaService.createCampana(campanaDto!)
            .then((campana) => res.status(201).json({ campana }))
            .catch((error) => this.handleError(error, res));
    }


    getCampanas = (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        
        if (error) {
            return this.handleError(CustomError.badRequest(error), res);
        }

        this.CampanaService.getCampanas(paginationDto!)
            .then(campanas => res.status(200).json(campanas))
            .catch(error => this.handleError(error, res));
    }

    deleteCampana = (req: Request, res: Response) => {
        const { id } = req.params;

        this.validateID( id, res)
        const campanaObjectId = new Types.ObjectId(id);
        
        this.CampanaService.
        deleteCampana(campanaObjectId)
        .then(campana => { res.status(200).json({
                    message: 'Campaign deleted successfully',
                    campana
                });
            })
        .catch(error => this.handleError(error, res));
    }

    updateCampanas = (req: Request, res: Response) => {
        const { id } = req.params;
        const update = req.body;

        this.validateID( id, res)

        if (!update || Object.keys(update).length === 0) {
            return this.handleError(CustomError.badRequest('Missing update data'), res);
        }

        CampanaModel.findById(id)
        .then(campanaExist => {
                if (!campanaExist) {
                    throw CustomError.notFound('Campaign not found');
                }
                return this.CampanaService.updateCampana(campanaExist, update);
            })
            .then(campana => res.status(200).json({
                message: 'Campaign updated successfully',
                campana
            }))
            .catch(error => this.handleError(error, res));
    }

    private validateID( id: any, res:Response){
        
        if (!id || id === ':id') {
            return this.handleError(CustomError.badRequest('Missing campaign ID'), res);
        }

        if (!Types.ObjectId.isValid(id)) {
            return this.handleError(CustomError.badRequest('Invalid campaign ID format'), res);
        }
    }
}

