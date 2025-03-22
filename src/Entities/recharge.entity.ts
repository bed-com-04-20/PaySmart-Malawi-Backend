import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class RechargeEntity {
    @PrimaryGeneratedColumn('uuid') // Using UUID for better transaction tracking
    id: string;

    @Column({ type: 'enum', enum: ['escom', 'waterboard'] })
    serviceType: 'escom' | 'waterboard';

    @Column({ type: 'bigint' })  
    meterNo: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    units: number; // Se
    @Column({ type: 'enum', enum: ['pending', 'completed'], default: 'pending' }) 
    status: string; // Tracks recharge processing state

    @Column({ type: 'enum', enum: ['pending', 'paid', 'failed'], default: 'pending' }) 
    paymentStatus: string; // Tracks payment status

    @Column({ type: 'bigint', nullable: true })
    token: number; // Will be generated only after successful p
    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4(); // Automatically assigns a UUID before inserting
    }
}
