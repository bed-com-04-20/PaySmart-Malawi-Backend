import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { housePaymentEntity } from "./house_payments.entity";

@Entity()

export class houseEntity{
    @PrimaryGeneratedColumn()
    houseId: number;

    @Column()
    location: string;

    @Column()
    rentAmount: number;

    @Column({default:0})
    balance: number;


    
    @OneToMany(() => housePaymentEntity, payment => payment.house)
    payments: housePaymentEntity[]

}