import {regularExps} from '../../../config';




export class LoginUserDto{

    private constructor(
        public ruc :number,
        public password :string,
    ){}
    
    static create (obj:{[key:string]:any}):[string?,LoginUserDto?]{
        const {ruc,password}=obj;
        if (!ruc)return ['Missing ruc'];
        if (!password)return ['Missing password'];
        if (password.length <6)return ['Password too short'];

        return [undefined,new LoginUserDto(ruc,password)];
        



    }


}