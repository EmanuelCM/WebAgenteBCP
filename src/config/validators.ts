import mongoose from "mongoose";



export class Validator{


    static isMongoID(id:string){

        return mongoose.isValidObjectId(id);

    }


}