import * as ExcelJS from 'exceljs';
import { Injectable } from '@nestjs/common';
import { Employee } from '../employee/employee.schema';
import { generateFilename } from './filename.util';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { formatDate } from './date-format.util';

@Injectable()
export class CsvExportService {
  async exportToCsv(employees: Employee[]): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employees');

    worksheet.columns = [
      { header: 'Nama', key: 'nama' },
      { header: 'Nomor', key: 'nomor' },
      { header: 'Jabatan', key: 'jabatan' },
      { header: 'Departmen', key: 'departmen' },
      { header: 'Tanggal Masuk', key: 'tanggal_masuk' },
      { header: 'Foto', key: 'foto' },
      { header: 'Status', key: 'status' },
    ];

    employees.forEach((employee) => {
      const formattedEmployee = {
        nama: employee.nama,
        nomor: employee.nomor,
        jabatan: employee.jabatan,
        departmen: employee.departmen,
        tanggal_masuk: employee.tanggal_masuk
          ? formatDate(employee.tanggal_masuk)
          : '-',
        foto: employee.foto,
        status: employee.status,
      };
      worksheet.addRow(formattedEmployee);
    });

    const filename = generateFilename('employees', '.csv');
    const exportdir = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      'export',
      'csv',
    );

    fs.mkdirSync(exportdir, { recursive: true });

    const filePath = path.join(exportdir, filename);
    await workbook.csv.writeFile(filePath);
  }
}
