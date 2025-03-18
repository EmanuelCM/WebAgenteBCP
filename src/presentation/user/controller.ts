import {Request, Response} from 'express';
import {CustomError, PaginationDto} from '../../domain';
import { UserDto } from '../../domain/dtos/user/user.dto';
import { UserService } from '../services/user.service';
import { UserModel } from '../../data';



export class UserController{

    constructor(
        private readonly userService:UserService

    ){} 
    

    private handleError=(error:unknown, res:Response)=>{
        //* validamos si error recibido esta instanciado en nuestra clase 
        if (error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message});
        }

        return res.status(500).json({error:`Internal Error`})
    }


    createUser = (req:Request, res:Response)=>{
        const [error,userEntity] = UserDto.create(req.body);
        if (error) return res.status(401).json({error});

        this.userService
        .createUser(userEntity!)
        .then (user=> res.status(201).json(user))
        .catch(error=> this.handleError(error,res));

    }


    uploadUser = (req:Request, res:Response)=>{
        
    }

    deleteUser = (req:Request, res:Response)=>{
        const ruc=req.params.ruc;
        this.userService
        .deleteUser(ruc!)
        .then (user=> res.status(201).json(user))        
        .catch(error=> this.handleError(error,res));
    }



    updateUser =async (req:Request, res:Response)=>{


        const {ruc} =req.params;
        const update = req.body;

        if (!ruc) return res.status(400).json({error:'Missing ruc'})
        if ( !update || Object.keys(update).length===0) return res.status(400).json({error:'Missing update'})
        
        this.userService
        .updateUser(ruc,update)
        .then (user=> res.status(201).json(user))        
        .catch(error=> this.handleError(error,res));
 
    }

    findUser =async (req:Request, res:Response)=>{
        const {ruc} =req.params;
        if (!ruc) return res.status(400).json({error:'Missing ruc'})

        this.userService
        .findUser(ruc)
        .then (user=> res.status(201).json(user))
        .catch(error=> this.handleError(error,res));

    
    }

    findUserAll =async (req:Request, res:Response)=>{
       
        const {page=1,limit=10}= req.query;
        const [error,paginationDto]= PaginationDto.create(+page,+limit)
        if (error) return  res.status(401).json({error})

        this.userService
        .findUserAll(paginationDto!)
        .then (user=> res.status(201).json(user))
        .catch(error=> this.handleError(error,res));

    
    }

}