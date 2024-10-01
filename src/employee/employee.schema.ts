import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true })
  nama: string;

  @Prop({ required: true })
  nomor: number;

  @Prop({ required: true })
  jabatan: string;

  @Prop({ required: true })
  departmen: string;

  @Prop({ type: Date, required: true })
  tanggal_masuk: Date;

  @Prop({ required: true })
  foto: string;

  @Prop({ required: true, enum: ['kontrak', 'tetap', 'probation'] })
  status: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.tanggal_masuk = ret.tanggal_masuk.toISOString().split('T')[0];
    return ret;
  },
});

EmployeeSchema.set('toObject', {
  transform: (_, ret) => {
    ret.tanggal_masuk = ret.tanggal_masuk.toISOString().split('T')[0];
    return ret;
  },
});
