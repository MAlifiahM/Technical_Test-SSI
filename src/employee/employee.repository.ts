import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './employee.schema';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(employee: Employee): Promise<Employee> {
    const newEmployee = new this.employeeModel(employee);
    return newEmployee.save();
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Employee[]; total: number }> {
    const total = await this.employeeModel.countDocuments().exec();
    const data = await this.employeeModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { data, total };
  }

  async findOne(id: string): Promise<Employee> {
    return this.employeeModel.findById(id).exec();
  }

  async update(id: string, employee: UpdateEmployeeDto): Promise<Employee> {
    return this.employeeModel
      .findByIdAndUpdate(id, employee, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Employee> {
    return this.employeeModel.findByIdAndDelete(id).exec();
  }
}
