import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TVServiceEntity } from "./TVservice.entity";

@Entity()
export class TvPackageEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    @Column()
    price: number;

    @ManyToMany(()=> TVServiceEntity, (service) => service.packages)
    services: TVServiceEntity[];



   
}