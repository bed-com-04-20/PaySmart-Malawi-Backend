import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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


}