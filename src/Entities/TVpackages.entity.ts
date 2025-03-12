import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TVServiceEntity } from "./TVservice.entity";

@Entity()
export class TvPackageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @ManyToOne(() => TVServiceEntity, (service) => service.packages, { eager: true })
    service: TVServiceEntity;  // ✅ Change to single service (not an array)
}
