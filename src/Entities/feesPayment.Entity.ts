import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { InstallmentPayment } from "./Paid.entity";


@Entity()
export class FeesPayment {
  @PrimaryGeneratedColumn()
  id: number; 

  // The total fee that the student is expected to pay
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalFee: number; 

  // The cumulative amount paid by the student through installments.
  // This could alternatively be calculated from the sum of installment payments.
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid: number;

  // Automatically updated/managed remaining balance (totalFee - amountPaid)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  remainingBalance: number; 

  // Optional: The due date for the fee payment, which can be used for reminders or late fee calculations.
  @Column({ type: 'timestamp', nullable: true })
  dueDate: Date; 

  // Student registration number
  @Column()
  regNo: string;

  @Column()
  name: string;

  // Student full name
  @Column()
  studentName: string;

  // One-to-many relation to installment payments. This is the collection of all partial payments.
  @OneToMany(() => InstallmentPayment, installmentPayment => installmentPayment.feesPayment)
  installmentPayments: InstallmentPayment[];
}
