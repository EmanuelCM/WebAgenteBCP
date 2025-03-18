

import  mongoose,{ Schema } from 'mongoose';

export interface IComisionHistorico  {

    comision:number,
    fechaComision:Date,
    estado:string,
    fechaAbono:Date,
    
        //terminal:string,
}

const comisionHistoricoSchema = new Schema({
  
    comision:{
         type:Number,
         required:true,
    },
    fechaComision:{
         type:Date,
         required:true,

    },
    estado:{
         type:String,
         required:true,

    },
    fechaAbono:{
         type:Date,
         required:true,
        },

    terminal:{
        type:Schema.Types.ObjectId,
        ref:'Terminal',
        required:true,
    }

    });

    comisionHistoricoSchema.set('toJSON',{
        virtuals:true,
        versionKey:false,
        transform:function(doc,ret,options){
            delete ret._id;
        }
    })

    export const ComisionHistoricoModel = mongoose.model<IComisionHistorico>('ComisionHistorico',comisionHistoricoSchema);