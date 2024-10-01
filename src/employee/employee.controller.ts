import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Res,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvImportService } from '../utils/csv-import.service';
import { diskStorage } from 'multer';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { extname } from 'path';
import { Response } from 'express';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CsvExportService } from '../utils/csv-export.service';
import { PdfExportService } from '../utils/pdf-export.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly csvImportService: CsvImportService,
    private readonly csvExportService: CsvExportService,
    private readonly pdfExportService: PdfExportService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error creating employee',
    type: Error,
  })
  @ApiBody({ type: CreateEmployeeDto })
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const newEmployee = await this.employeeService.create(createEmployeeDto);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: 'Employee created successfully',
        data: newEmployee,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating employee',
        error: error.message,
      });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully',
    type: [CreateEmployeeDto],
    example: {
      status: 200,
      message: 'Employees retrieved successfully',
      data: [
        {
          id: '1',
          name: 'John Doe',
          jabatan: 'Manager',
          department: 'IT',
          nomor: 12345,
          tanggal_masuk: '2020-01-01',
          foto: 'https://example.com/image.jpg',
          status: 'kontrak',
        },
      ],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error retrieving employees',
    type: Error,
  })
  @ApiQuery({ name: 'page', type: Number, example: 1, required: false })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: false })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res: Response,
  ) {
    try {
      const { data, total } = await this.employeeService.findAll(page, limit);
      const totalPages = Math.ceil(total / limit);

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Employees retrieved successfully',
        data,
        pagination: {
          totalItems: total,
          totalPages,
          currentPage: parseInt(String(page)),
          pageSize: parseInt(String(limit)),
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving employees',
        error: error.message,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee retrieved successfully',
    type: CreateEmployeeDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error retrieving employee',
    type: Error,
  })
  @ApiParam({ name: 'id', type: String, example: '1', required: true })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const employee = await this.employeeService.findOne(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Employee retrieved successfully',
        data: employee,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving employee',
        error: error.message,
      });
    }
  }

  @Post('upload-csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/import',
        filename: (_, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload CSV file' })
  @ApiResponse({
    status: 201,
    description: 'CSV data imported successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Error importing CSV data',
    type: Error,
  })
  @ApiBody({ type: 'multipart/form-data', required: true })
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      await this.csvImportService.importCsv(file.path);
      return res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: 'CSV data imported successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error importing CSV data',
        error: error.message,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
    type: UpdateEmployeeDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Error updating employee',
    type: Error,
  })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiParam({ name: 'id', type: String, example: '1', required: true })
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const updatedEmployee = await this.employeeService.update(
        id,
        updateEmployeeDto,
      );
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Employee updated successfully',
        data: updatedEmployee,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating employee',
        error: error.message,
      });
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete employee by ID' })
  @ApiResponse({
    status: 200,
    description: 'Employee deleted successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Error deleting employee',
    type: Error,
  })
  @ApiParam({ name: 'id', type: String, example: '1', required: true })
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.employeeService.remove(id);
      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Employee deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting employee',
        error: error.message,
      });
    }
  }

  @Get('/export/csv')
  @ApiOperation({ summary: 'Export employees to CSV' })
  @ApiResponse({
    status: 200,
    description: 'CSV exported successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Error exporting to CSV',
    type: Error,
  })
  async exportToCsv(@Res() response: Response) {
    try {
      const employees = await this.employeeService.findAll(1, 1000); // Adjust the limits as needed
      await this.csvExportService.exportToCsv(employees.data);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'CSV exported successfully',
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error exporting to CSV',
        error: error.message,
      });
    }
  }

  @Get('/export/pdf')
  @ApiOperation({ summary: 'Export employees to PDF' })
  @ApiResponse({
    status: 200,
    description: 'PDF exported successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Error exporting to PDF',
    type: Error,
  })
  async exportToPdf(@Res() response: Response) {
    try {
      const employees = await this.employeeService.findAll(1, 1000); // Adjust the limits as needed
      await this.pdfExportService.exportToPdf(employees.data);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'PDF exported successfully',
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error exporting to PDF',
        error: error.message,
      });
    }
  }
}
