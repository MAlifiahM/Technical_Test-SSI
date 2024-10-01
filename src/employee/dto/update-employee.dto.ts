import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum EmployeeStatus {
  KONTRAK = 'kontrak',
  TETAP = 'tetap',
  PROBATION = 'probation',
}
export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Jhon', required: false, type: String })
  readonly nama?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1, required: false, type: Number })
  readonly nomor?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Manager', required: false, type: String })
  readonly jabatan?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'IT', required: false, type: String })
  readonly departmen?: string;

  @IsDateString(
    {},
    {
      message: 'tanggal_masuk must be a valid date string format (YYYY-MM-DD)',
    },
  )
  @IsOptional()
  @ApiProperty({ example: '2022-01-01', required: false, type: Date })
  readonly tanggal_masuk?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'image.png', required: false, type: String })
  readonly foto?: string;

  @IsEnum(EmployeeStatus)
  @IsOptional()
  @ApiProperty({ example: 'kontrak', required: false, type: String })
  readonly status?: EmployeeStatus;
}
