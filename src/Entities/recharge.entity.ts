import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RechargeEntity {  // <-- Change to PascalCase
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    serviceType: 'escom' | 'waterboard';

    @Column()
    accountIdentifier: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    units: number;

    @Column()
    token: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    rechargeDate: Date;
}
