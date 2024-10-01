import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from './employee.schema';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.employeeRepository.create(createEmployeeDto);
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Employee[]; total: number }> {
    return this.employeeRepository.findAll(page, limit);
  }

  async findOne(id: string): Promise<Employee> {
    return this.employeeRepository.findOne(id);
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeRepository.update(id, updateEmployeeDto);
  }

  async remove(id: string) {
    return this.employeeRepository.remove(id);
  }
}
