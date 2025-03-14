import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { HousePayment } from './installmentPayment';


@Entity()
export class InstallmentPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => HousePayment, (house) => house.payments, { onDelete: 'CASCADE' })
  house: HousePayment;

  @Column()
  amountPaid: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;
}
