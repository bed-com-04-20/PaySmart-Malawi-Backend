import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { InstallmentPayment } from './house-payment.entity';


@Entity()
export class HousePayment {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   deltaNumber: number; // Unique identifier for the house

   @Column()
   location: string;

   @Column()
   price: number; // Total price of the house

   @Column({ default: 0 })
   paidAmount: number; // Total paid across installments

   @Column({ default: true })
   isFullyPaid: boolean; // Automatically update when fully paid

   @Column({ default: 0 })
   remainingBalance: number; // Auto-updated

   @OneToMany(() => InstallmentPayment, (installment) => installment.house, { cascade: true })
   payments: InstallmentPayment[]; // List of installment payments
}
