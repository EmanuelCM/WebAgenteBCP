import fs from 'fs/promises';
import * as xlsx from 'xlsx';
import { CustomError } from '../../domain';
import { IIndicador, IndicadorModel } from '../../data/mongo/models/nps.models';
import { dateAdapter } from '../../config/date.adapter';
import { TerminalModel } from '../../data/mongo/models/terminal.model';



export class DataUploadService {
  constructor() {}

  static async uploadIndicadores(filePath: string) {
    try {
      // 📌 ✅ Verificar si el archivo existe antes de procesarlo
      try {
        await fs.access(filePath);
      } catch {
        throw CustomError.badRequest('El archivo no existe en la carpeta uploads');
      }

      // 📌 ✅ Leer el archivo Excel con opciones para manejar fechas
      const workbook = xlsx.readFile(filePath, {
        cellDates: true,
        dateNF: 'yyyy-mm-dd'
      });
      
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      console.log(sheetName);
 
      const data = xlsx.utils.sheet_to_json(worksheet, {
        raw: false,
        dateNF: 'yyyy-mm-dd'
      }) as IIndicador[];


      const bulkOperations = await Promise.all(data.map(async row => {
        try {
          // Buscar el ObjectId del terminal basado en su código
          const terminal = await TerminalModel.findOne({ terminal: row.terminal }).select('_id')  //.lean();
          console.log(terminal);

          return {
            insertOne: {
              document: {
                terminal:row.terminal,
                nombreComercial: row.nombreComercial,
                notanps: row.notanps,
      
                // Convertimos fechas con la función adecuada
                fechaOperacion: dateAdapter.parseDate(row.fechaOperacion) || new Date(),
                terminalID: terminal, // Guardamos el ObjectId del terminal
                fechaRespuesta: dateAdapter.parseDate(row.fechaRespuesta) || new Date(),
              }
            }
          };
        } catch (err) {
          console.error(`Error procesando terminal ${row.terminal}:`, err);
          return null; // Ignoramos este registro en caso de error
        }
      }));
      
      // Filtrar operaciones válidas (descartar posibles `null` en caso de errores)
      const validOperations = bulkOperations.filter(op => op !== null);
      
      // 📌 ✅ Insertar datos en la base de datos con `bulkWrite()`
      if (validOperations.length > 0) {
        await IndicadorModel.bulkWrite(validOperations, { ordered: false }); 
      }
      
      // 📌 ✅ Eliminar el archivo después de procesarlo
      await fs.unlink(filePath);
      
      return { message: 'Carga completada', total: validOperations.length };

      
    } catch (error) {
      console.error('Error al cargar indicadores:', error);
      throw error;
    }
  }
}