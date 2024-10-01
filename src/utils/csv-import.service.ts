import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';

@Injectable()
export class CsvImportService {
  constructor(private readonly employeeService: EmployeeService) {}

  async importCsv(filePath: string): Promise<void> {
    const results: CreateEmployeeDto[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          const employeeDto: CreateEmployeeDto = {
            nama: data.nama,
            nomor: Number(data.nomor),
            jabatan: data.jabatan,
            departmen: data.departmen,
            tanggal_masuk: new Date(data.tanggal_masuk),
            foto: data.foto,
            status: data.status as 'kontrak' | 'tetap' | 'probation',
          };
          results.push(employeeDto);
        })
        .on('end', async () => {
          for (const employee of results) {
            await this.employeeService.create(employee);
          }
          resolve();
        })
        .on('error', (err) => reject(err));
    });
  }
}
