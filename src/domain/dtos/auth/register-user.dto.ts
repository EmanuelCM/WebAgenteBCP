import { regularExps } from "../../../config";


export class RegisterUserDto{


    private constructor(
        public ruc :string,
        public email :string,
        public password :string,
    ){}

    static create (obj:{[key:string]:any}):[string?,RegisterUserDto?]{
        const {ruc,email,password}=obj;
        if (!ruc)return ['Missing ruc']
        if (!email)return ['Missing email']
        if( !regularExps.email.test(email))return ['Invalid email'] //* validamos el email con las expreciones regulares
        if (!password)return ['Missing password']
        if (password.length <6)return ['Password too short']
            return [undefined,new RegisterUserDto(ruc,email,password)]
    }

}
