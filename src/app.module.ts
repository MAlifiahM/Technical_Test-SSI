import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeController } from './employee/employee.controller';
import { EmployeeService } from './employee/employee.service';
import { EmployeeSchema } from './employee/employee.schema';
import { EmployeeRepository } from './employee/employee.repository';
import { CsvImportService } from './utils/csv-import.service';
import { CsvExportService } from './utils/csv-export.service';
import { PdfExportService } from './utils/pdf-export.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    CsvImportService,
    CsvExportService,
    PdfExportService,
    EmployeeRepository,
  ],
})
export class AppModule {}
