import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { PatientEntity } from './patient.entity';



@Entity()
export class InstallmentsHospitalPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PatientEntity, (hospitalFee) => hospitalFee.installments)
  hospitalFee: PatientEntity;

  @Column('numeric')
  amountPaid: number;

  // You can store additional details such as transaction ids or notes here:
  @Column({ nullable: true })
  transactionRef: string;

  @CreateDateColumn()
  paymentDate: Date;
}
