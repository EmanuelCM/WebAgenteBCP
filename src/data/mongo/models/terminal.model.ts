import mongoose, { Schema } from "mongoose";

// export interface ITerminal  {
//     ruc:number,
//     terminal:string,
//     nombreComercial:string,
// }

const terminalSchema = new Schema({


    terminal:{
        type:String,
        unique:true
    },
    nombreComercial:{
        type:String,
        require:true,
    },

    ruc:{
        type:Number,
        require:true,
    },
    fechaInstalacion:{
        type:Date,
        require:true,
    },
    jefeComercial:{
        type:String,
        require:true
    },
    ejecutivoComercial:{
        type:String,
        require:true
    },	
    departamento:{
        type:String,
        require:true
    },	
    provincia:{
        type:String,
        require:true
    },	
    distrito:{
        type:String,
        require:true
    },	
    direccion:{
        type:String,
        require:true
    },	
    rubroEspecifico:{
        type:String,
        require:true
    },	
    coordenadaX:{
        type:String,
        require:true
    },	
    coordenadaY:{
        type:String,
        require:true
    },	
    nombreAgencia:{
        type:String,
        require:true
    },


    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true,
    },
    
});

terminalSchema.set('toJSON',{
        virtuals:true,
        versionKey:false,
        transform:function(doc,ret,options){
            delete ret._id;
        }
    })

export const TerminalModel = mongoose.model('Terminal',terminalSchema);