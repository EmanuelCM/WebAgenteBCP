import {UserModel} from '../../data';
import { CustomError } from "../../domain";
import { UserDto } from "../../domain/dtos/user/user.dto";
import {PaginationDto} from '../../domain/dtos/shared/pagination.dto';




export class UserService{


    constructor(){}
    

    async createUser(userDto:UserDto){

        const userExists= await UserModel.findOne({ruc:userDto.ruc });
        const mailExist= await UserModel.findOne({email:userDto.email });

        if (userExists) throw CustomError.badRequest('User alredy exists')  
        if (mailExist) throw CustomError.badRequest('Mail alredy exists')  


        try {
            const user = new  UserModel(userDto); 
            await user.save({ validateBeforeSave: true });


            return  {
                ruc:user.ruc,
                razonSocial:user.razonSocial,
                representativeLegal:user.representateLegal
            }
    
        } catch (error:any) {
            console.error('Error Creating User',error.message);
            throw CustomError.internalServer(error.message);
        }
    }

     async deleteUser(ruc:string){
         const userExists= await UserModel.findOne({ruc });
         if (!userExists) throw CustomError.badRequest('User not exists')
         try {
             await UserModel.deleteOne({ruc});
             return {
                message:true,
                user:{
                    ruc:userExists.ruc,
                    name:userExists.razonSocial,    
                }
            };
         } catch (error:any) {
             console.error('Error Deleting User',error.message);
             throw CustomError.internalServer(error.message);
         }
     }


     async updateUser(ruc:string,updates:UserDto){

               // Buscar usuario existente
               const existingUser = await UserModel.findOne({ ruc });
               if (!existingUser) {
                   throw CustomError.badRequest("User not found");
               }

               try {
        // Convertimos el usuario existente en un objeto para manipularlo
        const existingUserObject = existingUser.toObject();

        // Creamos un objeto para almacenar solo los valores válidos
        const validUpdates: Record<string, any> = {};

        for (const key of Object.keys(updates) as (keyof UserDto)[]) {

            if (!(key in new UserDto('', '', '', '', '', 0, '', '', '', '', '', '', [], false))) {
                throw CustomError.badRequest(`Invalid field: ${key}`);
            }
        

            const value = updates[key as keyof UserDto];
            // Validamos cada campo antes de actualizar
            const [error] = UserDto.create({ ...existingUserObject, [key]: value });
            if (error) throw CustomError.badRequest(` ${error}`);

            // Agregar campo validado a los updates
            validUpdates[key] = value;
        }
 
        // Aplicamos solo los cambios validados
        const updatedUser = await UserModel.findOneAndUpdate(
            { ruc },
            { $set: validUpdates },
            { new: true, runValidators: true }
        );

        return updatedUser;
            } catch (error: any) {
            console.error("Error updating user:", error);
            throw CustomError.internalServer(error.message);
        }
     }

     async findUser(ruc:string){
        const user = await UserModel.findOne({ruc});
        console.log(user);
        if (!user) throw CustomError.badRequest("User not found");
        
        return user!
     }

    async findUserAll(paginacionDto:PaginationDto){
        const {page,limit}= paginacionDto;

        try{
            const [total,user]=await Promise.all([
                UserModel.countDocuments(),
                UserModel.find()
                .skip((page-1)*limit)
                .limit(limit)
            ])

            return {
                page,
                limit,
                total,
                user
            }

        }catch(error){
            console.log(error);
            throw CustomError.internalServer('Internal server Error')

        }

     }
}




