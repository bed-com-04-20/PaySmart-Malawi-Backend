import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RechargeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: ['escom', 'waterboard'] })
    serviceType: 'escom' | 'waterboard';

    @Column({ type: 'bigint' })  // Ensures large numbers are handled correctly
    meterNo: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    units: number;

    @Column({nullable:true})
    tx_ref: string;

    @Column({nullable:true})
    status: string;

    @Column({ type: 'bigint', nullable:true }) // Use `bigint` for 15-digit token numbers
    token: number;

    @CreateDateColumn({ type: 'timestamp' })
    rechargeDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}
