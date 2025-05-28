import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { InstallmentPayment } from './installmentPayment';

@Entity()
export class HousePayment {
   @PrimaryGeneratedColumn()
   deltaNumber: number; // Unique identifier and primary key for the house

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
