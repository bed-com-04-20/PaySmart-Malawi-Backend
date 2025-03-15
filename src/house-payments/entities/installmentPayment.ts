import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { HousePayment } from './house-payment.entity';

@Entity()
export class InstallmentPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HousePayment, (house) => house.payments, { onDelete: 'CASCADE' })
  house: HousePayment;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountPaid: number; // Amount paid in this installment

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;
}
