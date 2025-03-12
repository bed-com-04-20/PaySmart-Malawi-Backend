import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TvPackageEntity } from "./TVpackages.entity";

@Entity()

export class TVServiceEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty()
    name: string;

    @OneToMany(() => TvPackageEntity, (pkg) => pkg.services )
    packages: TvPackageEntity[];

    
}