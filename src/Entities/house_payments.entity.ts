import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { houseEntity } from "./House.Entity";

@Entity()

export class housePaymentEntity{
    
    @PrimaryGeneratedColumn()
    paymentId: number;
    
    @ManyToOne(() => houseEntity, house => house.payments, {onDelete: 'CASCADE'})
    house: houseEntity;
}