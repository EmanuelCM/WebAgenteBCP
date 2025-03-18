// import { CustomError, RegisterUserDto ,LoginUserDto} from "../../domain";
// import { UserModel } from '../../data/mongo/models/user.model';
// import { UserEntity } from '../../domain/entities/user.entity';
// import { bcryptAdapter,envs,JwtAdapter } from "../../config";
// import { EmailService } from "./email.service";





// export class AuthService {
//     constructor(
//         private readonly emailService: EmailService
//     ) {}
    
//         public async registerUser(userEntity:UserEntity){
//          try {
//              const existUser = await UserModel.findOne({ruc:userEntity.ruc });

  
//         // Si el usuario ya está registrado, lanza un error
//             if (existUser && existUser.registrado)  throw CustomError.badRequest('User already exists');         

     
//             if (existUser && !existUser.registrado) {
//                 existUser.password = await bcryptAdapter.hash(userEntity.password); 
                

//                 // existUser.password = await bcryptAdapter.hash( userEntity.password); // Encripta antes de guardar
//                 existUser.registrado = true;
                         
//                 await existUser.save();

               
//                 const token = await JwtAdapter.generateToken({id:existUser.id});
//                 if (!token) throw CustomError.internalServer('Error generating token');
              


//                 await this.sendEmailValidationLink(existUser.email!);


//                 console.log(existUser);
//                 // const {password,...userEntity} = UserEntity.fromObject(existUser);
//                 const userEntity = UserEntity.fromObject(existUser);


//                 return {
//                     user:userEntity,
//                     token:token
//                 } 
//             }else {
//                 throw CustomError.badRequest('User no exists');    
//             }
           
//         } catch (error) {
//             throw CustomError.internalServer(`${error}`);
            
//         }
// }   


// public async loginUser(loginUserDto:LoginUserDto){

//     const user= await UserModel.findOne({ruc:loginUserDto.ruc});

//     if(user){
//         const isMatch = bcryptAdapter.compare(loginUserDto.password,user.password!);
//         if(!isMatch)throw CustomError.badRequest('Invalid password');
//         // const {password,...userEntity} = UserEntity.fromObject(user);
//         const userEntity = UserEntity.fromObject(user);


//         const token = await JwtAdapter.generateToken({id:user.id});
//         if (!token) throw CustomError.internalServer('Error generating token');
      
      
      
//         return {
//             user:userEntity,
//             token:token
//         }
        
//     }else{
//         throw CustomError.badRequest('User no exists');
//     }

// }

//     private sendEmailValidationLink= async(email:string)=>{
    
//         const token = await JwtAdapter.generateToken({email});
//         if(!token)throw CustomError.internalServer('Error generating token');

//         const  link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

//         const htmlBody = `
//             <h1>Bienvenido a nuestro servicio</h1>
//             <p>Para poder utilizar nuestro servicio, por favor, haga clic en el siguiente enlace:</p>
//             <a href="${link}">Validate your email</a>${email}`;
    
//         const options= {
//             to:email,
//             subject:'Validate your email',
//             htmlBody:htmlBody
//         }
        
//         const isSent = await this.emailService.sendEmail(options);
//         if(!isSent)throw CustomError.internalServer('Error sending email');

//         return true;
//         }   


//         public validateEmail = async (token:string)=>{

//             const payload = await JwtAdapter.validateToken(token);
//             if(!payload)throw CustomError.unauthorized('Invalid token');

//             const {email}=payload as {email:string};
//             if (!email) throw CustomError.internalServer('Email not in token');

//             const user = await UserModel.findOne({email});
//             if(!user)throw CustomError.internalServer('Emanil not exists');

//             user.emailValidate = true;

//             await user.save();

//             return true;


//         }

// }

import { CustomError, LoginUserDto } from "../../domain";

import { UserModel } from '../../data/mongo/models/user.model';
import { UserEntity } from '../../domain/entities/user.entity';
import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { EmailService } from "./email.service";


interface AuthResponse {
    user: UserEntity;
    token: string;
}

export class AuthService {
    constructor(
        private readonly emailService: EmailService
    ) {}

    public async registerUser(userEntity: UserEntity): Promise<AuthResponse> {
        try {
            const existUser = await UserModel.findOne({ ruc: userEntity.ruc });

            if (existUser?.registrado) {
                throw CustomError.badRequest('User already exists');
            }

            if (!existUser) {
                throw CustomError.badRequest('User not found in pre-registration');
            }

            // Update existing user
            existUser.password = await bcryptAdapter.hash(userEntity.password);
            existUser.registrado = true;
            await existUser.save();

            const token = await this.generateUserToken(existUser.id);
            await this.sendEmailValidationLink(existUser.email!);

            const [error, registeredUser] = UserEntity.fromObject(existUser);
            if (error || !registeredUser) {
                throw CustomError.internalServer('Error creating user entity');
            }

            return {
                user: registeredUser,
                token
            };

        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto): Promise<AuthResponse> {
        try {
            const user = await UserModel.findOne({ ruc: loginUserDto.ruc });
            if (!user) {
                throw CustomError.badRequest('User does not exist');
            }

            const isValidPassword = bcryptAdapter.compare(loginUserDto.password, user.password);
            if (!isValidPassword) {
                throw CustomError.badRequest('Invalid credentials');
            }

            const token = await this.generateUserToken(user.id);
            const [error, userEntity] = UserEntity.fromObject(user);

            if (error || !userEntity) {
                throw CustomError.internalServer('Error creating user entity');
            }

            return {
                user: userEntity,
                token
            };

        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async validateEmail(token: string): Promise<boolean> {
        try {
            const payload = await JwtAdapter.validateToken<{ email: string }>(token);
            if (!payload?.email) {
                throw CustomError.unauthorized('Invalid token');
            }

            const user = await UserModel.findOne({ email: payload.email });
            if (!user) {
                throw CustomError.notFound('Email not found');
            }

            user.emailValidate = true;
            await user.save();

            return true;

        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    private async generateUserToken(userId: string): Promise<string> {
        const token = await JwtAdapter.generateToken({ id: userId });
        if (!token) {
            throw CustomError.internalServer('Error generating token');
        }
        return  token as string;
    }

    private async sendEmailValidationLink(email: string): Promise<boolean> {
        const token = await JwtAdapter.generateToken({ email });
        if (!token) {
            throw CustomError.internalServer('Error generating token');
        }

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const htmlBody = `
            <h1>Bienvenido a nuestro servicio</h1>
            <p>Para poder utilizar nuestro servicio, por favor, haga clic en el siguiente enlace:</p>
            <a href="${link}">Validate your email</a>
        `;

        const isSent = await this.emailService.sendEmail({
            to: email,
            subject: 'Validate your email',
            htmlBody
        });

        if (!isSent) {
            throw CustomError.internalServer('Error sending email');
        }

        return true;
    }
}