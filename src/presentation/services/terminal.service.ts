import { UserModel } from "../../data";
import { TerminalModel } from "../../data/mongo/models/terminal.model";
import { CustomError, TerminalDto } from "../../domain";
import mongoose, { ObjectId } from 'mongoose';
import {PaginationDto} from '../../domain/dtos/shared/pagination.dto';



export class TerminalService{


    constructor(){}


    async createTerminal(terminalDto:TerminalDto){

        const terminalExists= await TerminalModel.findOne({terminal:terminalDto.terminal});
        if (terminalExists) throw CustomError.badRequest('Terminal alredy exists')

        const userExists= await UserModel.findOne({ruc:terminalDto.ruc});
        if (!userExists) throw CustomError.badRequest("User not found for the given RUC");

        const userObjectId = userExists._id; 

            try{


                const terminal= new TerminalModel({

                    ...terminalDto,
                    user:userObjectId,
                    

                })  
                await terminal.save();

                return {
                    terminal:terminal.terminal,
                    nombreComercial:terminal.nombreComercial,
                    ruc:terminal.ruc,

                }

            } catch(error:any){
                console.error("Error creating terminal:", error.message);
                throw CustomError.internalServer(error.message);
            }

    }

    async deleteTerminal(terminal:string){

        const terminalExists= await TerminalModel.findOne({terminal});
        if (!terminalExists) throw CustomError.badRequest('Terminal not exists')
        
           try {
            await TerminalModel.deleteOne({terminal});
            return {
                message:true,
                terminal:{
                    terminal:terminalExists.terminal,
                    nombreComercial:terminalExists.nombreComercial,
                    ruc:terminalExists.ruc,

                }
            };
        }catch(error){
            console.error("Error deleting terminal:", error);
            throw CustomError.internalServer("Internal server error");
        }


    }


    async getByTerminal(terminal:string,paginationDto:PaginationDto){
        const terminalExists= await TerminalModel.findOne({terminal});
        if (!terminalExists) throw CustomError.badRequest('Terminal not exists')

            
        const {page,limit} = paginationDto

        try {
                        const [total,data]= await Promise.all([
            TerminalModel.countDocuments(),
            TerminalModel.find({terminal})
            .skip((page-1)*limit)
            .limit(limit).
            populate('user')
            ])
    
            return {
                page,
                limit,
                total,
                data
                // terminals    
            }
        }
        catch (error) {
            throw CustomError.internalServer('Internal server Error')
        }
    }
    async getTerminalByRuc(userId:ObjectId){

        try {   
        const terminals = await TerminalModel.find({user:userId});
        return terminals;
        }
        catch (error) {
            throw CustomError.internalServer('Internal server Error')
        }
    }

    async updateTerminal(terminal:string,update:TerminalDto){

        const terminalExists= await TerminalModel.findOne({terminal});
        if (!terminalExists) throw CustomError.badRequest('Terminal not exists')


        try { 

            const terminalExistObject = terminalExists.toObject();
            const validUpdate : Record <string, any>= {};
            
            for ( const key of Object.keys(update) as (keyof TerminalDto)[]){

                if ( !(key  in new TerminalDto('','',0,new Date,'','','','','','','','','','' ))){
                    throw CustomError.badRequest(`Invalid field: ${key}`);

                }

                const value = update[key]; 
                const [error]= TerminalDto.create ({...terminalExistObject, [key]: value});
             
                if ( error) throw CustomError.badRequest(`Invalid ${key}:${error}`)
                validUpdate[key]= value;
            }
                const updateTerminal= await TerminalModel.findOneAndUpdate(
                    {terminal},
                    {$set:validUpdate},
                    {new:true, runValidators:true}

                );
      
                return updateTerminal
                // return {
                //     'user':updateUser
                // }


            }  catch (error:any) {
             console.log( ' Error updating Terminal', error);
             throw CustomError.internalServer(error.message)
        }

    }

}