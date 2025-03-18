import { Request ,Response} from "express";
import { CustomError ,TerminalDto} from "../../domain";
import { TerminalService } from '../services/terminal.service';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { TerminalModel } from "../../data/mongo/models/terminal.model";
import { regularExps } from '../../config/regular-exp';
import { UserModel } from "../../data";





export class TerminalController{

    constructor(

        private readonly terminalService:TerminalService,
    ){} 
    

    private handleError=(error:unknown, res:Response)=>{
        //* validamos si error recibido esta instanciado en nuestra clase 
        if (error instanceof CustomError){
            return res.status(error.statusCode).json({error:error.message});
        }

        return res.status(500).json({error:`Internal Error`})
    }

    

    createTerminal=(req:Request,res:Response)=>{
        const [ error,terminalDto]=TerminalDto.create(req.body);
        if (error) return res.status(400).json({error});


        this.terminalService.createTerminal(terminalDto!)
        .then (terminal=> res.status(201).json(terminal))
        .catch(error=> this.handleError(error,res));
    }


    deleteTerminal = async (req:Request, res:Response)=>{
        const terminal= req.params.terminal;
        
        this.terminalService.deleteTerminal(terminal)
        .then (terminal=> res.status(201).json(terminal))
        .catch(error=> this.handleError(error,res));
    }




    getByTerminal = async (req:Request, res:Response)=>{

        const terminal= req.params.terminal;


        
        const {page=1,limit=10}= req.query;
        const [error,paginationDto]= PaginationDto.create(+page,+limit)
        if (error) return  res.status(401).json({error})


        this.terminalService.getByTerminal(terminal,paginationDto!)
        .then(terminals=> res.status(201).json(terminals))
        .catch(error=> this.handleError(error,res))
    }


    getTerminalByRuc = async (req:Request, res:Response)=>{

        const userExists= await UserModel.findOne({ruc:req.params.ruc});
        if (!userExists) return res.status(404).json({error:'User not exists'})

        this.terminalService.getTerminalByRuc(userExists.id)
        .then (terminals=> res.status(201).json(terminals))
        .catch(error=> this.handleError(error,res))

    }

    updateTerminal = async (req: Request, res:Response)=>{

        const {terminal}= req.params;
        const update = req.body;


        if (!terminal) return res.status(400).json({error:'Missing terminal'})
        if ( !update || Object.keys(update).length===0) return res.status(400).json({error:'Missing update data'})

        this.terminalService.updateTerminal(terminal,update)
        .then (terminal=> res.status(201).json(terminal))        
        .catch(error=> this.handleError(error,res));

    }



}