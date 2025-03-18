import { CustomError } from "../../errors/custom.error";
import {ICampana} from '../../../data/mongo/models/campana.model';


// export class  CampanaDto{

//  constructor(

//         public  titulo:string,
//         public  descripcion:string,
//         public  premios:string,
//         public  fechaInicio:Date,
//         public  fechaFin:Date,
//         public  estado:boolean,
//         public  img:string,
//     ){}

//     static parseDate(dateValue: string): Date  {

//         const dateParse= new Date(dateValue);
//         if (isNaN(dateParse.getTime())) throw CustomError.badRequest('Invalid date');
//             return dateParse;
    


//     }
    
//     static create (obj:{[key:string]:any}):[string?,CampanaDto?]{
//         const {titulo,img,descripcion,premios,fechaInicio,fechaFin,estado=false}=obj;
//          let estadoBoolean=estado;
        
        
//         if (!titulo)return ['Missing titulo'];
//         if (!descripcion)return ['Missing descripcion'];
//         if (!premios)return ['Missing premios'];
//         if (!fechaInicio)return ['Missing fechaInicio'];
//         if (!fechaFin)return ['Missing fechaFin'];
//         if (typeof estado !=='boolean'){
//             estadoBoolean= (estado==='true')
//         }

//         const parseFechaInicio= this.parseDate(fechaInicio);
//         const parseFechaFin= this.parseDate(fechaFin);

//           return [undefined,new CampanaDto(titulo,descripcion,premios,parseFechaInicio,parseFechaFin,estado,img)];


//     }

// }


export class CampanaDto {
    constructor(
        public titulo: string,
        public descripcion: string,
        public premios: string,
        public fechaInicio: Date,
        public fechaFin: Date,
        public estado: boolean,
        public img: string,
    ) {}

    static parseDate(dateValue: any): Date {
        // Si ya es una instancia de Date, simplemente retornarla
        if (dateValue instanceof Date) {
            if (isNaN(dateValue.getTime())) throw CustomError.badRequest('Invalid date object');
            return dateValue;
        }
        
        // Si es string o puede convertirse a Date
        const dateParse = new Date(dateValue);
        if (isNaN(dateParse.getTime())) throw CustomError.badRequest('Invalid date format');
        return dateParse;
    }


    static validateDate ( validUpdate :Record<string, any>,campana: ICampana) {


        if (validUpdate.fechaInicio && validUpdate.fechaFin) {
            if (validUpdate.fechaInicio > validUpdate.fechaFin) {
              return  CustomError.badRequest('fechaInicio must be before fechaFin');
            }
        } else if (validUpdate.fechaInicio && campana.fechaFin) {
            if (validUpdate.fechaInicio > campana.fechaFin) {
                throw CustomError.badRequest('fechaInicio must be before fechaFin');
            }
        } else if (validUpdate.fechaFin && campana.fechaInicio) {
            if (campana.fechaInicio > validUpdate.fechaFin) {
                throw CustomError.badRequest('fechaInicio must be before fechaFin');
            }
        }
    }
    
    static validateField(fieldName: string, value: any): string | undefined {
        switch(fieldName) {
            case 'titulo':
                return !value ? 'Missing titulo' : undefined;
            case 'descripcion':
                return !value ? 'Missing descripcion' : undefined;
            case 'premios':
                return undefined; // No es obligatorio
            case 'fechaInicio':
                try {
                    this.parseDate(value);
                    return undefined;
                } catch (error: any) {
                    return error.message;
                }
            case 'fechaFin':
                try {
                    this.parseDate(value);
                    return undefined;
                } catch (error: any) {
                    return error.message;
                }
            case 'estado':
                return typeof value !== 'boolean' && value !== 'true' && value !== 'false' 
                    ? 'Estado must be boolean' 
                    : undefined;
            case 'img':
                return undefined; // No es obligatorio
            default:
                return `Unknown field: ${fieldName}`;
        }
    }
    
    static create(obj: { [key: string]: any }): [string?, CampanaDto?] {
        const { titulo, img = '', descripcion, premios = '', fechaInicio, fechaFin, estado = false } = obj;
        
        if (!titulo) return ['Missing titulo'];
        if (!descripcion) return ['Missing descripcion'];
        if (!fechaInicio) return ['Missing fechaInicio'];
        if (!fechaFin) return ['Missing fechaFin'];
        
        let estadoBoolean = estado;
        if (typeof estado !== 'boolean') {
            estadoBoolean = (estado === 'true');
        }

        try {
            const parseFechaInicio = this.parseDate(fechaInicio);
            const parseFechaFin = this.parseDate(fechaFin);
            
            return [undefined, new CampanaDto(
                titulo, 
                descripcion, 
                premios, 
                parseFechaInicio, 
                parseFechaFin, 
                estadoBoolean, 
                img
            )];
        } catch (error: any) {
            return [error.message];
        }
    }
}