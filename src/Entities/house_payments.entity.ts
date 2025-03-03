import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { houseEntity } from "./House.Entity";

@Entity()

export class housePaymentEntity{
    
    @PrimaryGeneratedColumn()
    houseId: number;
    
    @ManyToOne(() => houseEntity, house => house.payments, {onDelete: 'CASCADE'})
    house: houseEntity;

    @Column({type:'decimal',precision:10, scale:2})
    amountPaid:number;

    @Column({ type: 'varchar', length: 255 })
    payerName: string; // To track who made the payment

    @Column({ type: 'varchar', length: 50 })
    tx_ref: string; // PayChangu transaction reference

    @Column({ default: 'pending' })
    status: string; // pending, successful, failed

    @Column({ default:0})
    balance: number

    @CreateDateColumn()
    paymentDate: Date;
}