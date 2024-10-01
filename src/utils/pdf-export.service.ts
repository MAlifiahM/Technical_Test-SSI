import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { Employee } from '../employee/employee.schema';
import { generateFilename } from './filename.util';
import { formatDate } from './date-format.util';

@Injectable()
export class PdfExportService {
  async exportToPdf(employees: Employee[]): Promise<void> {
    const doc = new PDFDocument();

    const exportDir = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      'export',
      'pdf',
    );
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filename = generateFilename('employees', '.pdf');
    doc.pipe(fs.createWriteStream(`${exportDir}/${filename}`));

    employees.forEach((employee) => {
      doc.text(`Nama: ${employee.nama}`);
      doc.text(`Nomor: ${employee.nomor}`);
      doc.text(`Jabatan: ${employee.jabatan}`);
      doc.text(`Departmen: ${employee.departmen}`);
      doc.text(`Tanggal Masuk: ${formatDate(employee.tanggal_masuk)}`);
      doc.text(`Status: ${employee.status}`);
      doc.text('-------------------------------');
    });

    doc.end();
  }
}
