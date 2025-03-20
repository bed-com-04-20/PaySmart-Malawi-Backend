import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class RechargeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ['escom', 'waterboard'] })
    serviceType: 'escom' | 'waterboard';

    @Column({ type: 'bigint' })  
    meterNo: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    units: number;

   
    @Column({ default: 'pending' }) // Change 'pending' to your preferred default status
     status: string;


    @Column({ type: 'bigint', nullable:true })
    token: number;
    @Column({ default: 'pending' }) 
    paymentStatus: string; // pending, paid, failed


    @CreateDateColumn({ type: 'timestamp' })
    rechargeDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    
}
