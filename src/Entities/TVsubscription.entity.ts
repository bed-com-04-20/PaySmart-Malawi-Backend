import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TvPackageEntity } from "./TVpackages.entity";

@Entity()
export class TVsubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(()=> TvPackageEntity)
    packages: TvPackageEntity[];

    @Column()
    accountNumber: string;

    @Column()
    tx_ref: string;

    @Column()
    status:string

    @CreateDateColumn()
    created_at: Date;


}