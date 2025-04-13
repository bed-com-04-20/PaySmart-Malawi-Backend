import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm';
import { InstallmentsFeesPayment } from './installment-payment.entity';
import { InstallmentPayment } from 'src/house-payments/entities/installmentPayment';

  
  @Entity()
  export class StudentFee {
    @PrimaryGeneratedColumn()
    id: number;
  
    // Unique registration number for the student
    @Column({ unique: true })
    registrationNumber: string;
  
    @Column()
    studentName: string;
  
    @Column()
    yearOfStudy: string;
  
    // You can also add the university as an enum if needed:
    @Column()
    university: string;
  
    @Column('numeric')
    totalFees: number;
  
    @Column('numeric', { default: 0 })
    paidAmount: number;
  
    @Column('numeric', { default: 0 })
    remainingBalance: number;
  
    @Column({ default: false })
    isFullyPaid: boolean;
  
    @OneToMany(() => InstallmentsFeesPayment, (installment) => installment.studentFee)
    installments: InstallmentPayment[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  