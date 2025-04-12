import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FeesPayment } from './feesPayment.Entity';


@Entity()
export class InstallmentPayment {
  @PrimaryGeneratedColumn()
  id: number;

  // Amount paid in this individual installment
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid: number;

  // Date when this installment was made
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  // Optional field to add any notes or comments about this installment payment
  @Column({ nullable: true })
  comment: string;

  // Many-to-One relationship: each installment payment is associated with one FeesPayment record.
  // The onDelete option ensures that if the FeesPayment is deleted, so are its related installments.
  @ManyToOne(() => FeesPayment, feesPayment => feesPayment.installmentPayments, { onDelete: 'CASCADE' })
  feesPayment: FeesPayment;
}
