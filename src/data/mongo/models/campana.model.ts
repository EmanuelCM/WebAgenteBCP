import mongoose, { ObjectId, Schema } from 'mongoose';



export interface ICampana extends Document {

    _id?: ObjectId; // 👈 Agregamos _id como opcional

    titulo: string;
    descripcion?: string;
    premios?: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: boolean;
    img?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


const CampanaSchema = new Schema({
    titulo :{
         type:String,
          required:true 
        },
    descripcion :{ 
        type:String,
         required:true 
        },
    premios :{
         type:String,
          },
    fechaInicio :{
         type:Date,
          required:true 
        },
    fechaFin :{ 
        type:Date,
         required:true 
        },
    estado :{
         type:Boolean,
         default:true, 
        },
    img :{
         type:String,
         default:''
        },
}, {        
    timestamps: true
});

export const CampanaModel = mongoose.model<ICampana>('Camapana', CampanaSchema);