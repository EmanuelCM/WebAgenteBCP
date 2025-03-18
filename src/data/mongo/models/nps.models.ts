// src/models/indicador.model.ts
import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IIndicador extends Document {
  terminal: string;
  nombreComercial: string;
  notanps: number;
  fechaOperacion: Date;
  fechaRespuesta: Date;
  terminalID:ObjectId


  // Otros campos según tus necesidades
}

const IndicadorSchema = new Schema({
  terminal: { type: String, required: true },
  nombreComercial: { type: String, required: true },
  notanps: { type: Number, required: true },
  fechaOperacion: { type: Date, required: true },
  fechaRespuesta: { type: Date, required: true },
  terminalID:{
    type:Schema.Types.ObjectId,
    ref:'Terminal',
    required:true,
  }

}, {
  timestamps: true
});

export const IndicadorModel = mongoose.model<IIndicador>('Indicador', IndicadorSchema);