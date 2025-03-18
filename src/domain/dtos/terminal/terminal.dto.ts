import mongoose from "mongoose";

export class TerminalDto{


 constructor(
        public readonly terminal:string,
        public readonly nombreComercial:string,
        public readonly ruc: number, // Ahora ruc es ObjectId
        public readonly fechaInstalacion:Date,
        public readonly jefeComercial:string,
        public readonly ejecutivoComercial:string,
        public readonly departamento:string,
        public readonly provincia:string,
        public readonly distrito:string,
        public readonly direccion:string,
        public readonly rubroEspecifico:string,
        public readonly coordenadaX:string,
        public readonly coordenadaY:string,
        public readonly nombreAgencia:string,
    ){}


    static create (obj:{[key:string]:any}):[string?,TerminalDto?]{

        const {
                terminal,
                nombreComercial,
                ruc,
                fechaInstalacion,
                jefeComercial,
                ejecutivoComercial,
                departamento,
                provincia,
                distrito,
                direccion,
                rubroEspecifico,
                coordenadaX,
                coordenadaY,
                nombreAgencia,
    }=obj;


        if(!terminal)return ['Missing terminal']
        if(!nombreComercial)return ['Missing nombreComercial']
        if(!ruc)return ['Missing ruc']
        if(!fechaInstalacion)return ['Missing fechaInstalacion']
        if(!jefeComercial)return ['Missing jefeComercial']
        if(!ejecutivoComercial)return ['Missing ejecutivoComercial']
        if(!departamento)return ['Missing departamento']
        if(!provincia)return ['Missing provincia']
        if(!distrito)return ['Missing distrito']
        if(!direccion)return ['Missing direccion']
        if(!rubroEspecifico)return ['Missing rubroEspecifico']
        if(!coordenadaX)return ['Missing coordenadaX']
        if(!coordenadaY)return ['Missing coordenadaY']
        if(!nombreAgencia)return ['Missing nombreAgencia']  

        return [undefined,
            new TerminalDto(      
                terminal,
                nombreComercial,
                ruc,
                fechaInstalacion,
                jefeComercial,
                ejecutivoComercial,
                departamento,
                provincia,
                distrito,
                direccion,
                rubroEspecifico,
                coordenadaX,
                coordenadaY,
                nombreAgencia,)];
    }



}