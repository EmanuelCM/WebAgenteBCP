import { Request, Response } from "express";
import { CustomError, RegisterUserDto,LoginUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { UserModel } from "../../data";
import { UserEntity } from '../../domain/entities/user.entity';


export class AuthController {

    //DI
    constructor (

        private readonly authService:AuthService,

    ) {}

    private handleError(error:unknown,res:Response){
        
        if(error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message});
        }
        console.log(`${error}`);
        return res.status(500).json({error:'Internal Server Error'});
    }


    registerUser =(req:Request, res:Response)=>{

        const [error,userEntity ]= UserEntity.fromObject(req.body);
        
        if(error)return res.status(400).json({error});
        
        this.authService.registerUser(userEntity! as UserEntity)
        .then((user)=> res.json({user}))
        .catch((error)=> this.handleError(error,res));
        

    } 

    loginUser =(req:Request, res:Response)=>{
        const [error,loginUserDto]=LoginUserDto.create(req.body);
        if (error ) return res.status(400).json({error});

        this.authService.loginUser(loginUserDto!)
        .then((user)=> res.json({user}))
        .catch((error)=> this.handleError(error,res));

    } 

     getUser = async (req:Request, res:Response)=>{

        const users= await UserModel.find(); 
        res.json(users);

    }

    public validateEmail = async (req:Request, res:Response)=>{ 

        const {token}=req.params;

        this.authService.validateEmail(token)
        .then(()=> res.json('Email validated')) 
        .catch((error)=> this.handleError(error,res));
        
    }
}  