import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { StudentFee } from './Student.entity';


@Entity()
export class InstallmentsFeesPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StudentFee, (studentFee) => studentFee.installments)
  studentFee: StudentFee;

  @Column('numeric')
  amountPaid: number;

  // You can store additional details such as transaction ids or notes here:
  @Column({ nullable: true })
  transactionRef: string;

  @CreateDateColumn()
  paymentDate: Date;
}
