import { regularExps } from '../../../config';
import { CustomError } from '../../errors/custom.error';


export class UserDto{

    //* creamos de manera privada para que no pueda ser llamada desde afuera
    constructor (   
        public readonly  ruc:string,
        public readonly  razonSocial:string,
        public readonly  tipoContribuyente:string,
        public readonly  tipoRegimen:string,
        public readonly  representateLegal:string,
        public readonly  dni:number,
        public readonly  celular:string,
        public readonly  email:string,
        public readonly  emailValidate:string,
        public readonly  password:string,
        public readonly  online:string,
        public readonly  img:string,
        public readonly  role:string[],
        public readonly  registrado:boolean,
      
        

     ){}

     static create (obj:{[key:string]:any}): [string?,UserDto?]{    
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


         if (!ruc)return ['Missing ruc']
         if (!razonSocial)return ['Missing razonSocial']
         if (!tipoContribuyente)return ['Missing tipoContribuyente']
         if (!tipoRegimen)return ['Missing tipoRegimen']
         if (!representateLegal)return ['Missing Representante Legal']
         if (!dni)return ['Missing dni']
         if ( !regularExps.dni.test(dni))return ['Invalid dni']
         if (!celular)return ['Missing celular']
         if (!email)return ['Missing email']
         if( !regularExps.email.test(email))return ['Invalid email'] 
         // if (!password)return ['Missing password']
         // if(password.length <6)return ['Password too short']

        

        return  [undefined ,
         
         new UserDto(
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