
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({


    ruc:{
        type:Number,
        require:true,
        unique:true
    },
    razonSocial:{
        type:String,
        require:true,
    },
    tipoContribuyente:{
        type:String,
        require:true,
    },
    tipoRegimen:{
        type:String,
        require:true,
    }, 

    representateLegal:{
        type:String,
        require:true,
    },
    dni:{
        type:Number,
        require:true,
    },
    celular:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        unique:true,
        require:true,
    },
    emailValidate:{
        type:Boolean,
        default:false,
    },
    password:{
        type:String,
        default:'',
        require:true
    },
    online:{
        type:Boolean,
        default:false
    },

    img:{
        type:String,
        default:''
    },

    role:{
        type:[String],
        default:['USER_ROLE'],
        enum:['USER_ROLE','ADMIN_ROLE']
    },
    registrado:{
        type:Boolean,
        default:false
    },
   
  }
)


//* TODO: crear un metodo que nos devuelva el objeto json 
//* con solo los campos que necesitamos(sin datos sensibles)
// UserSchema.method('toJSON',function(){
//     const {__v,_id,password,...object}=this.toObject();
//     object.uid=_id;
//     return object;
// }



export const UserModel = mongoose.model('User',userSchema);