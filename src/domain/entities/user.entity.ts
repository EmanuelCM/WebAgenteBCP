import {CustomError} from '../errors/custom.error';
import {regularExps} from '../../config';
import {LoginUserDto} from '../dtos/auth/login-user.dto';

export class UserEntity{    
    constructor (   
        public ruc:string,
        public razonSocial:string,
        public tipoContribuyente:string,
        public tipoRegimen:string,
        public representateLegal:string,
        public dni:number,
        public celular:string,
        public email:string,
        public emailValidate:string,
        public password:string,
        public online:string,
        public img:string,
        public role:string[],
        public registrado:boolean,
      
        

     ){}

     static fromObject (obj:{[key:string]:any}){    
        const {
         ruc,
         razonSocial,
         tipoContribuyente,
         tipoRegimen,
         representateLegal,
         dni,
         celular,
         email,
         emailValidate,
         password,
         online,
         img,
         role,
         registrado,
        }=obj;


         // if (!ruc)throw CustomError.badRequest('Missing ruc')
         // if (!razonSocial)throw CustomError.badRequest('Missing razonSocial')
         // if (!tipoContribuyente)throw CustomError.badRequest('Missing tipoContribuyente')
         // if (!tipoRegimen)throw CustomError.badRequest('Missing tipoRegimen')
         // if (!representateLegal)throw CustomError.badRequest('Missing Representante Legal')
         // if (!dni)throw CustomError.badRequest('Missing dni')
         // // if ( !regularExps.dni.test(dni))return ['Invalid dni']
         // if (!celular)throw CustomError.badRequest('Missing celular')
         // if (!email)throw CustomError.badRequest('Missing email')
         // if( !regularExps.email.test(email))return ['Invalid email'] 
         // if (!password)throw CustomError.badRequest('Missing password')
         // if(password.length <6)return ['Password too short']

               //   return [undefined,new LoginUserDto(ruc,password)];

        return  [undefined ,
         
         new UserEntity(
         ruc,
         razonSocial,
         tipoContribuyente,
         tipoRegimen,
         representateLegal,
         dni,
         celular,
         email,
         emailValidate,
         password,
         online,
         img,
         role,
         registrado,   
      ) ]
     }  
    }