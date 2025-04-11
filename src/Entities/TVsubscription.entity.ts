import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { TvPackageEntity } from "./TVpackages.entity";

@Entity()
export class TVsubscription {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => TvPackageEntity)
    @JoinTable() // This decorator marks this side as the owning side.
    packages: TvPackageEntity[];

    @Column({nullable:true})
    accountNumber: string;

    @Column()
    tx_ref: string;

    @Column()
    status: string;

    @CreateDateColumn()
    created_at: Date;
}
