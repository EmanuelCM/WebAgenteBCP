

export  class dateAdapter{


  // Función auxiliar para convertir fechas de Excel a JavaScript Date
  private static excelDateToJSDate(excelDate: number): Date {
    // Excel usa el sistema de fecha serializada donde 1 = 1/1/1900
    // Ajustamos por la diferencia entre la fecha base de Excel y la época Unix
    return new Date((excelDate - 25569) * 86400 * 1000);
  }

  // Función auxiliar para convertir cualquier tipo de fecha
  public static parseDate(dateValue: any): Date | null {
    if (!dateValue) return null;
    
    // Si es una fecha válida, retornarla
    if (dateValue instanceof Date) return dateValue;
    
    // Si es un número (formato serial de Excel)
    if (typeof dateValue === 'number') {
      return this.excelDateToJSDate(dateValue);
    }
    
    // Si es un string, intentar varias estrategias:
    if (typeof dateValue === 'string') {
      // 1. Intentar parsear directamente (funcionará con strings ISO)
      const directParse = new Date(dateValue);
      if (!isNaN(directParse.getTime())) return directParse;
      
      // 2. Verificar si es un número en formato string
      const numericValue = Number(dateValue);
      if (!isNaN(numericValue)) {
        return this.excelDateToJSDate(numericValue);
      }
      
      // 3. Intentar con formato DD/MM/YYYY o similar
      // Nota: ajusta estos patrones según los formatos que puedas recibir
      const dateParts = dateValue.split(/[\/\-\.]/);
      if (dateParts.length === 3) {

        // Intenta interpretar como DD/MM/YYYY
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Meses en JS son 0-11
        const year = parseInt(dateParts[2], 10);
        
        const parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate.getTime())) return parsedDate;
        
        // Si el anterior falló, intenta MM/DD/YYYY
        const parsedDate2 = new Date(year, day - 1, month + 1);
        if (!isNaN(parsedDate2.getTime())) return parsedDate2;
      }
    }
    
    // Si ninguna estrategia funcionó, retornar null
    console.warn(`No se pudo parsear la fecha: ${dateValue}`);
    return null;
  }

}

