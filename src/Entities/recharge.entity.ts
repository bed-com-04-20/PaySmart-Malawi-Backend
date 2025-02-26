import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RechargeEntity {  // <-- Change to PascalCase
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serviceType: 'escom' | 'waterboard';

    // @Column()
    // accountIdentifier: string;
    @Column()
    meterNo: number;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    units: number;
    @Column()
    tx_ref: string;

    @Column()
    status: string;

    @Column()
    token: number;

    // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    // rechargeDate: Date;
    @CreateDateColumn({type: 'timestamp'})
    rechargeDate: Date;

    @CreateDateColumn()
    createdAt: Date;
}
