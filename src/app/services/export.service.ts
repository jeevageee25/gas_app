import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() {
  }

  exportToExcel(data:any, columns:any, filename:any): void {

    const tableData = data.map((row:any) => {
      let rowItem:any = {};
      columns.forEach((column:any) => {
        rowItem[column.title] = row[column.key] || (column.type === "number" ? '0' : '');
      });
      return rowItem;
    });

    try {
      /* generate worksheet */
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tableData);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } catch (err) {
      console.error('export error', err);
    }
  }
}
