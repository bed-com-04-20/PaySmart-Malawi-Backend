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

    @Column({ unique: true })
    tx_ref: string;

    @Column()
    status: string;

    @Column({ type: 'bigint' })
    token: number;

    @CreateDateColumn({ type: 'timestamp' })
    rechargeDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    generateTxRef() {
        this.tx_ref = `PSM-${uuidv4()}`; // Auto-generate tx_ref before inserting into DB
    }
}
