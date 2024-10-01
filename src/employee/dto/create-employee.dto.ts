import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe', required: true, type: String })
  readonly nama: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1234567890, required: true, type: Number })
  readonly nomor: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Backend Developer', required: true, type: String })
  readonly jabatan: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Tech', required: true, type: String })
  readonly departmen: string;

  @IsDateString(
    {},
    {
      message: 'tanggal_masuk must be a valid date string format (YYYY-MM-DD)',
    },
  )
  @IsNotEmpty()
  @ApiProperty({ example: '2020-01-01', required: true, type: Date })
  readonly tanggal_masuk: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://example.com/foto.jpg',
    required: true,
    type: String,
  })
  readonly foto: string;

  @IsEnum(['kontrak', 'tetap', 'probation'])
  @IsNotEmpty()
  @ApiProperty({ example: 'kontrak', required: true, type: String })
  readonly status: 'kontrak' | 'tetap' | 'probation';
}
